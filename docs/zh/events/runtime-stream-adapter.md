---
title: RuntimeStreamAdapter
description: 跨 run / session / provider room 的尽力而为 live 扇出。
group: events
order: 4
summary: 跨 run / session / provider room 的尽力而为 live 扇出。
related:
  - events/runtime-subscription-hub
  - events/runtime-event-store
  - events/agent-event
---

# `RuntimeStreamAdapter`

> 尽力而为的 live 扇出。

`RuntimeStreamAdapter` 在事件发射时把事件投递给 live 订阅者。不同于 `RuntimeEventStore`，它不持久化；事件发射后才上线的订阅者会错过它（要持久路径用 `RuntimeEventStore` + `RuntimeSubscriptionHub`）。

完整源码在 `src/runtime/stream_adapter.rs`。

## Trait

```rust
#[async_trait]
pub trait RuntimeStreamAdapter: Send + Sync {
    async fn publish(&self, envelope: RuntimeEventEnvelope) -> Result<(), RuntimeStreamError>;
    fn subscribe(&self, room: RuntimeRoom) -> BoxRuntimeEventStream;
}
```

## 后端

- **`MemoryRuntimeStreamAdapter`** —— tokio broadcast channel；默认。
- **`RedisRuntimeStreamAdapter`** —— Redis Pub/Sub；feature `redis`。
- **`NatsJetStreamStreamAdapter`** —— NATS JetStream，每个 room 一个 stream，临时 pull consumer；feature `nats`。
- **`FailingRuntimeStreamAdapter`** —— 用于测试。

## 另见

- **[RuntimeSubscriptionHub](runtime-subscription-hub.md)** —— 把本组件与 `RuntimeEventStore` 配对。
- **[RuntimeEventStore](runtime-event-store.md)** —— 持久路径。
