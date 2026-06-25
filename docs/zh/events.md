# 事件系统

behest 提供了一个全面的事件系统，用于监控和观察 agent 运行时执行，同时提供传输中立的事件源机制，支持跨进程和跨主机场景。

## 概述

事件系统允许您：

- 实时监控 agent 执行
- 跟踪工具调用和执行
- 观察模型交互
- 实现自定义日志记录和分析
- 构建仪表板和审计跟踪
- 跨进程持久化与回放事件
- 向多个订阅者实时扇出事件

## AgentEvent

`AgentEvent` 枚举表示 agent 执行期间所有可能的事件：

```rust
use behest::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AgentEvent {
    RunStarted(RunStarted),
    ContextBuilt(ContextBuilt),
    ModelStarted(ModelStarted),
    TextDelta(TextDelta),
    ToolCallStarted(ToolCallStarted),
    ToolCallDelta(ToolCallDelta),
    ToolCallCompleted(ToolCallCompleted),
    ToolExecutionStarted(ToolExecutionStarted),
    ToolExecutionFinished(ToolExecutionFinished),
    AssistantMessageCommitted(MessageCommitted),
    ToolMessageCommitted(MessageCommitted),
    UsageRecorded(UsageRecorded),
    RunCompleted(RunCompleted),
    RunFailed(RunFailed),
    RunCancelled(RunCancelled),
    DoomLoopDetected(DoomLoopDetected),
    CompactionCircuitOpened(CompactionCircuitOpened),
}
```

### 事件类型

#### 运行事件

- `RunStarted` - 运行开始执行
- `RunCompleted` - 运行成功完成
- `RunFailed` - 运行失败
- `RunCancelled` - 运行被取消

#### 上下文事件

- `ContextBuilt` - 上下文管道已构建消息列表

#### 模型事件

- `ModelStarted` - 模型调用已开始
- `TextDelta` - 来自模型的流式文本增量

#### 工具事件

- `ToolCallStarted` - 工具调用已开始
- `ToolCallDelta` - 工具调用参数增量
- `ToolCallCompleted` - 工具调用已完成
- `ToolExecutionStarted` - 工具执行已开始
- `ToolExecutionFinished` - 工具执行已完成

#### 消息事件

- `AssistantMessageCommitted` - 助手消息已保存到存储
- `ToolMessageCommitted` - 工具消息已保存到存储

#### 使用事件

- `UsageRecorded` - token 使用已记录

#### 安全事件

- `DoomLoopDetected` - 检测到死循环
- `CompactionCircuitOpened` - 压缩断路器打开

## 运行时事件层

为了实现传输中立的事件源，behest 将 `AgentEvent` 包装为 `RuntimeEventEnvelope`，通过可插拔的 `RuntimeEventStore` 持久化，通过 `RuntimeStreamAdapter` 进行实时扇出。

### RuntimeEventEnvelope

```rust
pub struct RuntimeEventEnvelope {
    /// 全局唯一事件 id（UUIDv7）。
    pub event_id: RuntimeEventId,
    /// per-run 单调递增的序列号。
    pub seq: u64,
    /// 所属的 run。
    pub run_id: RunId,
    /// 所属的 session（由 `RunStarted` 传播），可选。
    pub session_id: Option<Uuid>,
    /// 包装的运行时事件。
    pub event: AgentEvent,
    /// envelope 由 runtime bridge 发射的时间。
    pub emitted_at: DateTime<Utc>,
}
```

`seq` 是 per-run 单调递增的，使订阅者能够在 replay 与 live 事件重叠时去重。

### RuntimeEventStore

`RuntimeEventEnvelope` 的持久化存储。进程内实现将全部状态置于单把 `Mutex` 之下，保证序列号分配、session 传播和事件插入在每次 append 中是原子的。未知 run 的 `list_after` 返回空页面，而不是错误。

```rust
#[async_trait]
pub trait RuntimeEventStore: Send + Sync {
    async fn append(&self, event: AgentEvent) -> Result<RuntimeEventEnvelope, RuntimeEventStoreError>;
    async fn list_after(
        &self,
        run_id: RunId,
        after_seq: Option<u64>,
        limit: usize,
    ) -> Result<Vec<RuntimeEventEnvelope>, RuntimeEventStoreError>;
}
```

### RuntimeStreamAdapter

envelope 的尽力而为的实时扇出。room 是类型化的：`RuntimeRoom::Run`、`RuntimeRoom::Session`、`RuntimeRoom::Provider`。

```rust
#[async_trait]
pub trait RuntimeStreamAdapter: Send + Sync {
    async fn publish(&self, room: RuntimeRoom, envelope: RuntimeEventEnvelope)
        -> Result<(), RuntimeStreamError>;
    async fn subscribe(&self, room: RuntimeRoom) -> Result<BoxRuntimeEventStream, RuntimeStreamError>;
}
```

adapter 失败是可恢复的：调用者被期望回退到 event store 进行 replay，并按 `event_id`/`seq` 去重。

### RuntimeSubscriptionHub

组合 `EventStore` 与 `StreamAdapter`。`subscribe_run` 先打开 live 订阅，再从 event store 拉取 replay 页面。调用者先消费 replay，再消费 live 事件，通过 `seq` 对任何重叠去重。

```rust
let subscription = hub.subscribe_run(run_id, after_seq, limit).await?;
let RuntimeSubscription { replay, mut live } = subscription;
for env in replay {
    handle(env).await;
}
while let Some(env) = live.next().await {
    handle(env).await;
}
```

### RuntimeEventBridge

`RuntimeEventBridge` 是 `AgentRuntime` 与事件层之间的接缝。它订阅 `AgentRuntime::subscribe()` 并将每个事件转发到 store 和 adapter：

```rust
let bridge = RuntimeEventBridge::new(Arc::new(runtime), store, adapter);
let handle = bridge.forward_events();
// drop handle to stop forwarding
```

bridge 的 `append` 失败不会阻塞 `publish`（反之亦然）—— 两条链路是独立的，短暂的 store 或 stream 故障不会阻塞另一条路径。

## RuntimeInvocation

`RuntimeInvocation` 是 `AgentRuntime` 之上的传输中立 `emit` / `on` facade，是 transport adapter 构建的基础。

```rust
use std::sync::Arc;
use behest::prelude::*;

let invocation = RuntimeInvocation::new(Arc::new(runtime));

// 订阅所有 run 的 text delta。
let handle = invocation.on(EventKind::TextDelta, |envelope, control| async move {
    if let AgentEvent::TextDelta(delta) = envelope.event {
        print!("{}", delta.delta);
    }
    let _ = control;
})?;
```

handler 签名为：

```rust
F: Fn(RuntimeEventEnvelope, Control) -> Fut + Send + Sync + 'static
```

`Control` 提供：

- `is_cancelled()` / `cancel()`
- `timeout()`
- `concurrency_limit()` — 当为 `Some` 时，listener 使用 `tokio::sync::Semaphore` 限制 in-flight handler 调用的并发数。

`RuntimeInvocation` 维护 `session_map`（run_id → session_id），使得同一 run 的所有 envelope 一致地携带 `RunStarted` 建立的 session 身份。

## 后端

### 内存（默认）

`MemoryRuntimeEventStore` 和 `MemoryRuntimeStreamAdapter` 是默认的进程内后端，是单元测试和单进程部署最简选择。

```rust
use std::sync::Arc;
use behest::prelude::*;

let store = Arc::new(MemoryRuntimeEventStore::new());
let adapter = Arc::new(MemoryRuntimeStreamAdapter::new());
let hub = RuntimeSubscriptionHub::new(store, adapter);
```

### Redis Streams + Pub/Sub

启用 `redis` feature：

```toml
[dependencies]
behest = { version = "0.3", features = ["redis"] }
```

- `RedisRuntimeEventStore` — Redis Streams 上的持久化（`XADD` 配合 `MAXLEN ~`，读取用 `XRANGE` + `COUNT`）。每次 `append` 增加该 run 的序列号计数器并存储 session id。
- `RedisRuntimeStreamAdapter` — Redis Pub/Sub 上的实时扇出。pubsub 订阅者使用专用连接（常规 `ConnectionManager` 用于 `PUBLISH`）。

```rust
#[cfg(feature = "redis")]
async fn setup_redis(client: redis::Client) -> Result<()> {
    let store = Arc::new(RedisRuntimeEventStore::new(client.clone()).await?);
    let adapter = Arc::new(RedisRuntimeStreamAdapter::new(client).await?);
    let hub = RuntimeSubscriptionHub::new(store, adapter);
    Ok(())
}
```

### PostgreSQL

启用 `sqlx-postgres` feature：

```toml
[dependencies]
behest = { version = "0.3", features = ["sqlx-postgres"] }
```

`PostgresRuntimeEventStore` 将 envelope 持久化到 `runtime_events` 表（event 存储为 JSONB），并在 `runtime_sessions` 表中跟踪 session 身份。store 可安全地跨 runtime 实例共享。

```sql
CREATE TABLE runtime_events (
    run_id     UUID         NOT NULL,
    seq        BIGINT       NOT NULL,
    event_id   UUID         NOT NULL,
    session_id UUID,
    event      JSONB        NOT NULL,
    emitted_at TIMESTAMPTZ  NOT NULL,
    PRIMARY KEY (run_id, seq)
);
CREATE TABLE runtime_sessions (
    run_id     UUID PRIMARY KEY,
    session_id UUID NOT NULL
);
```

```rust
#[cfg(feature = "sqlx-postgres")]
async fn setup_postgres(pool: sqlx::PgPool) -> Result<()> {
    let store = Arc::new(PostgresRuntimeEventStore::new(pool));
    // 与任何 RuntimeStreamAdapter 配对（如 Redis Pub/Sub 或 NATS JetStream）
    Ok(())
}
```

### NATS JetStream

启用 `nats` feature：

```toml
[dependencies]
behest = { version = "0.3", features = ["nats"] }
```

`NatsJetStreamStreamAdapter` 为每个 room 创建一个独立的 JetStream stream（Interest retention 策略）并为每个订阅创建一个 ephemeral pull consumer。`publish` 写入 room 的 stream；`subscribe` 返回一个 stream，在 consumer 收到 envelope 时 yield 它们。

```rust
#[cfg(feature = "nats")]
async fn setup_nats(client: async_nats::Client) -> Result<()> {
    let adapter = Arc::new(NatsJetStreamStreamAdapter::new(client));
    // 与任何 RuntimeEventStore 配对（如 Memory 或 Postgres）
    Ok(())
}
```

## 订阅事件

### 本地订阅

使用运行时的广播通道订阅事件：

```rust
use behest::prelude::*;
use behest::runtime::AgentEvent;
use std::sync::Arc;
use tokio::sync::broadcast;

#[tokio::main]
async fn main() -> Result<()> {
    let config = AgentConfigBuilder::default().build()?;
    let runtime = Arc::new(config.into_runtime().await?);

    // 订阅事件
    let mut events: broadcast::Receiver<AgentEvent> = runtime.subscribe();

    // 生成事件处理器
    tokio::spawn(async move {
        while let Ok(event) = events.recv().await {
            match event {
                AgentEvent::RunStarted(e) => {
                    println!("运行开始: {}", e.run_id);
                }
                AgentEvent::TextDelta(e) => {
                    print!("{}", e.delta);
                }
                AgentEvent::ToolCallStarted(e) => {
                    println!("工具调用: {}", e.tool_name);
                }
                AgentEvent::RunCompleted(e) => {
                    println!("运行完成: {}", e.run_id);
                }
                AgentEvent::RunFailed(e) => {
                    eprintln!("运行失败: {}", e.error);
                }
                _ => {}
            }
        }
    });

    // 使用运行时...
    Ok(())
}
```

### 事件过滤

使用 `EventKind` 按类型过滤事件：

```rust
use behest::prelude::*;

let handle = invocation.on(EventKind::TextDelta, |envelope, _control| async move {
    if let AgentEvent::TextDelta(delta) = envelope.event {
        print!("{}", delta.delta);
    }
})?;
```

`EventKind` 变体覆盖每个 `AgentEvent` 变体，外加一个 `Any` 兜底。`EventKind::matches_agent(&event)` 返回给定 `AgentEvent` 是否匹配。

## 配置

在 `behest.toml` 中配置事件发布：

```toml
[queue]
enabled = true
backend = "nats"

[queue.nats]
url = "nats://localhost:4222"
subject = "behest.events"
```

或使用 Redis：

```toml
[queue]
enabled = true
backend = "redis"

[queue.redis]
url = "redis://localhost:6379"
stream = "behest-events"
```

## 另请参阅

- [架构](architecture.md) - 运行时模型与运行时事件层
- [配置](configuration.md) - 队列配置
- [特性标志](features.md) - 运行时事件层特性标志
- [API 参考](api-reference.md) - RuntimeEventStore、RuntimeStreamAdapter、RuntimeSubscriptionHub
