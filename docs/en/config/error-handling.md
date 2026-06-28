---
title: Error Handling
description: Typed error categories, retryable flags, and the error hierarchy.
group: config
order: 3
summary: Typed error categories and retryable / context-overflow flags.
related:
  - config/agent-config
  - providers/chat-provider
  - runtime/agent-runtime
---

# Error Handling

> Typed error categories, not stringly failures.

`behest` exposes typed error categories. Every public API returns a `Result<T, E>` where `E` is one of the crate-level error types.

## Error hierarchy

```
Error
├── ProviderError
│   ├── Authentication
│   ├── RateLimited
│   ├── Timeout
│   ├── Overloaded
│   ├── Transport
│   ├── Unsupported
│   ├── BadRequest
│   ├── Decode
│   └── Provider (catch-all)
├── ToolError
│   ├── AlreadyRegistered
│   ├── NotFound
│   ├── InvalidArguments
│   ├── ExecutionFailed
│   ├── Timeout
│   └── NotImplemented
├── StorageError
│   ├── NotFound
│   ├── ConnectionFailed
│   ├── SerializationFailed
│   ├── DataCorruption
│   └── MigrationFailed
├── ContextError
├── RuntimeError
└── top-level Error
```

## Retryable classification

`ProviderError` exposes two classification methods:

```rust
impl ProviderError {
    pub fn is_retryable(&self) -> bool {
        matches!(self, Self::RateLimited { .. } | Self::Timeout { .. } | Self::Overloaded { .. } | Self::Transport { .. })
    }

    pub fn is_context_overflow(&self) -> bool {
        matches!(self, Self::BadRequest { .. }) && self.message_contains("context_length_exceeded")
    }
}
```

`ModelRouter` uses `is_retryable()` to decide whether to retry or fall back. `CompactionService` uses `is_context_overflow()` to trigger reactive compaction.

## Source chain

Lower-level errors are preserved via `#[source]`:

```rust
#[derive(Error, Debug)]
pub enum ProviderError {
    #[error("transport error for {provider}: {source}")]
    Transport {
        provider: ProviderId,
        #[source]
        source: reqwest::Error,
    },
}
```

Callers can inspect the source chain with `std::error::Error::source()`.

## Crate-level `Result`

```rust
pub type Result<T> = std::result::Result<T, Error>;
```

The top-level `Error` enum wraps all five categories plus a `Config` variant for configuration errors.

## See also

- **[ChatProvider](../providers/chat-provider.md)** — the source of `ProviderError`.
- **[AgentRuntime](../runtime/agent-runtime.md)** — the consumer.
- **[ModelRouter](../runtime/model-router.md)** — uses `is_retryable()`.
