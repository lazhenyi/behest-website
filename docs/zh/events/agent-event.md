---
title: AgentEvent
description: " 运行时中每一次状态变化的类型化枚举。"
group: events
order: 2
summary: " `AgentEvent` 枚举：运行时中每一次状态变化。"
related:
  - events/runtime-invocation
  - events/runtime-event-store
  - runtime/agent-runtime
  - runtime/run-state
---

# `AgentEvent`

> 运行时中每一次状态变化，以类型化枚举表达。

`AgentEvent` 是运行时发射的规范事件类型。Turn FSM 的每个转换、每个 tool call、每个错误、每个生命周期信号都映射到一个 variant。Variant 集合是 `#[non_exhaustive]` —— 新的 variant 在 minor 版本中加入。

完整源码在 `src/runtime/event.rs`。

## Variant（节选）

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
#[non_exhaustive]
pub enum AgentEvent {
    RunStarted { run_id: RunId, session_id: Uuid, provider: ProviderId, model: ModelName, input_preview: String },
    TurnStarted { run_id: RunId, iteration: usize },
    TextDelta { run_id: RunId, delta: String },
    TextComplete { run_id: RunId, content: String },
    ToolCall { run_id: RunId, call_id: String, tool_name: String, arguments: Value },
    ToolResult { run_id: RunId, call_id: String, output: ToolOutput, duration_ms: u64, status: ToolStatus },
    TurnCompleted { run_id: RunId, iteration: usize, finish_reason: FinishReason, usage: TokenUsage },
    RunCompleted { run_id: RunId, total_usage: TokenUsage, finish_reason: FinishReason },
    RunFailed { run_id: RunId, error: String, error_kind: RuntimeErrorKind },
    RunCancelled { run_id: RunId, reason: String },
    CompactionTriggered { run_id: RunId, session_id: Uuid, trigger: CompactionTrigger },
    CompactionCompleted { run_id: RunId, session_id: Uuid, summary_tokens: usize, original_tokens: usize },
    CompactionCircuitOpened { run_id: RunId, session_id: Uuid, failures: usize },
    DoomLoopDetected { run_id: RunId, kind: DoomLoopType },
    SnapshotSaved { run_id: RunId, seq: u64 },
    InputRejected { run_id: RunId, reason: String },
    SessionGateTimeout { run_id: RunId, session_id: Uuid, waited_ms: u64 },
}
```

## 为什么用枚举

单一的 `#[non_exhaustive]` 枚举让运行时可以加入新 variant 而不破坏下游消费者。旧订阅者匹配自己知道的，忽略其它（`#[non_exhaustive]` 强制通配分支）。

## `is_terminal`

辅助方法区分哪些 variant 终结一个 run：

```rust
impl AgentEvent {
    pub fn is_terminal(&self) -> bool {
        matches!(self, Self::RunCompleted { .. } | Self::RunFailed { .. } | Self::RunCancelled { .. })
    }
}
```

订阅常用它来 drop 自己的 handler。

## 另见

- **[RuntimeInvocation](runtime-invocation.md)** —— facade。
- **[RuntimeEventStore](runtime-event-store.md)** —— 持久化存储。
- **[RunState](../runtime/run-state.md)** —— 投影。
