---
title: ContextAdapter
description: " 在模型调用前向 chat 请求注入上下文的 trait。"
group: tools
order: 8
summary: " `ContextAdapter` trait 与内置 static / function 适配器。"
related:
  - tools/rag-context-adapter
  - runtime/context-pipeline
---

# `ContextAdapter`

> 向 chat 请求注入额外上下文。

`ContextAdapter` 是 `ContextPipeline` 调用的 trait，用于在模型调用前向 `ChatRequest` 添加系统 prompt、RAG 片段、函数输出等注入内容。

完整源码在 `src/context.rs`。

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

## 内置适配器

- **`StaticAdapter`** —— 前置一条固定系统消息。
- **`FunctionAdapter<F>`** —— 调用闭包产生消息。
- **`RagContextAdapter`** —— 搜索 embedding store 并前置相关片段。

## 另见

- **[RAG Context Adapter](rag-context-adapter.md)** —— RAG 实现。
- **[ContextPipeline](../runtime/context-pipeline.md)** —— 调用方。
