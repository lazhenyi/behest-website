---
title: DrainGuard
description: 热替换后通过 Arc 引用计数进行显式 drain 跟踪。
group: core
order: 7
summary: 包装旧 Arc 以等待在途引用 drain 完成。
related:
  - core/component-trait
  - core/component-registry
  - core/drain-aware-replace
  - ops/hot-reload
---

# `DrainGuard`

> 等待被替换组件的在途引用 drain 完成。

在 `ComponentRegistry::replace_instance` 或 `ManagedRuntime::reload` 返回旧组件后，调用者持有一个 `Arc<T>`。其他任务（在途请求、后台作业）可能也持有 `Arc<T>` 克隆。`DrainGuard` 包装旧 `Arc<T>` 并提供工具来**等待**所有其他持有者释放引用。

## 工作原理

guard 自身持有一个强引用。当 `Arc::strong_count` 等于 1（仅剩 guard 的引用）时，认为 drain 完成。guard 以 50 ms 间隔轮询 `strong_count`。

```text
   replace_instance 返回旧 Arc<T>
         │
         ▼
   DrainGuard::new(old)
         │
         ▼
   wait_for_drain(timeout)
         │
    ┌────┴────┐
    │         │
  Drained   Timeout { remaining: N }
```

## API

```rust
pub enum DrainResult {
    /// 所有引用已成功 drain。
    Drained,
    /// 超时，仍有未释放的引用。
    Timeout { remaining: usize },
}

pub struct DrainGuard<T: ?Sized + Send + Sync> { /* ... */ }

impl<T: ?Sized + Send + Sync> DrainGuard<T> {
    /// 包装一个现有的 Arc<T>。
    pub fn new(inner: Arc<T>) -> Self;

    /// 此 guard 之外的未释放引用数。
    /// 0 表示只有 guard 持有引用。
    pub fn outstanding_refs(&self) -> usize;

    /// 等待所有其他持有者 drop，或超时到期。
    /// 以 50 ms 间隔轮询。
    pub async fn wait_for_drain(&self, timeout: Duration) -> DrainResult;

    /// 借用内部 Arc<T>。
    pub fn arc(&self) -> &Arc<T>;

    /// 消费 guard 并返回内部 Arc<T>。
    pub fn into_inner(self) -> Arc<T>;
}
```

## 用法

```rust
use behest::runtime::drain::DrainGuard;
use std::time::Duration;

// replace_instance 返回旧组件后：
let old = registry.replace_instance("db", new_instance).await?;
let guard = DrainGuard::new(old);

// 等待在途引用 drain（最多 30 秒）。
match guard.wait_for_drain(Duration::from_secs(30)).await {
    DrainResult::Drained => {
        // 所有引用已释放。可以安全清理。
    }
    DrainResult::Timeout { remaining } => {
        tracing::warn!(remaining, "drain 超时；仍有引用未释放");
    }
}
```

## 自然 drain vs 显式 drain

`ManagedRuntime::reload` 使用**自然 drain**：返回旧 `Arc<T>`，调用者决定何时 drop。没有超时 —— 旧实例存活到最后一个引用被释放。

`DrainGuard` 在自然 drain 之上添加了**显式跟踪**：

| 方式 | 机制 | 超时 | 适用场景 |
|------|------|------|----------|
| 自然 drain | 返回 `Arc<T>`，调用者 drop | 无 | 大多数场景 |
| `DrainGuard` | `wait_for_drain(timeout)` 轮询 `strong_count` | 可配置 | 需要知道 drain 何时完成或强制截止时间 |

## 与 `ExtensionPoint` drain 的关系

`ExtensionPoint` drain 协议在 `replace` 方法内部循环轮询 `Arc::strong_count`，带有可配置超时。`DrainGuard` 是一个独立工具，适用于调用者想显式管理 drain 时间线的场景 —— 例如，记录最后一个在途请求何时完成，或在截止时间后强制停止。

## 另见

- **[热替换](../ops/hot-reload.md)** —— 面向操作者的协议。
- **[ComponentRegistry](component-registry.md)** —— `replace_instance` 返回旧 Arc。
- **[Drain-aware Replace](drain-aware-replace.md)** —— ExtensionPoint 层面的协议。
