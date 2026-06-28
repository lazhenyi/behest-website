---
title: AgentEvent
description: " Every state change in the runtime, as a typed enum."
group: events
order: 2
summary: " The `AgentEvent` enum: every state change in the runtime."
related:
  - events/runtime-invocation
  - events/runtime-event-store
  - runtime/agent-runtime
  - runtime/run-state
---

# `AgentEvent`

> Every state change in the runtime, as a typed enum.

`AgentEvent` is the canonical event type emitted by the runtime. Every transition of the Turn FSM, every tool call, every error, and every lifecycle signal maps to a variant. The variant set is `#[non_exhaustive]` — new variants are added in minor versions.

The full file is `src/runtime/event.rs`.

## Variants (representative)

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

## Why an enum

A single `enum` with `#[non_exhaustive]` lets the runtime add new variants without breaking downstream consumers. Old subscribers match what they know and ignore the rest (the `#[non_exhaustive]` attribute forces a wildcard arm).

## `is_terminal`

A helper method classifies which variants end a run:

```rust
impl AgentEvent {
    pub fn is_terminal(&self) -> bool {
        matches!(self, Self::RunCompleted { .. } | Self::RunFailed { .. } | Self::RunCancelled { .. })
    }
}
```

Subscriptions often use this to drop their handler.

## See also

- **[RuntimeInvocation](runtime-invocation.md)** — the facade.
- **[RuntimeEventStore](runtime-event-store.md)** — durable storage.
- **[RunState](../runtime/run-state.md)** — the projection.
