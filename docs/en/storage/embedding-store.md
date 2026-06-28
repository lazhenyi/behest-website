---
title: EmbeddingStore
description: Vector persistence and nearest-neighbour search over embeddings.
group: storage
order: 3
summary: Vector persistence and nearest-neighbour search.
related:
  - storage/storage-overview
  - storage/backend-qdrant
  - tools/rag-context-adapter
---

# `EmbeddingStore`

> Vector persistence and nearest-neighbour search.

`EmbeddingStore` stores embedding vectors and retrieves the most similar vectors for a query. It is the backend used by `RagContextAdapter`.

The full file is `src/store/mod.rs`.

## API

```rust
#[async_trait]
pub trait EmbeddingStore: Send + Sync {
    async fn upsert(&self, record: EmbeddingRecord) -> StoreResult<EmbeddingRecord>;
    async fn search(&self, query: &[f32], limit: usize) -> StoreResult<Vec<ScoredEmbedding>>;
    async fn delete(&self, id: &Uuid) -> StoreResult<()>;
    async fn delete_by_session(&self, session_id: &Uuid) -> StoreResult<u64>;
}

pub struct EmbeddingRecord {
    pub id: Uuid,
    pub session_id: Uuid,
    pub content: String,
    pub embedding: Vec<f32>,
    pub metadata: Value,
}

pub struct ScoredEmbedding {
    pub record: EmbeddingRecord,
    pub score: f32,
}
```

## Backends

- **Memory** — `MemoryEmbeddingStore`, brute-force cosine similarity. Default.
- **Qdrant** — feature `qdrant`. Approximate nearest-neighbour via HNSW.

## See also

- **[Storage Overview](storage-overview.md)** — the full matrix.
- **[Qdrant Backend](backend-qdrant.md)** — the Qdrant backend.
- **[RAG Context Adapter](../tools/rag-context-adapter.md)** — the consumer.
