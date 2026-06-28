---
title: SessionDataStore
description: "Per-session data store for invocation context: opaque key-value pairs that travel with the session."
group: events
order: 7
summary: Per-session data store for invocation context.
related:
  - events/runtime-invocation
  - storage/session-store
---

# `SessionDataStore`

> Opaque per-session data for the run loop.

`SessionDataStore` holds key-value data that travels with a session and is available to every tool and adapter during a turn. It is **separate** from `SessionStore` (which holds the canonical message history) because:

- It is opaque to the model.
- It does not need transactional semantics.
- It is small (kilobytes per session, not megabytes).

The full file is `src/runtime/session_data_store.rs`.

## API

```rust
#[async_trait]
pub trait SessionDataStore: Send + Sync {
    async fn get(&self, session_id: Uuid, key: &str) -> Result<Option<Vec<u8>>, SessionDataError>;
    async fn set(&self, session_id: Uuid, key: &str, value: Vec<u8>) -> Result<(), SessionDataError>;
    async fn delete(&self, session_id: Uuid, key: &str) -> Result<(), SessionDataError>;
    async fn list_keys(&self, session_id: Uuid) -> Result<Vec<String>, SessionDataError>;
    async fn health_check(&self) -> Result<(), SessionDataError>;
}
```

## Backends

- **`MemorySessionDataStore`** — in-process; default.
- **`FileSessionDataStore`** — file-based; default in production.
- **`RedisSessionDataStore`** — feature `redis`.

## Use cases

- Cached user preferences (theme, language) that are read on every turn.
- Tool-specific state (e.g. a draft document the user is editing).
- A/B testing flags that change the prompt strategy.

## See also

- **[RuntimeInvocation](runtime-invocation.md)** — the consumer.
- **[SessionStore](../storage/session-store)** — the canonical session data.
