---
title: Anthropic Adapter
description: Anthropic Messages API 的 chat adapter。
group: providers
order: 7
summary: Anthropic Messages API 的 chat adapter。
related: []
---

# Anthropic Adapter

> Anthropic Messages API 的 chat adapter。

`AnthropicChatAdapter` 实现了 `ChatProvider`。

## 能力

```rust
ProviderCapabilities { chat: true, chat_stream: true, tool_calls: true, vision: true, structured_output: false, context_overflow_retry: true }
```

## 请求构建

`convert.rs` 映射 `ChatRequest` → Anthropic 的 `CreateMessageRequest`。Anthropic 的 system prompt 是独立的顶层字段。Tool 使用 `input_schema`（Anthropic 对 JSON Schema 参数的称呼）。

## Tool use

Anthropic 的 tool calling 使用 `tool_use` 和 `tool_result` 内容块。adapter 映射：tool_use → ContentPart::ToolCall，tool_result → ContentPart::ToolResult。

## 流式

Anthropic 的流式使用带 `event:` 类型的 SSE：content_block_start → content_block_delta → content_block_stop → message_delta → message_stop。

## Feature gate

```toml
behest = { version = "0.4", features = ["anthropic"] }
```

## 另见

- **[ChatProvider](chat-provider.md)** —— 端口。
- **[OpenAI Adapter](openai-adapter.md)** —— 另一个具体 adapter。

