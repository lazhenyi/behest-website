---
title: Anthropic Adapter
description: "The Anthropic Messages API chat adapter: request building, response parsing, error mapping."
group: providers
order: 7
summary: The Anthropic Messages API chat adapter.
related:
  - providers/chat-provider
  - providers/provider-config
  - providers/openai-adapter
---

# Anthropic Adapter

> The Anthropic Messages API chat adapter.

`AnthropicChatAdapter` implements `ChatProvider`, translating behest's provider-neutral types to Anthropic's Messages API and back.

The full files are `src/adapt/anthropic/chat.rs` and `src/adapt/anthropic/convert.rs`.

## API

```rust
pub struct AnthropicChatAdapter {
    id: ProviderId,
    http: HttpClient,
    config: ProviderHttpConfig,
}

impl AnthropicChatAdapter {
    pub fn new(config: ProviderHttpConfig) -> Result<Self, ProviderError>;
}

#[async_trait]
impl ChatProvider for AnthropicChatAdapter {
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
    structured_output: false,
    context_overflow_retry: true,
}
```

Anthropic does not support structured output (JSON mode). `structured_output: false` means `ModelRouter` rejects requests that require it.

## Request building

`convert.rs` maps `ChatRequest` → Anthropic's `CreateMessageRequest`:

- `Message::System` → top-level `system` field (Anthropic's system prompt is separate from messages).
- `Message::User` / `Message::Assistant` → `MessageParam` with `role` and `content`.
- `ContentPart::ImageUrl` → `ImageBlockSource` with base64-encoded data.
- `ToolSpec` → `Tool` with `input_schema` (Anthropic's term for JSON Schema parameters).
- `ToolChoice::Auto` → `{ type: "auto" }`; `ToolChoice::Required` → `{ type: "any" }`.

### Tool use

Anthropic's tool calling uses `tool_use` and `tool_result` content blocks, not a separate `tool_calls` array. The adapter maps:

- Anthropic `tool_use` block → `ContentPart::ToolCall`.
- Anthropic `tool_result` block → `ContentPart::ToolResult`.

## Response parsing

`convert.rs` maps Anthropic's `CreateMessageResponse` → `ChatResponse`:

- `content` blocks → `Message::Assistant` with `ContentPart` values.
- `stop_reason` → `FinishReason` (`"end_turn"` → `Stop`, `"tool_use"` → `ToolCalls`, `"max_tokens"` → `Length`).
- `usage` → `TokenUsage` (Anthropic reports `input_tokens` and `output_tokens` separately).

## Streaming

Anthropic's streaming uses SSE with `event:` types:

- `content_block_start` — a new content block (text or tool_use) is beginning.
- `content_block_delta` — a text delta or tool_use input_json_delta.
- `content_block_stop` — the block is complete.
- `message_delta` — stop_reason and usage.
- `message_stop` — stream end.

The adapter's `StreamAccumulator` merges these into a complete `Message::Assistant`.

## Error mapping

| HTTP status | Anthropic error type | `ProviderError` |
|---|---|---|
| 401 | `authentication_error` | `Authentication` |
| 429 | `rate_limit_error` | `RateLimited` |
| 529 | `overloaded_error` | `Overloaded` |
| 400 | `invalid_request_error` | `BadRequest` |
| — | network error | `Transport` |

## Feature gate

```toml
[dependencies]
behest = { version = "0.4", features = ["anthropic"] }
```

Registered under `"provider.anthropic.chat"` in `default_factory_registry()`.

## See also

- **[ChatProvider](chat-provider.md)** — the port.
- **[ProviderConfig](provider-config.md)** — the configuration.
- **[OpenAI Adapter](openai-adapter.md)** — the other concrete adapter.
