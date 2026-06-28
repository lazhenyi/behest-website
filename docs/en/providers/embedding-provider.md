---
title: EmbeddingProvider
description: The port for embedding model implementations.
group: providers
order: 2
summary: The `EmbeddingProvider` trait and request / response shape.
related:
  - providers/chat-provider
  - providers/provider-registry
---

# `EmbeddingProvider`

> The port for embedding model implementations.

`EmbeddingProvider` is the trait for embedding model adapters. It is the parallel to `ChatProvider` for the embedding path.

The full file is `src/provider/embedding.rs`.

## API

```rust
#[async_trait]
pub trait EmbeddingProvider: Send + Sync {
    fn id(&self) -> ProviderId;
    fn capabilities(&self) -> ProviderCapabilities;
    async fn embed(&self, request: EmbeddingRequest) -> ProviderResult<EmbeddingResponse>;
}

pub struct EmbeddingRequest {
    pub model: ModelName,
    pub input: Vec<String>,
    pub dimensions: Option<usize>,
}

pub struct EmbeddingResponse {
    pub provider: ProviderId,
    pub model: ModelName,
    pub embeddings: Vec<Vec<f32>>,
    pub usage: Option<TokenUsage>,
    pub raw: Option<Value>,
}
```

## See also

- **[ChatProvider](chat-provider.md)** — the chat port.
- **[ProviderRegistry](provider-registry.md)** — the routing layer.
