---
title: ArtifactStore
description: Binary artifact storage for files, images, and attachments.
group: storage
order: 5
summary: Binary artifact storage (memory / disk / S3).
related:
  - storage/storage-overview
  - storage/backend-object
---

# `ArtifactStore`

> Binary artifact storage.

`ArtifactStore` stores binary files — images, PDFs, tool outputs — keyed by session. It is separate from the message and embedding stores because artifacts are opaque blobs that don't participate in search or token counting.

The full file is `src/store/mod.rs`.

## API

```rust
#[async_trait]
pub trait ArtifactStore: Send + Sync {
    async fn put(&self, artifact: Artifact) -> StoreResult<Artifact>;
    async fn get(&self, id: &Uuid) -> StoreResult<Option<Artifact>>;
    async fn delete(&self, id: &Uuid) -> StoreResult<()>;
    async fn list_by_session(&self, session_id: &Uuid) -> StoreResult<Vec<Artifact>>;
    async fn delete_by_session(&self, session_id: &Uuid) -> StoreResult<u64>;
}

pub struct Artifact {
    pub id: Uuid,
    pub session_id: Uuid,
    pub name: String,
    pub content_type: String,
    pub data: Vec<u8>,
    pub metadata: Value,
}
```

## Backends

- **Memory** — `MemoryArtifactStore`, default. `HashMap<Uuid, Artifact>`.
- **Disk** — `DiskArtifactStore`, feature `object_store`. Files under a configurable root directory.
- **S3** — `S3ArtifactStore`, feature `object_store`. S3-compatible object storage.

## See also

- **[Storage Overview](storage-overview.md)** — the full matrix.
- **[Object Backend](backend-object.md)** — the disk/S3 backend.
