---
title: Storage Overview
description: Storage taxonomy, trait matrix, feature-flag backends, and the RuntimeStore facade.
group: storage
order: 1
summary: Store taxonomy, facade, and feature-flag matrix.
related:
  - storage/session-store
  - storage/embedding-store
  - storage/execution-store
  - storage/artifact-store
  - storage/run-store
  - storage/runtime-store
---

# Storage

> The pluggable persistence layer.

`behest` defines four store traits plus a `RunStore` trait, each with multiple feature-gated backends. A `RuntimeStore` facade composes them into a single handle for the runtime.

## Trait matrix

| Trait | Purpose | Key methods |
|---|---|---|
| `SessionStore` | Session CRUD + message history | `create_session`, `append_message`, `list_messages`, `get_latest_compaction` |
| `EmbeddingStore` | Vector persistence + search | `upsert`, `search`, `delete_by_session` |
| `ExecutionStore` | Tool execution + token usage + session stats | `record_execution`, `record_usage`, `session_stats` |
| `ArtifactStore` | Binary file storage | `put`, `get`, `list_by_session` |
| `RunStore` | Event-sourced run lifecycle | `create_run`, `append_event`, `list_events`, `get_run_state` |

## Backend matrix

| Backend | Session | Embedding | Execution | Artifact | Run | Feature |
|---|---|---|---|---|---|---|
| Memory | ✓ | ✓ | ✓ | ✓ | ✓ | (default) |
| Redis | ✓ | — | — | — | — | `redis` |
| SQLx PostgreSQL | ✓ | — | — | — | — | `sqlx-postgres` |
| SQLx MySQL | ✓ | — | — | — | — | `sqlx-mysql` |
| SQLx SQLite | ✓ | — | — | — | — | `sqlx-sqlite` |
| MongoDB | ✓ | — | — | — | — | `mongodb` |
| SurrealDB | ✓ | — | — | — | — | `surrealdb` |
| Qdrant | — | ✓ | — | — | — | `qdrant` |
| Object (S3/Disk) | — | — | — | ✓ | — | `object_store` |

## `RuntimeStore` facade

`RuntimeStore` composes the individual stores into a single handle. The runtime accesses stores by name through the `Extensions` facade:

```rust
pub struct RuntimeStore {
    session: Arc<ExtensionPoint<dyn SessionStore>>,
    execution: Arc<ExtensionPoint<dyn ExecutionStore>>,
    run: Arc<ExtensionPoint<dyn RunStore>>,
    embedding: Option<Arc<ExtensionPoint<dyn EmbeddingStore>>>,
    artifact: Option<Arc<ExtensionPoint<dyn ArtifactStore>>>,
}

impl RuntimeStore {
    pub fn from_extensions(ext: &Extensions) -> Self;
    pub fn session(&self, name: &str) -> Option<Arc<dyn SessionStore>>;
    pub fn execution(&self, name: &str) -> Option<Arc<dyn ExecutionStore>>;
    pub fn run(&self, name: &str) -> Option<Arc<dyn RunStore>>;
}
```

## See also

- **[SessionStore](session-store.md)** — the session trait.
- **[EmbeddingStore](embedding-store.md)** — the vector trait.
- **[ExecutionStore](execution-store.md)** — the execution trait.
- **[ArtifactStore](artifact-store.md)** — the artifact trait.
- **[RunStore](run-store.md)** — the run trait.
- **[RuntimeStore](runtime-store.md)** — the facade.
