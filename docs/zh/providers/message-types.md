---
title: Message Types
description: " \"`Message`、`ContentPart`、`ToolCall`、`FinishReason`、`TokenUsage`——每次 chat 交互的共享词汇表。\""
group: providers
order: 4
summary: " `Message`、`ContentPart`、`ToolCall`、`FinishReason`、`TokenUsage`。"
related:
  - providers/chat-provider
  - providers/provider-registry
---

# Message Types

> 每次 chat 交互的共享词汇表。

`Message`、`ContentPart`、`ToolCall`、`FinishReason` 和 `TokenUsage` 是运行时与每个 provider 之间流转的**数据类型**。它们与 provider 无关；adapter 在这些类型与原生格式之间做转换。

完整源码在 `src/provider/message.rs` 和 `src/provider/tool.rs`。

## `Message`

```rust
#[non_exhaustive]
pub enum Message {
    System { content: Vec<ContentPart> },
    User { content: Vec<ContentPart> },
    Assistant { content: Vec<ContentPart>, tool_calls: Vec<ToolCall> },
    Tool { tool_call_id: String, name: String, content: Vec<ContentPart> },
}
```

## `ContentPart`

```rust
pub enum ContentPart {
    Text { text: String },
    ImageUrl { url: String, detail: Option<String> },
    ToolCall { id: String, name: String, arguments: String },
    ToolResult { tool_call_id: String, content: String },
}
```

## `ToolCall` / `ToolSpec`

```rust
pub struct ToolCall {
    pub id: String, pub name: String, pub arguments: Value,
}
pub struct ToolSpec {
    pub name: String, pub description: String, pub parameters: Value,
}
```

## `FinishReason`

```rust
pub enum FinishReason { Stop, Length, ToolCalls, ContentFilter, FunctionCall }
```

## `TokenUsage`

```rust
pub struct TokenUsage { pub input_tokens: u32, pub output_tokens: u32, pub total_tokens: u32 }
```

## 另见

- **[ChatProvider](chat-provider.md)** —— 生产与消费这些类型。
- **[ProviderRegistry](provider-registry.md)** —— 通过这些类型路由请求。
