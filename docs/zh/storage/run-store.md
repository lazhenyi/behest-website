---
title: RunStore
description: 事件溯源 run 生命周期：创建 run、追加事件、投影状态。
group: storage
order: 6
summary: 事件溯源 run 生命周期。
related: []
---

# RunStore

> 事件溯源 run 生命周期。

## API

```rust
#[async_trait]
pub trait RunStore: Send + Sync {
    async fn create_run(&self, record: RunRecord) -> RuntimeResult<()>;
    async fn append_event(&self, record: RunEventRecord) -> RuntimeResult<()>;
    async fn list_events(&self, run_id: RunId) -> RuntimeResult<Vec<RunEventRecord>>;
    async fn get_run_state(&self, run_id: RunId) -> RuntimeResult<RunState>;
}
```

## 投影

`get_run_state()` 有默认实现：折叠 `get_run()` + `list_events()` 为 `RunState`。

## 原子性

`append_event` 必须原子更新 run 的 status、total_usage、iteration 和 last_finish。

## 另见

- **[Storage Overview](storage-overview.md)** —— 完整矩阵。
- **[RunState](../runtime/run-state.md)** —— 投影。

