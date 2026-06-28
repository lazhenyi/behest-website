---
title: ProviderRegistry
description: In-memory routing for chat and embedding providers, backed by `ExtensionPoint`.
group: providers
order: 3
summary: In-memory routing for chat and embedding providers.
related:
  - providers/chat-provider
  - providers/embedding-provider
  - core/extension-point
---

# `ProviderRegistry`

> In-memory routing for chat and embedding providers.

`ProviderRegistry` is the concrete registry that `ModelRouter` wraps. It stores `ChatProvider` and `EmbeddingProvider` instances in `ExtensionPoint` fields, provides `register_chat` / `register_embedding` with auto-generated keys from the provider's `id()`, and routes `complete` / `stream` / `embed` calls.

The full file is `src/provider/registry.rs`.

## API

```rust
impl ProviderRegistry {
    pub fn new() -> Self;
    pub fn from_extensions(exts: &Extensions) -> Self;
    pub fn register_chat<P: ChatProvider + 'static>(&mut self, provider: P) -> Option<Arc<dyn ChatProvider>>;
    pub fn register_embedding<P: EmbeddingProvider + 'static>(&mut self, provider: P) -> Option<Arc<dyn EmbeddingProvider>>;
    pub fn chat(&self, id: &ProviderId) -> Option<Arc<dyn ChatProvider>>;
    pub fn embedding(&self, id: &ProviderId) -> Option<Arc<dyn EmbeddingProvider>>;
    pub async fn complete(&self, provider_id: &ProviderId, request: ChatRequest) -> ProviderResult<ChatResponse>;
    pub async fn stream(&self, provider_id: &ProviderId, request: ChatRequest) -> ProviderResult<ChatStream>;
    pub async fn embed(&self, provider_id: &ProviderId, request: EmbeddingRequest) -> ProviderResult<EmbeddingResponse>;
}
```

## See also

- **[ChatProvider](chat-provider.md)** — the port.
- **[ExtensionPoint](../core/extension-point.md)** — the storage primitive.
