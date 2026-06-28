---
title: SessionStore
description: Session CRUD、消息历史与压缩元数据。
group: storage
order: 2
summary: Session CRUD、消息历史、压缩元数据。
related: []
---

# SessionStore

> Session CRUD 和消息历史。

## API

```rust
#[async_trait]
pub trait SessionStore: Send + Sync {
    async fn create_session(&self, session: Session) -> StoreResult<Session>;
    async fn get_session(&self, id: &Uuid) -> StoreResult<Option<Session>>;
    async fn delete_session(&self, id: &Uuid) -> StoreResult<()>;
    async fn append_message(&self, message: MessageRecord) -> StoreResult<MessageRecord>;
    async fn list_messages(&self, session_id: &Uuid) -> StoreResult<Vec<MessageRecord>>;
    async fn get_latest_compaction(&self, session_id: &Uuid) -> StoreResult<Option<CompactionMeta>>;
}
```

## 关键类型

- **Session** —— id, title, model, created_at, updated_at, metadata。
- **MessageRecord** —— id, session_id, role, content, tool_calls, usage, compaction 标记。
- **CompactionMeta** —— tail_start_id, previous_compaction_id, summary_text。

## Backend

Memory（默认）、Redis、SQLx（pg/mysql/sqlite）、MongoDB、SurrealDB。

## 另见

- **[Storage Overview](storage-overview.md)** —— 完整矩阵。
- **[CompactionService](../runtime/compaction-service.md)** —— 读取 CompactionMeta。

