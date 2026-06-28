---
title: ExecutionStore
description: Tool execution records, token usage tracking, and session statistics.
group: storage
order: 4
summary: Tool execution records, token usage, session stats.
related:
  - storage/storage-overview
  - tools/tool-runtime
  - runtime/agent-runtime
---

# `ExecutionStore`

> Tool execution records, token usage, and session statistics.

`ExecutionStore` records every tool execution and token usage event. It is written to by `ToolRuntime` and read by observability dashboards.

The full file is `src/store/mod.rs`.

## API

```rust
#[async_trait]
pub trait ExecutionStore: Send + Sync {
    async fn record_execution(&self, execution: ToolExecution) -> StoreResult<ToolExecution>;
    async fn list_executions(&self, session_id: &Uuid) -> StoreResult<Vec<ToolExecution>>;
    async fn list_executions_by_message(&self, message_id: &Uuid) -> StoreResult<Vec<ToolExecution>>;

    async fn record_usage(&self, record: UsageRecord) -> StoreResult<UsageRecord>;
    async fn list_usage(&self, session_id: &Uuid) -> StoreResult<Vec<UsageRecord>>;

    async fn session_stats(&self, session_id: &Uuid) -> StoreResult<SessionStats>;
    async fn delete_by_session(&self, session_id: &Uuid) -> StoreResult<u64>;
}
```

## Key types

### `ToolExecution`

```rust
pub struct ToolExecution {
    pub id: Uuid,
    pub session_id: Uuid,
    pub message_id: Uuid,
    pub call_id: String,
    pub tool_name: String,
    pub arguments: Value,
    pub result: Option<ToolOutput>,
    pub status: ToolStatus,
    pub duration_ms: u64,
    pub created_at: DateTime<Utc>,
}
```

### `UsageRecord`

```rust
pub struct UsageRecord {
    pub id: Uuid,
    pub session_id: Uuid,
    pub message_id: Uuid,
    pub provider: ProviderId,
    pub model: ModelName,
    pub input_tokens: u32,
    pub output_tokens: u32,
    pub created_at: DateTime<Utc>,
}
```

### `SessionStats`

```rust
pub struct SessionStats {
    pub session_id: Uuid,
    pub message_count: u64,
    pub tool_call_count: u64,
    pub tool_success_count: u64,
    pub tool_failure_count: u64,
    pub total_input_tokens: u64,
    pub total_output_tokens: u64,
    pub total_tokens: u64,
    pub avg_tool_duration_ms: u64,
}
```

## Backend

- **Memory** — `MemoryExecutionStore`, default. `HashMap`s in-process.

## See also

- **[Storage Overview](storage-overview.md)** — the full matrix.
- **[ToolRuntime](../tools/tool-runtime.md)** — the writer.
