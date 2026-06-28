---
title: EmbeddingProvider
description: " embedding 模型实现的端口。"
group: providers
order: 2
summary: " `EmbeddingProvider` trait 与请求 / 响应形状。"
related:
  - providers/chat-provider
  - providers/provider-registry
---

# `EmbeddingProvider`

> embedding 模型实现的端口。

`EmbeddingProvider` 是 embedding 模型 adapter 的 trait。它是 `ChatProvider` 在 embedding 路径上的平行物。

完整源码在 `src/provider/embedding.rs`。

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

## 另见

- **[ChatProvider](chat-provider.md)** —— chat 端口。
- **[ProviderRegistry](provider-registry.md)** —— 路由层。
