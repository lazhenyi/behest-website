---
title: SessionStore
description: Session CRUD, message history, and compaction metadata.
group: storage
order: 2
summary: Session CRUD, message history, compaction meta.
related:
  - storage/storage-overview
  - storage/runtime-store
  - runtime/compaction-service
---

# `SessionStore`

> Session CRUD and message history.

`SessionStore` is the primary persistence trait. It manages sessions, their message history, and compaction metadata.

The full file is `src/store/mod.rs`.

## API

```rust
#[async_trait]
pub trait SessionStore: Send + Sync {
    async fn create_session(&self, session: Session) -> StoreResult<Session>;
    async fn get_session(&self, id: &Uuid) -> StoreResult<Option<Session>>;
    async fn update_session(&self, id: &Uuid, title: &str, model: Option<&ModelName>) -> StoreResult<Session>;
    async fn delete_session(&self, id: &Uuid) -> StoreResult<()>;
    async fn list_sessions(&self) -> StoreResult<Vec<Session>>;
    async fn list_sessions_paginated(&self, pagination: Pagination, filter: SessionFilter) -> StoreResult<Vec<Session>>;

    async fn append_message(&self, message: MessageRecord) -> StoreResult<MessageRecord>;
    async fn list_messages(&self, session_id: &Uuid) -> StoreResult<Vec<MessageRecord>>;
    async fn list_messages_paginated(&self, session_id: &Uuid, pagination: Pagination) -> StoreResult<Vec<MessageRecord>>;
    async fn update_usage(&self, message_id: &Uuid, usage: TokenUsage) -> StoreResult<()>;

    async fn get_latest_compaction(&self, session_id: &Uuid) -> StoreResult<Option<CompactionMeta>>;
    async fn health_check(&self) -> StoreResult<()>;
}
```

## Key types

### `Session`

```rust
pub struct Session {
    pub id: Uuid,
    pub title: String,
    pub model: ModelName,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub metadata: Value,
}
```

### `MessageRecord`

```rust
pub struct MessageRecord {
    pub id: Uuid,
    pub session_id: Uuid,
    pub role: MessageRole,
    pub content: Vec<ContentPart>,
    pub tool_calls: Vec<ToolCall>,
    pub tool_call_id: Option<String>,
    pub tool_name: Option<String>,
    pub usage: Option<TokenUsage>,
    pub created_at: DateTime<Utc>,
    pub is_compaction: bool,
    pub is_summary: bool,
    pub compaction_meta: Option<CompactionMeta>,
}
```

### `CompactionMeta`

```rust
pub struct CompactionMeta {
    pub tail_start_id: Uuid,
    pub previous_compaction_id: Option<Uuid>,
    pub summary_text: String,
}
```

## Backends

- **Memory** — `MemorySessionStore`, default. In-process `HashMap`.
- **Redis** — feature `redis`. Redis hash + list for messages.
- **SQLx** — features `sqlx-postgres`, `sqlx-mysql`, `sqlx-sqlite`. Relational schema with migrations.
- **MongoDB** — feature `mongodb`. Document store.
- **SurrealDB** — feature `surrealdb`. Multi-model database.

## See also

- **[Storage Overview](storage-overview.md)** — the full matrix.
- **[RuntimeStore](runtime-store.md)** — the facade.
- **[CompactionService](../runtime/compaction-service.md)** — reads `CompactionMeta`.
