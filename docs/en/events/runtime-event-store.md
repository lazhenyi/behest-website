---
title: RuntimeEventStore
description: "Durable event persistence: the source of truth for replay."
group: events
order: 3
summary: Durable event persistence; the source of truth for replay.
related:
  - events/runtime-invocation
  - events/agent-event
  - events/runtime-subscription-hub
---

# `RuntimeEventStore`

> Durable event persistence.

`RuntimeEventStore` is the **source of truth** for events. Every event emitted by the runtime is appended to the store; `RuntimeSubscriptionHub` reads from the store to replay events to new subscribers.

The full file is `src/runtime/event_store.rs`.

## Trait

```rust
#[async_trait]
pub trait RuntimeEventStore: Send + Sync {
    async fn append(&self, envelope: RuntimeEventEnvelope) -> Result<RuntimeEventEnvelope, RuntimeEventStoreError>;
    async fn list_after(&self, room: RuntimeRoom, after_seq: u64, limit: usize) -> Result<Vec<RuntimeEventEnvelope>, RuntimeEventStoreError>;
    async fn latest_seq(&self, room: RuntimeRoom) -> Result<u64, RuntimeEventStoreError>;
}
```

## Backends

- **`MemoryRuntimeEventStore`** — in-memory, default. Used in tests.
- **`RedisRuntimeEventStore`** — Redis Streams (`XADD` / `XRANGE`); feature `redis`.
- **`PostgresRuntimeEventStore`** — PostgreSQL `runtime_events` table with JSONB; feature `sqlx-postgres`.
- **`FailingRuntimeEventStore`** — always returns errors; for failure-injection tests.

## Sequence

`RuntimeEventStore` assigns a monotonic `seq` to every event in a `room` (a room is a logical channel — typically a run id, but it can also be a session or provider). `seq` is what `RuntimeSubscriptionHub` uses to deduplicate live + replay.

## See also

- **[RuntimeSubscriptionHub](runtime-subscription-hub.md)** — the consumer.
- **[AgentEvent](agent-event.md)** — the event payload.
