---
title: RuntimeStreamAdapter
description: Best-effort live fan-out of events across run / session / provider rooms.
group: events
order: 4
summary: Best-effort live fanout across run / session / provider rooms.
related:
  - events/runtime-subscription-hub
  - events/runtime-event-store
  - events/agent-event
---

# `RuntimeStreamAdapter`

> Best-effort live fan-out.

`RuntimeStreamAdapter` delivers events to live subscribers as they are emitted. Unlike `RuntimeEventStore`, it does not persist; subscribers that come online after an event is emitted miss it (use `RuntimeEventStore` + `RuntimeSubscriptionHub` for the durable path).

The full file is `src/runtime/stream_adapter.rs`.

## Trait

```rust
#[async_trait]
pub trait RuntimeStreamAdapter: Send + Sync {
    async fn publish(&self, envelope: RuntimeEventEnvelope) -> Result<(), RuntimeStreamError>;
    fn subscribe(&self, room: RuntimeRoom) -> BoxRuntimeEventStream;
}
```

## Backends

- **`MemoryRuntimeStreamAdapter`** — tokio broadcast channel; default.
- **`RedisRuntimeStreamAdapter`** — Redis Pub/Sub; feature `redis`.
- **`NatsJetStreamStreamAdapter`** — NATS JetStream, per-room stream with ephemeral pull consumer; feature `nats`.
- **`FailingRuntimeStreamAdapter`** — for tests.

## See also

- **[RuntimeSubscriptionHub](runtime-subscription-hub.md)** — pairs this with `RuntimeEventStore`.
- **[RuntimeEventStore](runtime-event-store.md)** — the durable path.
