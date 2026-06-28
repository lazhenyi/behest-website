---
title: EmbeddingStore
description: 向量持久化与最近邻搜索。
group: storage
order: 3
summary: 向量持久化与最近邻搜索。
related: []
---

# EmbeddingStore

> 向量持久化与最近邻搜索。

## API

```rust
#[async_trait]
pub trait EmbeddingStore: Send + Sync {
    async fn upsert(&self, record: EmbeddingRecord) -> StoreResult<EmbeddingRecord>;
    async fn search(&self, query: &[f32], limit: usize) -> StoreResult<Vec<ScoredEmbedding>>;
    async fn delete_by_session(&self, session_id: &Uuid) -> StoreResult<u64>;
}
```

## Backend

Memory（暴力余弦相似度）、Qdrant（HNSW 近似最近邻）。

## 另见

- **[Storage Overview](storage-overview.md)** —— 完整矩阵。
- **[RAG Context Adapter](../tools/rag-context-adapter.md)** —— 消费者。

