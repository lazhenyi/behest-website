---
title: RuntimeEventStore
description: 持久化事件存储：回放的权威源。
group: events
order: 3
summary: 持久化事件存储；回放的权威源。
related:
  - events/runtime-invocation
  - events/agent-event
  - events/runtime-subscription-hub
---

# `RuntimeEventStore`

> 持久化事件存储。

`RuntimeEventStore` 是事件的**权威源**。Runtime 发射的每个事件都被追加到存储；`RuntimeSubscriptionHub` 从存储读，向新订阅者回放事件。

完整源码在 `src/runtime/event_store.rs`。

## Trait

```rust
#[async_trait]
pub trait RuntimeEventStore: Send + Sync {
    async fn append(&self, envelope: RuntimeEventEnvelope) -> Result<RuntimeEventEnvelope, RuntimeEventStoreError>;
    async fn list_after(&self, room: RuntimeRoom, after_seq: u64, limit: usize) -> Result<Vec<RuntimeEventEnvelope>, RuntimeEventStoreError>;
    async fn latest_seq(&self, room: RuntimeRoom) -> Result<u64, RuntimeEventStoreError>;
}
```

## 后端

- **`MemoryRuntimeEventStore`** —— 内存版，默认。用于测试。
- **`RedisRuntimeEventStore`** —— Redis Streams（`XADD` / `XRANGE`）；feature `redis`。
- **`PostgresRuntimeEventStore`** —— PostgreSQL `runtime_events` 表（JSONB）；feature `sqlx-postgres`。
- **`FailingRuntimeEventStore`** —— 永远返回错误；用于故障注入测试。

## 序号

`RuntimeEventStore` 给每个 `room`（逻辑通道，通常是 run id，也可以是 session 或 provider）中的事件分配单调 `seq`。`seq` 是 `RuntimeSubscriptionHub` 用来对 live + replay 去重的。

## 另见

- **[RuntimeSubscriptionHub](runtime-subscription-hub.md)** —— 消费者。
- **[AgentEvent](agent-event.md)** —— 事件 payload。
