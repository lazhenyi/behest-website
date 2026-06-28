---
title: SessionGate
description: Per-session mutex that serialises concurrent runs on the same session.
group: runtime
order: 7
summary: Per-session lock preventing concurrent run interleaving.
related:
  - runtime/agent-runtime
  - runtime/input-admission
  - storage/session-store
---

# `SessionGate`

> Per-session serialisation for concurrent runs.

Two runs on the same session **must not** interleave their writes; otherwise message ordering, tool-call pairing, and turn-completion semantics are corrupted. `SessionGate` is a per-session `tokio::sync::Mutex` that the runtime acquires before any session write and releases after.

The full file is `src/runtime/session_gate.rs`.

## API

```rust
pub struct SessionGate {
    config: SessionGateConfig,
    locks: Mutex<HashMap<Uuid, Arc<Mutex<()>>>>,
}

pub struct SessionGateConfig {
    pub acquire_timeout: Duration,    // default: 30s
    pub max_locks: usize,             // default: 10_000
}

impl SessionGate {
    pub fn new(config: SessionGateConfig) -> Self;
    pub async fn acquire(&self, session_id: Uuid) -> Result<SessionGuard, RuntimeError>;
    pub fn inflight(&self) -> usize;
}

pub struct SessionGuard {
    _permit: tokio::sync::OwnedMutexGuard<()>,
}
```

## Acquire

`runtime.session_gate().acquire(session_id).await?` returns a `SessionGuard`. The guard is held for the duration of the run; when dropped, the lock is released.

If the lock is already held by another run, the second call **blocks** for up to `acquire_timeout`. If the timeout elapses, `RuntimeError::SessionGateTimeout` is returned and the second run is rejected.

## Why per-session, not global

A global lock would serialise runs across all sessions, limiting throughput. Per-session locks allow unrelated sessions to run in parallel; only writes to the **same** session are serialised.

## Edge cases

- **`max_locks` exceeded** — the gate refuses to create a new lock and returns `RuntimeError::TooManySessions`. This caps memory growth if many short-lived sessions are created.
- **Crash mid-run** — the lock is held by the dropped future. Tokio detects the drop and releases the lock automatically. The next acquire succeeds.
- **Long-running run** — other runs on the same session wait. There is no priority or preemption; if you need it, the run is `cancel`led first.

## See also

- **[AgentRuntime](agent-runtime.md)** — the caller.
- **[InputAdmission](input-admission.md)** — the companion input gate.
- **[SessionStore](../../storage/session-store)** — the persistent backing for session state.
