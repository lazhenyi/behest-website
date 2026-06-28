---
title: ContextAdapter
description: The trait for injecting context into a chat request before the model call.
group: tools
order: 8
summary: The `ContextAdapter` trait and built-in static / function adapters.
related:
  - tools/rag-context-adapter
  - runtime/context-pipeline
---

# `ContextAdapter`

> Inject extra context into a chat request.

`ContextAdapter` is the trait that `ContextPipeline` calls to add system prompts, RAG snippets, function outputs, and other injected content to a `ChatRequest` before the model call.

The full file is `src/context.rs`.

## API

```rust
#[async_trait]
pub trait ContextAdapter: Send + Sync {
    async fn adapt(&self, input: &ContextInput) -> Result<ContextOutput, ContextError>;
}

pub struct ContextInput {
    pub session: Session,
    pub user_input: String,
    pub current_messages: Vec<Message>,
}

pub struct ContextOutput {
    pub prepend_messages: Vec<Message>,
    pub append_messages: Vec<Message>,
}
```

## Built-in adapters

- **`StaticAdapter`** — prepends a fixed system message. Use for "You are a helpful assistant."
- **`FunctionAdapter<F>`** — calls a closure to produce messages. Use for dynamic system prompts.
- **`RagContextAdapter`** — searches an embedding store and prepends relevant snippets.

## See also

- **[RAG Context Adapter](rag-context-adapter.md)** — the RAG implementation.
- **[ContextPipeline](../runtime/context-pipeline.md)** — the caller.
