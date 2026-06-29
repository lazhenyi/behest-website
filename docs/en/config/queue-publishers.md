---
title: Queue Publishers
description: External event publishing through NATS or Redis Streams.
group: config
order: 5
summary: External event publishing through NATS or Redis Streams.
related:
  - events/agent-event
  - intro/feature-flags
---

# Queue Publishers

> External event publishing.

The `queue` module provides the `EventPublisher` trait and two feature-gated implementations for publishing `AgentEvent` values to external message brokers.

## `EventPublisher` trait

```rust
#[async_trait]
pub trait EventPublisher: Send + Sync {
    async fn publish(&self, event: &AgentEvent) -> Result<(), QueueError>;
    async fn health_check(&self) -> Result<(), QueueError>;
}
```

## Backends

| Backend | Feature | Mechanism |
|---|---|---|
| NATS | `nats` + `queue` | NATS JetStream publish per run |
| Redis Streams | `redis` + `queue` | `XADD` per run stream |
| No-op | `queue` (core) | Discards events (for testing) |

## How it works

A `tokio::spawn` task enqueues a `PublishToQueue` job after each event is persisted. The publisher receives the event and pushes it to the configured broker. Failures are logged and counted; the run loop does not block on publish failures.

## When to use

- Fan-out observability to external systems.
- Triggering downstream workflows on run completion.
- Cross-instance event synchronisation.

## See also

- **[AgentEvent](../events/agent-event.md)** — the event type.
- **[Feature Flags](../intro/feature-flags.md)** — the `queue` and `nats` features.
