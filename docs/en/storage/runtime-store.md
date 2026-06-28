---
title: RuntimeStore
description: The runtime-facing facade over the five store traits.
group: storage
order: 7
summary: The runtime-facing facade over the five store traits.
related:
  - storage/storage-overview
  - storage/session-store
  - storage/embedding-store
  - storage/execution-store
  - storage/artifact-store
  - storage/run-store
---

# `RuntimeStore`

> The runtime-facing facade.

`RuntimeStore` composes the five store traits into a single handle. The runtime does not talk to `SessionStore` directly — it talks to `RuntimeStore`, which routes to the named backend.

The full file is `src/runtime/store.rs`.

## API

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
    pub fn embedding(&self, name: &str) -> Option<Arc<dyn EmbeddingStore>>;
    pub fn artifact(&self, name: &str) -> Option<Arc<dyn ArtifactStore>>;
}
```

## Construction

`from_extensions` clones the `Arc<ExtensionPoint<dyn Trait>>` from the `Extensions` facade:

```rust
let store = RuntimeStore::from_extensions(&exts);
let session = store.session("memory").unwrap();
session.create_session(s).await?;
```

## Why a facade

Before `RuntimeStore`, the runtime held five separate `Arc<dyn SessionStore>`, `Arc<dyn ExecutionStore>`, etc. fields. Adding a new store trait meant adding a new field to `AgentRuntime`, `RunLoop`, `ContextPipeline`, and every test. The facade consolidates them into one struct that reads from `Extensions`.

## Edge cases

- **Empty facade** — `session("nonexistent")` returns `None`. The runtime returns `RuntimeError::StoreNotFound`.
- **Embedding / artifact optional** — these are `Option<Arc<ExtensionPoint<...>>>`. If the `Extensions` facade has no registered embedding stores, `embedding()` returns `None` for all names.

## See also

- **[Storage Overview](storage-overview.md)** — the full matrix.
- **[Extensions Facade](../core/extensions-facade.md)** — the source.
