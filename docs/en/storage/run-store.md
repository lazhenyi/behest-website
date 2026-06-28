---
title: RunStore
description: " \"Event-sourced run lifecycle: create run, append events, project state.\""
group: storage
order: 6
summary: " Event-sourced run lifecycle: create, append event, project state."
related:
  - storage/storage-overview
  - storage/runtime-store
  - runtime/run-state
---

# `RunStore`

> Event-sourced run lifecycle.

`RunStore` persists the event log of every run. It is the source of truth for `RunState` projection and the replay source for `RuntimeSubscriptionHub`.

The full file is `src/runtime/store.rs`.

## API

```rust
#[async_trait]
pub trait RunStore: Send + Sync {
    async fn create_run(&self, record: RunRecord) -> RuntimeResult<()>;
    async fn get_run(&self, run_id: RunId) -> RuntimeResult<Option<RunRecord>>;
    async fn update_run_status(&self, run_id: RunId, status: RunStatus) -> RuntimeResult<()>;

    async fn append_event(&self, record: RunEventRecord) -> RuntimeResult<()>;
    async fn list_events(&self, run_id: RunId) -> RuntimeResult<Vec<RunEventRecord>>;

    async fn list_runs(&self, session_id: Uuid) -> RuntimeResult<Vec<RunRecord>>;
    async fn delete_run(&self, run_id: RunId) -> RuntimeResult<()>;
    async fn health_check(&self) -> RuntimeResult<()>;
}
```

## Key types

```rust
pub struct RunRecord {
    pub run_id: RunId,
    pub session_id: Uuid,
    pub provider: ProviderId,
    pub model: ModelName,
    pub status: RunStatus,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub struct RunEventRecord {
    pub id: Uuid,
    pub run_id: RunId,
    pub seq: u64,
    pub event: AgentEvent,
    pub created_at: DateTime<Utc>,
}
```

## Projection

`get_run_state()` has a default implementation that folds `get_run()` + `list_events()` into `RunState`. Backends can override for a native projection:

```rust
async fn get_run_state(&self, run_id: RunId) -> RuntimeResult<RunState> {
    let run = self.get_run(run_id)?.ok_or(RuntimeError::RunNotFound(run_id))?;
    let events = self.list_events(run_id)?;
    Ok(RunState::project(events))
}
```

## Atomicity

`append_event` must be atomic: the run's `status`, `total_usage`, `iteration`, and `last_finish` must be updated in the same transaction as the event insert. The `MemoryRunStore` implementation uses a single `Mutex` to enforce this.

## Backends

- **Memory** — `MemoryRunStore`, default. In-process `HashMap`s.

## See also

- **[Storage Overview](storage-overview.md)** — the full matrix.
- **[RunState](../runtime/run-state.md)** — the projection.
- **[RuntimeStore](runtime-store.md)** — the facade.
