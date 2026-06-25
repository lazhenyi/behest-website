# 事件系统

behest 提供了一个全面的事件系统，用于监控和观察 agent 运行时执行。

## 概述

事件系统允许您：

- 实时监控 agent 执行
- 跟踪工具调用和执行
- 观察模型交互
- 实现自定义日志记录和分析
- 构建仪表板和审计跟踪

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

## 事件发布

### 外部事件发布器

将事件发布到外部消息代理：

```rust
use behest::prelude::*;

#[cfg(feature = "queue")]
pub trait EventPublisher: Send + Sync {
    async fn publish(&self, event: AgentEvent) -> QueueResult<()>;
}
```

### NATS 发布器

启用 `nats` 特性：

```toml
[dependencies]
behest = { version = "0.3", features = ["queue", "nats"] }
```

### Redis Streams 发布器

启用 `redis` 特性：

```toml
[dependencies]
behest = { version = "0.3", features = ["queue", "redis"] }
```

### NoOp 发布器

用于测试或不需要事件时：

```rust
use behest::prelude::*;

let publisher = NoOpPublisher::new();
```

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

- [架构](architecture.md) - 运行时模型
- [配置](configuration.md) - 队列配置
- [特性标志](features.md) - 队列特性标志
