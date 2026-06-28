---
title: Error Handling
description: 类型化错误类别、可重试标记与错误层级。
group: config
order: 3
summary: 类型化错误类别与可重试标记。
related: []
---

# Error Handling

> 类型化错误类别。

## 错误层级

```
Error
├── ProviderError (Authentication, RateLimited, Timeout, Overloaded, Transport, Unsupported, BadRequest)
├── ToolError (AlreadyRegistered, NotFound, InvalidArguments, ExecutionFailed, Timeout)
├── StorageError (NotFound, ConnectionFailed, SerializationFailed)
├── ContextError
└── RuntimeError
```

## 可重试分类

`ProviderError::is_retryable()` 对 RateLimited/Timeout/Overloaded/Transport 返回 true。

`ProviderError::is_context_overflow()` 用于触发被动压缩。

## 另见

- **[ChatProvider](../providers/chat-provider.md)** —— ProviderError 的来源。
- **[ModelRouter](../runtime/model-router.md)** —— 使用 is_retryable()。

