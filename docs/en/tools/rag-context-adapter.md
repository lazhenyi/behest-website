---
title: RAG Context Adapter
description: Retrieval-augmented context adapter backed by Qdrant or Tantivy.
group: tools
order: 9
summary: Retrieval-augmented context adapter (Qdrant, Tantivy).
related:
  - tools/context-adapter
  - runtime/context-pipeline
  - storage/backend-qdrant
---

# RAG Context Adapter

> Augment context with retrieved documents.

`RagContextAdapter` implements `ContextAdapter` by searching an `EmbeddingStore` for documents relevant to the user's input, then prepending them as system messages.

The full file is `src/rag/mod.rs`.

## Backends

- **Qdrant** — feature `qdrant`. Vector search.
- **Tantivy** — feature `tantivy`. Full-text search.

## API

```rust
pub struct RagContextAdapter {
    store: Arc<dyn EmbeddingStore>,
    config: RagConfig,
}

pub struct RagConfig {
    pub max_chunks: usize,        // default 5
    pub chunk_prefix: String,     // default "Relevant context:"
    pub min_score: f32,           // default 0.7
}
```

## See also

- **[ContextAdapter](context-adapter.md)** — the trait.
- **[EmbeddingStore](../storage/embedding-store)** — the backend.
