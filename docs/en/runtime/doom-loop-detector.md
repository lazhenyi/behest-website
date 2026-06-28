---
title: DoomLoopDetector
description: Detects duplicate and cyclic tool calls, terminates runaway runs.
group: runtime
order: 9
summary: Duplicate and cycle detection for tool calls.
related:
  - runtime/agent-runtime
  - runtime/turn-fsm
  - tools/tool-runtime
---

# `DoomLoopDetector`

> Detects when an agent is calling the same tool over and over with no progress.

A "doom loop" is a tool call pattern that the model keeps repeating with no effective change — same arguments, or a cycle of arguments that loops back. The detector raises an error and the FSM terminates the run with `RunStatus::Failed { reason: DoomLoop }`.

The full file is `src/runtime/doom_loop.rs`.

## Detection rules

1. **Exact duplicate** — the same `(tool_name, arguments_json, session_id)` triple appears `max_consecutive_duplicates` times in a row (default: 3).
2. **Cycle** — the same set of `(tool_name, args)` fingerprints appear in a cyclic permutation of length 2..=`max_cycle_length` (default: 4).
3. **No progress** — the same tool has been called more than `max_consecutive_same_tool` times without a different tool in between (default: 5).

Any rule firing is enough to terminate the run. The detector's state is per-session, reset at the start of each turn.

## API

```rust
pub struct DoomLoopDetector {
    config: DoomLoopConfig,
    state: Mutex<HashMap<Uuid, DoomLoopState>>,
}

pub struct DoomLoopConfig {
    pub max_consecutive_duplicates: usize,    // default 3
    pub max_cycle_length: usize,              // default 4
    pub max_consecutive_same_tool: usize,    // default 5
}

impl DoomLoopDetector {
    pub fn new(config: DoomLoopConfig) -> Self;
    pub fn observe(&self, session_id: Uuid, call: &ToolCall) -> Result<(), DoomLoopType>;
    pub fn reset(&self, session_id: Uuid);
}

pub enum DoomLoopType {
    Duplicate { count: usize, fingerprint: ToolCallFingerprint },
    Cycle { length: usize, fingerprints: Vec<ToolCallFingerprint> },
    NoProgress { tool: String, count: usize },
}
```

## Relationship to other components

- **[AgentRuntime](agent-runtime.md)** — observes the detector after each tool call.
- **[Turn FSM](turn-fsm.md)** — the `ExecutingTools` step is where doom loops manifest.
- **[ToolRuntime](../../tools/tool-runtime)** — the executor.

## See also

- **[AgentRuntime](agent-runtime.md)** — the consumer.
- **[ToolRuntime](../../tools/tool-runtime)** — the executor.
