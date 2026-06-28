---
title: ChatProvider
description: " chat 模型实现的端口：complete、stream、capabilities。"
group: providers
order: 1
summary: " `ChatProvider` trait：complete、stream、capabilities。"
related:
  - providers/embedding-provider
  - providers/provider-registry
  - providers/openai-adapter
  - providers/anthropic-adapter
---

# `ChatProvider`

> chat 模型实现的端口。

`ChatProvider` 是每个 chat 模型 adapter 实现的 trait。它是六边形架构中的 **port**；`adapt/` 层提供具体 adapter。

完整源码在 `src/provider/traits.rs`。

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

## 能力

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

## 错误分类

`ProviderError` 区分可重试与不可重试的失败：

- **可重试**：`RateLimited`、`Timeout`、`Overloaded`、`Transport`
- **不可重试**：`Authentication`、`Unsupported`、`BadRequest`、`Decode`

`ProviderError` 上的 `is_retryable()` 与 `is_context_overflow()` 方法被 `ModelRouter` 用来决定重试还是回退。

## 另见

- **[EmbeddingProvider](embedding-provider.md)** —— embedding 端口。
- **[ProviderRegistry](provider-registry.md)** —— 路由层。
- **[OpenAI Adapter](openai-adapter.md)** —— 具体实现。
