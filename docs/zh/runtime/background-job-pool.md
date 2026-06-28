---
title: BackgroundJobPool
description: 优先级感知的异步作业池，用于事件持久化与外部发布，支持优雅关闭与磁盘持久化。
group: runtime
order: 10
summary: 优先级感知的异步作业池，支持优雅关闭。
related:
  - runtime/agent-runtime
  - events/agent-event
  - events/runtime-event-store
---

# `BackgroundJobPool`

> 异步事件持久化与外部发布，与 run 循环解耦。

`BackgroundJobPool` 是运行时的"以后做"队列。当 run 循环产生一个应被持久化或发布的 `AgentEvent` 时，runtime 把它作为一个 `BackgroundJob` 排入池中并继续。池按优先级顺序派发作业，将 in-flight 队列持久化到磁盘，并支持优雅关闭。

完整源码在 `src/runtime/job.rs`。

## 作业类型

```rust
pub enum JobType {
    PersistEvent { run_id: RunId, event: AgentEvent },
    PublishToQueue { publisher: String, event: AgentEvent },
    UpdateRunProjection { run_id: RunId },
    CompactSession { session_id: Uuid, trigger: CompactionTrigger },
    Custom { kind: String, payload: serde_json::Value },
}

pub struct BackgroundJob {
    pub id: JobId,
    pub priority: JobPriority,
    pub enqueued_at: Instant,
    pub job_type: JobType,
    pub conditions: JobConditions,
}
```

## 优先级

作业按严格优先级顺序执行：

```rust
pub enum JobPriority {
    Critical,  // 保留给熔断事件
    High,      // in-flight run 的事件持久化
    Normal,    // 外部发布
    Low,       // session 压缩、projection 更新
}
```

`Critical` 作业在任何 `High` 作业之前运行，以此类推。同优先级内按 FIFO 顺序。

## 条件

`JobConditions` 允许作业等待前置条件：

```rust
pub struct JobConditions {
    pub require_session_idle: bool,         // 等待 session gate 空闲
    pub wait_for_event_seq: Option<u64>,    // 等待特定事件先被持久化
    pub require_provider: Option<ProviderId>, // 仅当该 provider 已注册时运行
    pub deadline: Option<Duration>,         // 到期未开始则取消
}
```

条件在作业**出队时**评估，而不是入队时。这让 Operator 提前排入作业，让它们在正确时机派发。

## API

```rust
impl BackgroundJobPool {
    pub fn new(config: JobPoolConfig) -> Self;
    pub async fn enqueue(&self, job: BackgroundJob) -> JobId;
    pub async fn run(&self, shutdown: ShutdownToken) -> Result<(), RuntimeError>;
    pub fn stats(&self) -> JobPoolStats;
}
```

## 磁盘持久化

池把 in-flight 队列持久化到配置路径的 JSON 文件。重启时，崩溃时正在 in-flight 的作业会被重新入队。这给事件持久化提供了 at-least-once 语义。

## 优雅关闭

当 `ShutdownToken` 触发时，`pool.run(shutdown)` 干净退出：

1. 不再接受新作业。
2. 所有 in-flight 作业被 await 至完成。
3. 队列被刷到磁盘。
4. 池的 worker task 返回。

默认关闭超时 30 秒。如果作业没有按时完成，池返回 `RuntimeError::ShutdownTimeout`，剩余作业留在磁盘持久化队列里，等下次启动处理。

## 另见

- **[AgentRuntime](agent-runtime.md)** —— 生产者。
- **[AgentEvent](../../events/agent-event)** —— 事件类型。
- **[RuntimeEventStore](../../events/runtime-event-store)** —— 持久化后端。
