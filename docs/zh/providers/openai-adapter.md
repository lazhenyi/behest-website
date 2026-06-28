---
title: OpenAI Adapter
description: OpenAI 兼容的 chat 与 embedding adapter：请求构建、响应解析、错误映射。
group: providers
order: 6
summary: OpenAI 兼容的 chat 与 embedding adapter。
related: []
---

# OpenAI Adapter

> OpenAI 兼容的 chat 与 embedding adapter。

`OpenAiChatAdapter` 和 `OpenAiEmbeddingAdapter` 分别实现了 `ChatProvider` 和 `EmbeddingProvider`。

## Chat adapter

```rust
impl ChatProvider for OpenAiChatAdapter {
    fn capabilities(&self) -> ProviderCapabilities {
        ProviderCapabilities { chat: true, chat_stream: true, tool_calls: true, vision: true, structured_output: true, context_overflow_retry: true }
    }
}
```

## 请求构建

`convert.rs` 映射 `ChatRequest` → OpenAI 的 `CreateChatCompletionRequest`：Message → ChatCompletionMessageParam，ContentPart::ImageUrl → image_url，ToolSpec → ChatCompletionTool。

## 响应解析

映射 OpenAI 的 `CreateChatCompletionResponse` → `ChatResponse`：choices[0].message → Message::Assistant，tool_calls → Vec<ToolCall>，finish_reason → FinishReason。

## 流式

使用 `SseParser` 解析 OpenAI 的 SSE 流。`data:` 行被反序列化为 `ChatCompletionChunk`。

## Embedding adapter

`OpenAiEmbeddingAdapter` 实现 `EmbeddingProvider`。

## Feature gate

```toml
behest = { version = "0.4", features = ["openai"] }
```

## 另见

- **[ChatProvider](chat-provider.md)** —— 端口。
- **[ProviderConfig](provider-config.md)** —— 配置。

