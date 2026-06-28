---
title: ChatProvider
description: " \"The port for chat model implementations: complete, stream, capabilities.\""
group: providers
order: 1
summary: " The `ChatProvider` trait: complete, stream, capabilities."
related:
  - providers/embedding-provider
  - providers/provider-registry
  - providers/openai-adapter
  - providers/anthropic-adapter
---

# `ChatProvider`

> The port for chat model implementations.

`ChatProvider` is the trait every chat model adapter implements. It is the **port** in the hexagonal architecture; the `adapt/` layer provides the concrete adapters.

The full file is `src/provider/traits.rs`.

## API

```rust
#[async_trait]
pub trait ChatProvider: Send + Sync {
    fn id(&self) -> ProviderId;
    fn capabilities(&self) -> ProviderCapabilities;
    async fn complete(&self, request: ChatRequest) -> ProviderResult<ChatResponse>;
    async fn stream(&self, request: ChatRequest) -> ProviderResult<ChatStream> {
        Err(ProviderError::Unsupported { provider: self.id(), feature: "chat_stream".into() })
    }
}
```

## Capabilities

```rust
pub struct ProviderCapabilities {
    pub chat: bool,
    pub chat_stream: bool,
    pub tool_calls: bool,
    pub vision: bool,
    pub structured_output: bool,
    pub context_overflow_retry: bool,
}
```

## Error classification

`ProviderError` distinguishes retryable vs. non-retryable failures:

- **Retryable**: `RateLimited`, `Timeout`, `Overloaded`, `Transport`
- **Non-retryable**: `Authentication`, `Unsupported`, `BadRequest`, `Decode`

The `is_retryable()` and `is_context_overflow()` methods on `ProviderError` are what `ModelRouter` uses to decide whether to retry or fall back.

## See also

- **[EmbeddingProvider](embedding-provider.md)** — the embedding port.
- **[ProviderRegistry](provider-registry.md)** — the routing layer.
- **[OpenAI Adapter](openai-adapter.md)** — the concrete implementation.
