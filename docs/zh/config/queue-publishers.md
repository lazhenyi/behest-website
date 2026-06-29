---
title: Queue Publishers
description: 通过 NATS 或 Redis Streams 的外部事件发布。
group: config
order: 5
summary: 通过 NATS 或 Redis Streams 的外部事件发布。
related: []
---

# Queue Publishers

> 外部事件发布。

## EventPublisher trait

```rust
pub trait EventPublisher: Send + Sync {
    async fn publish(&self, event: &AgentEvent) -> Result<(), QueueError>;
}
```

## Backend

| Backend | Feature | 机制 |
|---|---|---|
| NATS | nats + queue | JetStream publish |
| Redis Streams | redis + queue | XADD |

## 另见

- **[AgentEvent](../events/agent-event.md)** —— 事件类型。

