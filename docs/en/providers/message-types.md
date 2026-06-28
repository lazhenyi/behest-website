---
title: Message Types
description: " `Message`, `ContentPart`, `ToolCall`, `FinishReason`, `TokenUsage` — the shared vocabulary of every chat interaction."
group: providers
order: 4
summary: " `Message`, `ContentPart`, `ToolCall`, `FinishReason`, `TokenUsage`."
related:
  - providers/chat-provider
  - providers/provider-registry
---

# Message Types

> The shared vocabulary of every chat interaction.

`Message`, `ContentPart`, `ToolCall`, `FinishReason`, and `TokenUsage` are the **data types** that flow between the runtime and every provider. They are provider-neutral; adapters translate to and from these types.

The full files are `src/provider/message.rs` and `src/provider/tool.rs`.

## `Message`

```rust
#[non_exhaustive]
pub enum Message {
    System { content: Vec<ContentPart> },
    User { content: Vec<ContentPart> },
    Assistant { content: Vec<ContentPart>, tool_calls: Vec<ToolCall> },
    Tool { tool_call_id: String, name: String, content: Vec<ContentPart> },
}

impl Message {
    pub fn system_text(text: impl Into<String>) -> Self;
    pub fn user_text(text: impl Into<String>) -> Self;
    pub fn assistant_text(text: impl Into<String>) -> Self;
    pub fn tool_text(tool_call_id: impl Into<String>, name: impl Into<String>, text: impl Into<String>) -> Self;
}
```

Messages are the canonical representation of a conversation turn. Every provider adapter maps its native message type to `Message`.

## `ContentPart`

```rust
#[non_exhaustive]
pub enum ContentPart {
    Text { text: String },
    ImageUrl { url: String, detail: Option<String> },
    ToolCall { id: String, name: String, arguments: String },
    ToolResult { tool_call_id: String, content: String },
}

impl ContentPart {
    pub fn text(text: impl Into<String>) -> Self;
    pub fn image_url(url: impl Into<String>) -> Self;
    pub fn tool_call(id: &str, name: &str, arguments: &str) -> Self;
    pub fn tool_result(tool_call_id: &str, content: &str) -> Self;
}
```

A `Message` is a sequence of `ContentPart` values, not a single text blob. This allows multimodal content (text + images + tool calls) in a single message.

## `ToolCall`

```rust
pub struct ToolCall {
    pub id: String,
    pub name: String,
    pub arguments: serde_json::Value,
}

impl ToolCall {
    pub fn new(id: impl Into<String>, name: impl Into<String>, arguments: serde_json::Value) -> Self;
}
```

Emitted by the model and dispatched by the runtime. The `id` is unique within a run.

## `ToolSpec`

```rust
pub struct ToolSpec {
    pub name: String,
    pub description: String,
    pub parameters: serde_json::Value,  // JSON Schema
}
```

The serialisable form of a tool's metadata, sent as part of every `ChatRequest` when tools are available.

## `FinishReason`

```rust
#[non_exhaustive]
pub enum FinishReason {
    Stop,
    Length,
    ToolCalls,
    ContentFilter,
    FunctionCall,
}
```

The reason the model stopped generating. `ToolCalls` triggers the `ExecutingTools` state in the Turn FSM.

## `TokenUsage`

```rust
pub struct TokenUsage {
    pub input_tokens: u32,
    pub output_tokens: u32,
    pub total_tokens: u32,
}
```

Returned by the provider after every completion. Accumulated across turns into the run-level `total_usage` field of `RunState`.

## See also

- **[ChatProvider](chat-provider.md)** — produces and consumes these types.
- **[ProviderRegistry](provider-registry.md)** — routes requests through these types.
