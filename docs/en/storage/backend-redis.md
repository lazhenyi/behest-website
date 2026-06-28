---
title: "Backend: Redis"
description: Redis-backed session store and event primitives.
group: storage
order: 9
summary: Redis-backed store support and Redis Streams primitives.
related:
  - storage/session-store
  - events/runtime-event-store
  - events/runtime-stream-adapter
---

# Backend: Redis

> Redis-backed session store, event store, and stream adapter.

Feature `redis`. Provides `RedisSessionStore`, `RedisRuntimeEventStore`, `RedisRuntimeStreamAdapter`, and `RedisSessionDataStore`.

## Stores

| Type | Trait | Mechanism |
|---|---|---|
| `RedisSessionStore` | `SessionStore` | Hash for session metadata, List for messages |
| `RedisRuntimeEventStore` | `RuntimeEventStore` | Redis Streams (`XADD` / `XRANGE`) |
| `RedisRuntimeStreamAdapter` | `RuntimeStreamAdapter` | Redis Pub/Sub |
| `RedisSessionDataStore` | `SessionDataStore` | Hash per session |

## Configuration

```toml
[store.session.redis]
url = "redis://localhost:6379"
prefix = "behest:"
max_connections = 16
```

## When to use

- Multi-process deployments sharing session state.
- Distributed event log across instances.
- Moderate durability (Redis with AOF persistence).

## See also

- **[Storage Overview](storage-overview.md)** — the full matrix.
- **[RuntimeEventStore](../events/runtime-event-store.md)** — the event store trait.
