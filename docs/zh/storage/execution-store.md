---
title: ExecutionStore
description: Tool 执行记录、token 用量追踪与 session 统计。
group: storage
order: 4
summary: Tool 执行记录、token 用量、session 统计。
related: []
---

# ExecutionStore

> Tool 执行记录、token 用量与 session 统计。

## API

```rust
#[async_trait]
pub trait ExecutionStore: Send + Sync {
    async fn record_execution(&self, execution: ToolExecution) -> StoreResult<ToolExecution>;
    async fn record_usage(&self, record: UsageRecord) -> StoreResult<UsageRecord>;
    async fn session_stats(&self, session_id: &Uuid) -> StoreResult<SessionStats>;
}
```

## 关键类型

- **ToolExecution** —— session_id, call_id, tool_name, arguments, result, status, duration_ms。
- **UsageRecord** —— session_id, provider, model, input_tokens, output_tokens。
- **SessionStats** —— message_count, tool_call_count, total_tokens, avg_tool_duration_ms。

## 另见

- **[Storage Overview](storage-overview.md)** —— 完整矩阵。
- **[ToolRuntime](../tools/tool-runtime.md)** —— 写入方。

