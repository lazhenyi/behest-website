---
title: ProviderRegistry
description: chat 与 embedding provider 的内存路由，基于 `ExtensionPoint`。
group: providers
order: 3
summary: chat 与 embedding provider 的内存路由。
related:
  - providers/chat-provider
  - providers/embedding-provider
  - core/extension-point
---

# `ProviderRegistry`

> chat 与 embedding provider 的内存路由。

`ProviderRegistry` 是 `ModelRouter` 包装的具体注册表。它把 `ChatProvider` 和 `EmbeddingProvider` 实例存在 `ExtensionPoint` 字段中，提供 `register_chat` / `register_embedding`（从 provider 的 `id()` 自动生成 key），并路由 `complete` / `stream` / `embed` 调用。

完整源码在 `src/provider/registry.rs`。

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

## 另见

- **[ChatProvider](chat-provider.md)** —— 端口。
- **[ExtensionPoint](../core/extension-point.md)** —— 存储原语。
