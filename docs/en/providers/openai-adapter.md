---
title: OpenAI Adapter
description: "The OpenAI-compatible chat and embedding adapter: request building, response parsing, error mapping."
group: providers
order: 6
summary: The OpenAI-compatible chat and embedding adapter.
related:
  - providers/chat-provider
  - providers/embedding-provider
  - providers/provider-config
  - providers/anthropic-adapter
---

# OpenAI Adapter

> The OpenAI-compatible chat and embedding adapter.

`OpenAiChatAdapter` and `OpenAiEmbeddingAdapter` implement `ChatProvider` and `EmbeddingProvider` respectively, translating behest's provider-neutral types to OpenAI's REST API and back.

The full files are `src/adapt/openai/chat.rs`, `src/adapt/openai/embed.rs`, and `src/adapt/openai/convert.rs`.

## Chat adapter

```rust
pub struct OpenAiChatAdapter {
    id: ProviderId,
    http: HttpClient,
    config: ProviderHttpConfig,
}

impl OpenAiChatAdapter {
    pub fn new(config: ProviderHttpConfig) -> Result<Self, ProviderError>;
}

#[async_trait]
impl ChatProvider for OpenAiChatAdapter {
    fn id(&self) -> ProviderId;
    fn capabilities(&self) -> ProviderCapabilities;
    async fn complete(&self, request: ChatRequest) -> ProviderResult<ChatResponse>;
    async fn stream(&self, request: ChatRequest) -> ProviderResult<ChatStream>;
}
```

### Capabilities

```rust
ProviderCapabilities {
    chat: true,
    chat_stream: true,
    tool_calls: true,
    vision: true,
    structured_output: true,
    context_overflow_retry: true,
}
```

### Request building

`convert.rs` maps `ChatRequest` → OpenAI's `CreateChatCompletionRequest`:

- `Message` → `ChatCompletionMessageParam` (system / user / assistant / tool).
- `ContentPart::Text` → text content; `ContentPart::ImageUrl` → `image_url` content part.
- `ToolSpec` → `ChatCompletionTool` with `function` type and JSON Schema parameters.
- `ToolChoice::Auto` → `"auto"`; `ToolChoice::Required` → `"required"`; `ToolChoice::None` → `"none"`.

### Response parsing

`convert.rs` maps OpenAI's `CreateChatCompletionResponse` → `ChatResponse`:

- `choices[0].message` → `Message::Assistant`.
- `choices[0].message.tool_calls` → `Vec<ToolCall>`.
- `choices[0].finish_reason` → `FinishReason`.
- `usage` → `TokenUsage`.

### Streaming

The streaming adapter uses `SseParser` (from `src/adapt/sse.rs`) to parse OpenAI's SSE stream. Each `data:` line is deserialised as a `ChatCompletionChunk`; text deltas are concatenated, tool-call argument deltas are merged.

### Error mapping

`convert.rs` maps HTTP status codes and OpenAI error types to `ProviderError`:

| HTTP status | OpenAI error type | `ProviderError` |
|---|---|---|
| 401 | `invalid_api_key` | `Authentication` |
| 429 | `rate_limit_exceeded` | `RateLimited` |
| 500 | `server_error` | `Overloaded` |
| 400 | `context_length_exceeded` | `BadRequest` (with `is_context_overflow() == true`) |
| 400 | other | `BadRequest` |
| — | network error | `Transport` |

## Embedding adapter

```rust
pub struct OpenAiEmbeddingAdapter {
    id: ProviderId,
    http: HttpClient,
    config: ProviderHttpConfig,
}

impl OpenAiEmbeddingAdapter {
    pub fn new(config: ProviderHttpConfig) -> Result<Self, ProviderError>;
}

#[async_trait]
impl EmbeddingProvider for OpenAiEmbeddingAdapter {
    fn id(&self) -> ProviderId;
    fn capabilities(&self) -> ProviderCapabilities;
    async fn embed(&self, request: EmbeddingRequest) -> ProviderResult<EmbeddingResponse>;
}
```

## Shared infrastructure

Both adapters share:

- **`HttpClient`** — a `reqwest::Client` configured with the adapter's timeouts and TLS settings.
- **`SseParser`** — a streaming SSE parser that handles OpenAI's `data: [DONE]` sentinel.
- **`ProviderHttpConfig`** — the configuration surface (base URL, API key, timeouts).

## Feature gate

```toml
[dependencies]
behest = { version = "0.4", features = ["openai"] }
```

The adapter is compiled only when the `openai` feature is enabled. The `default_factory_registry()` registers it under `"provider.openai.chat"` and `"provider.openai.embedding"`.

## See also

- **[ChatProvider](chat-provider.md)** — the port.
- **[EmbeddingProvider](embedding-provider.md)** — the embedding port.
- **[ProviderConfig](provider-config.md)** — the configuration.
- **[Anthropic Adapter](anthropic-adapter.md)** — the other concrete adapter.
