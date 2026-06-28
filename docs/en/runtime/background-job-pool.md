---
title: BackgroundJobPool
description: Priority-aware async job pool for event persistence and external publishing, with graceful shutdown and disk persistence.
group: runtime
order: 10
summary: Priority-aware async job pool with graceful shutdown.
related:
  - runtime/agent-runtime
  - events/agent-event
  - events/runtime-event-store
---

# `BackgroundJobPool`

> Async event persistence and external publishing, decoupled from the run loop.

`BackgroundJobPool` is the runtime's "do this eventually" queue. When the run loop produces an `AgentEvent` that should be persisted or published, the runtime enqueues a `BackgroundJob` to the pool and continues. The pool dispatches jobs in priority order, persists the in-flight queue to disk, and supports graceful shutdown.

The full file is `src/runtime/job.rs`.

## Job types

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

## Priority

Jobs run in strict priority order:

```rust
pub enum JobPriority {
    Critical,  // reserved for circuit-breaker events
    High,      // event persistence for in-flight runs
    Normal,    // external publishing
    Low,       // session compaction, projection updates
}
```

`Critical` jobs run before any `High` job, and so on. Within a priority, FIFO order is preserved.

## Conditions

`JobConditions` allows a job to wait for a precondition:

```rust
pub struct JobConditions {
    pub require_session_idle: bool,         // wait for the session gate to be free
    pub wait_for_event_seq: Option<u64>,    // wait for a specific event to be persisted first
    pub require_provider: Option<ProviderId>, // only run if this provider is registered
    pub deadline: Option<Duration>,         // cancel if not started by then
}
```

Conditions are evaluated when the job is **dequeued**, not when it is enqueued. This lets operators enqueue jobs early and have them dispatch at the right time.

## API

```rust
impl BackgroundJobPool {
    pub fn new(config: JobPoolConfig) -> Self;
    pub async fn enqueue(&self, job: BackgroundJob) -> JobId;
    pub async fn run(&self, shutdown: ShutdownToken) -> Result<(), RuntimeError>;
    pub fn stats(&self) -> JobPoolStats;
}
```

## Disk persistence

The pool persists its in-flight queue to a JSON file at the configured path. On restart, jobs that were in flight at the time of a crash are re-enqueued. This gives at-least-once semantics for event persistence.

## Graceful shutdown

`pool.run(shutdown)` exits cleanly when the `ShutdownToken` is fired:

1. No new jobs are accepted.
2. All in-flight jobs are awaited to completion.
3. The queue is flushed to disk.
4. The pool's worker task returns.

The default shutdown timeout is 30 seconds. If jobs don't complete in time, the pool returns `RuntimeError::ShutdownTimeout` and the remaining jobs are left in the disk-persisted queue for the next start to handle.

## See also

- **[AgentRuntime](agent-runtime.md)** — the producer.
- **[AgentEvent](../../events/agent-event)** — the event type.
- **[RuntimeEventStore](../../events/runtime-event-store)** — the persistence backend.
