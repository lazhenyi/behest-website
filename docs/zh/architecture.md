# 架构

## 运行时模型

在运行时层，`AgentRuntime` 编排完整的 agent 循环：

```text
RunRequest
  -> 加载或创建会话
  -> 准入输入
  -> 构建上下文
  -> 调用模型提供商
  -> 流式/持久化助手输出
  -> 执行工具调用
  -> 追加工具结果
  -> 重复直到完成、限制或错误
  -> 发射 AgentEvent 值
```

运行时将以下组件整合在一起：

- `ProviderRegistry`
- `ContextPipeline`
- `ToolRuntime`
- `RuntimeStore`
- `RuntimePolicy`
- `CompactionService`
- `SessionGate`
- 可选事件发布器
- 可选快照存储
- 可选后台任务池

## 错误模型

`behest` 暴露类型化的错误类别，而不是字符串化的框架失败：

- `ProviderError`
- `ToolError`
- `StorageError`
- `ContextError`
- `RuntimeError`
- 顶级 `Error`
- crate 级别 `Result<T>`

提供商错误区分不支持的能力、可重试失败、传输失败、无效响应和适配器特定错误。

工具错误区分缺失工具、无效参数、执行失败、超时和未实现的外部工具。

## Lint 策略

crate 有意保持严格：

- `unsafe_code = "forbid"`
- `missing_docs = "deny"`
- `unreachable_pub = "deny"`
- `clippy::all = "deny"`
- `dbg_macro = "deny"`
- `expect_used = "deny"`
- `todo = "deny"`
- `unimplemented = "deny"`
- `unwrap_used = "deny"`

该项目将公共 API 清晰度和失败路径卫生视为运行时契约的一部分。

## 运行时事件层

运行时事件层与 agent 循环并列，提供传输中立的 event sourcing，支持跨实例可观测性和事件回放：

```text
AgentRuntime
  -> AgentEvent
  -> RuntimeEventBridge
      -> RuntimeEventStore::append (持久化)
      -> RuntimeStreamAdapter::publish (实时扇出)
  -> RuntimeSubscriptionHub::subscribe_run
      -> 先 live，再 list_after replay
      -> 调用方通过 RuntimeEventEnvelope::seq 去重
```

核心类型：

- `RuntimeEventEnvelope` — 包装 `AgentEvent`，附加 `event_id` (UUIDv7)、per-run `seq`、`run_id`、可选 `session_id` 和 `emitted_at`。
- `RuntimeEventStore` — 持久化：`append(AgentEvent) -> RuntimeEventEnvelope` 与 `list_after(run_id, after_seq, limit)`。内存实现在单把 `Mutex` 下管理全部状态，保证序列号分配、session 传播和事件插入在每次 append 中是原子的。未知 run 返回空 replay。
- `RuntimeStreamAdapter` — 按 room（`Run` / `Session` / `Provider`）进行尽力而为的实时扇出。
- `RuntimeSubscriptionHub` — 组合 `EventStore` 与 `StreamAdapter`。`subscribe_run` 先开 live 订阅以避免 replay 与订阅之间的事件丢失；调用方通过 `seq` 对重叠的 envelope 去重。
- `RuntimeInvocation` — 传输中立的 `emit` / `on` facade。`on` handler 接收 `RuntimeEventEnvelope` 与 `Control` 句柄，可选的 `tokio::sync::Semaphore` 控制并发。runtime 维护 `session_map`（run_id → session_id），将 session 身份传播到每个事件。

后端（feature-gated）：

- `MemoryRuntimeEventStore` + `MemoryRuntimeStreamAdapter`（默认，进程内）。
- `RedisRuntimeEventStore`（Redis Streams XADD/XRANGE）+ `RedisRuntimeStreamAdapter`（Redis Pub/Sub）— `redis` feature。
- `PostgresRuntimeEventStore`（PostgreSQL `runtime_events` 表，event 使用 JSONB）— `sqlx-postgres` feature。
- `NatsJetStreamStreamAdapter`（每个 room 独立 JetStream stream，ephemeral pull consumer）— `nats` feature。

## 设计原则

### 类型安全优先

所有公共 API 都使用强类型，避免字符串化配置或动态分发（除非必要）。

### 显式错误

错误类型明确区分不同的失败模式，使调用者能够适当响应。

### 可组合性

组件通过 trait 抽象，允许替换和扩展，而无需修改核心逻辑。

### 最小公共表面

公共 API 有意保持紧凑，隐藏实现细节，同时提供足够的灵活性。

## 另请参阅

- [提供商](providers.md) - 提供商实现
- [工具](tools.md) - 工具运行时
- [事件](events.md) - 事件系统
