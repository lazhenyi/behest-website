---
title: RAG Context Adapter
description: 基于 Qdrant 或 Tantivy 的检索增强上下文适配器。
group: tools
order: 9
summary: 检索增强上下文适配器（Qdrant、Tantivy）。
related:
  - tools/context-adapter
  - runtime/context-pipeline
  - storage/backend-qdrant
---

# RAG Context Adapter

> 用检索到的文档增强上下文。

`RagContextAdapter` 实现 `ContextAdapter`：搜索 `EmbeddingStore` 中与用户输入相关的文档，把它们作为系统消息前置。

完整源码在 `src/rag/mod.rs`。

## 后端

- **Qdrant** —— feature `qdrant`。向量搜索。
- **Tantivy** —— feature `tantivy`。全文搜索。

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

## 另见

- **[ContextAdapter](context-adapter.md)** —— trait。
- **[EmbeddingStore](../storage/embedding-store)** —— 后端。
