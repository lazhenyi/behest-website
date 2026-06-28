---
title: "Backend: Qdrant"
description: Qdrant embedding store backend for approximate nearest-neighbour search.
group: storage
order: 13
summary: Qdrant embedding store backend.
related:
  - storage/embedding-store
  - tools/rag-context-adapter
---

# Backend: Qdrant

> Qdrant embedding store.

Feature `qdrant`. Provides an `EmbeddingStore` implementation backed by Qdrant's vector database with HNSW-based approximate nearest-neighbour search.

## Configuration

```toml
[store.embedding.qdrant]
url = "http://localhost:6334"
collection = "behest_embeddings"
vector_size = 1536
```

## When to use

- More than ~10k embedding vectors (memory backend is brute-force).
- Production RAG with low-latency search.
- Existing Qdrant infrastructure.

## See also

- **[EmbeddingStore](embedding-store.md)** — the trait.
- **[RAG Context Adapter](../tools/rag-context-adapter.md)** — the consumer.
