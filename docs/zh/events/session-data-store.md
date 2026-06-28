---
title: SessionDataStore
description: 跟随 session 的 per-session 数据存储，供调用上下文使用。
group: events
order: 7
summary: 跟随 session 的 per-session 数据存储，供调用上下文使用。
related:
  - events/runtime-invocation
  - storage/session-store
---

# `SessionDataStore`

> 跟随 run 循环的不透明 per-session 数据。

`SessionDataStore` 存放与 session 一起移动的键值数据，每个 turn 期间的每个 tool 和 adapter 都能访问。它与 `SessionStore`（持有规范消息历史）**分离**，因为：

- 它对模型不透明。
- 它不需要事务语义。
- 它很小（每个 session 几 KB，不是几 MB）。

完整源码在 `src/runtime/session_data_store.rs`。

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

## 后端

- **`MemorySessionDataStore`** —— 进程内；默认。
- **`FileSessionDataStore`** —— 基于文件；生产默认。
- **`RedisSessionDataStore`** —— feature `redis`。

## 用例

- 缓存的用户偏好（主题、语言），每个 turn 都读取。
- tool 特定状态（例如用户正在编辑的草稿）。
- A/B 测试标志，用于改变 prompt 策略。

## 另见

- **[RuntimeInvocation](runtime-invocation.md)** —— 消费者。
- **[SessionStore](../storage/session-store)** —— 规范 session 数据。
