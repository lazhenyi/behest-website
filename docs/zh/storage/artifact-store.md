---
title: ArtifactStore
description: 二进制 artifact 存储：文件、图片、附件。
group: storage
order: 5
summary: 二进制 artifact 存储（内存/磁盘/S3）。
related: []
---

# ArtifactStore

> 二进制 artifact 存储。

## API

```rust
#[async_trait]
pub trait ArtifactStore: Send + Sync {
    async fn put(&self, artifact: Artifact) -> StoreResult<Artifact>;
    async fn get(&self, id: &Uuid) -> StoreResult<Option<Artifact>>;
    async fn list_by_session(&self, session_id: &Uuid) -> StoreResult<Vec<Artifact>>;
}
```

## Backend

Memory（默认）、Disk、S3（feature `object_store`）。

## 另见

- **[Storage Overview](storage-overview.md)** —— 完整矩阵。

