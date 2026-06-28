---
title: RuntimePolicy
description: Operational limits, budgets, and timeouts for `AgentRuntime`.
group: runtime
order: 11
summary: Limits, budgets, timeouts, and admission control.
related:
  - runtime/agent-runtime
  - runtime/turn-fsm
  - config/agent-config
---

# `RuntimePolicy`

> The single struct that bounds every dimension of the runtime.

`RuntimePolicy` is the operational configuration consumed by `AgentRuntime::new`. It holds limits, budgets, timeouts, and admission-control parameters. It is **immutable** after construction; changing a policy means constructing a new runtime.

The full file is `src/runtime/policy.rs`.

## Definition

```rust
pub struct RuntimePolicy {
    pub max_iterations: usize,            // default 16
    pub max_input_tokens: usize,          // default 128_000
    pub max_total_tokens: usize,          // default 256_000
    pub provider_timeout: Duration,       // default 60s
    pub tool_timeout: Duration,           // default 30s per tool
    pub session_gate: SessionGateConfig,
    pub input_admission: InputAdmissionConfig,
    pub router: RouterPolicy,
    pub event_buffer: usize,              // default 1024
}
```

## Defaults

| Field | Default | Effect |
|---|---|---|
| `max_iterations` | 16 | The Turn FSM fails after this many iterations per run. |
| `max_input_tokens` | 128_000 | `ContextPipeline` rejects inputs larger than this. |
| `max_total_tokens` | 256_000 | The cumulative token budget for a single run. |
| `provider_timeout` | 60 s | Wall-clock cap for a single model call. |
| `tool_timeout` | 30 s | Wall-clock cap for a single tool execution. |
| `event_buffer` | 1024 | Broadcast channel buffer for `AgentEvent`. |

`SessionGateConfig`, `InputAdmissionConfig`, and `RouterPolicy` have their own default impls.

## Construction

```rust
use std::time::Duration;
use behest::runtime::policy::RuntimePolicy;

let policy = RuntimePolicy {
    max_iterations: 32,
    max_total_tokens: 1_000_000,
    provider_timeout: Duration::from_secs(120),
    ..Default::default()
};
```

The `..Default::default()` pattern is the recommended idiom; it lets you override only the fields you care about.

## See also

- **[AgentRuntime](agent-runtime.md)** — the consumer.
- **[Turn FSM](turn-fsm.md)** — the `CheckingPolicy` state reads `max_iterations` and `max_total_tokens`.
- **[ModelRouter](model-router.md)** — reads `provider_timeout`.
- **[CompactionService](compaction-service.md)** — triggered when `max_input_tokens` is exceeded.
