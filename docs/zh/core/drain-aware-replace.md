---
title: Drain-aware Replace
description: 原子替换配合自然 Arc drain，保证 in-flight 安全的热替换。
group: core
order: 3
summary: 原子替换返回旧 `Arc<T>`；自然的引用计数 drain 保证 in-flight 工作安全。
related:
  - core/extension-point
  - core/extensions-facade
  - ops/managed-runtime
  - ops/hot-reload
---

# Drain-aware Replace

> 原子替换配合自然 `Arc` drain，保证 in-flight 安全的热替换。

当你在 [`ExtensionPoint<T>`](extension-point.md) 中替换已注册的 `Arc<T>` 时，整个交换是一次原子 `replace` 调用：存储槽位被更新为指向新值，而之前的 `Arc<T>` 被交还给调用方。已经持有旧 `Arc<T>` 克隆的 in-flight 请求会继续在旧实例上工作，直到它们 drop 它；新的 `get` 调用返回新实例。

`ExtensionPoint` 层面没有单独的 drain API。Drain 是**自然的**：旧值会一直存活，直到它的最后一个外部持有者 drop 它，然后由 Rust 正常的引用计数释放。发起交换的调用方可以选择等待那个时刻（持有返回的 `Arc<T>` 并轮询 `Arc::strong_count`，或者 await 它所知道的任何 in-flight 工作），或者直接 drop 它，让旧实例在后台被回收。

完整源码在 `src/runtime/extension.rs`。

## 为什么存在

旧版 `ProviderRegistry::register_chat_arc` 会**静默替换**旧 provider 并立即 drop 它。生产中由此带来两种失败模式：

1. **in-flight 请求被中断。** 已经发出模型请求的 `runtime.run()`，在替换之后会去消费**新** provider 的 stream，但请求 id 是发给**旧** provider 的。新 provider 返回 `404 Not Found`；调用失败。
2. **半应用的 tool call。** 已 dispatch 到旧 store、正在写入中的 tool 执行会突然发现连接被断开，结果由新 store 以同样的 key 持久化下一个请求。

从 `replace` 返回旧 `Arc<T>` 消除了这两种失败模式：调用方可以在回收旧实例之前观察到它何时真正空闲（通过 `Arc::strong_count` 或 await 已知的 in-flight 工作）。

## API

```rust
impl<T: ?Sized + Send + Sync + 'static> ExtensionPoint<T> {
    pub fn replace(&self, name: &str, new: Arc<T>) -> Result<Arc<T>, ExtensionError>;
}
```

`replace` 在存储 map 层面是同步且原子的：

1. 查找 `name`。如果缺失，返回 `ExtensionError::NotFound`。
2. 移除旧条目并插入新条目。
3. 返回之前的 `Arc<T>`。

调用返回后，新的 `get(name)` 调用解析为 `new`。已经持有旧 `Arc<T>` 克隆的调用方继续在旧实例上操作，直到它们 drop 它。

`replace` **不**检查旧 `Arc<T>` 是否仍在使用 —— 这是调用方的责任。如果你需要等待 in-flight 工作完成，请持有返回的 `Arc<T>` 并轮询 `Arc::strong_count`，或者 await 你所知道的工作。

## 完整示例 —— provider 热替换

```rust
use std::sync::Arc;
use behest::runtime::extensions::Extensions;

async fn swap_openai_provider(
    exts: Arc<Extensions>,
    new_adapter: Arc<dyn behest::provider::ChatProvider>,
) -> Result<(), Box<dyn std::error::Error>> {
    // 原子交换。新请求现在走 new_adapter。
    let old = exts.chat_providers.replace("openai", new_adapter)?;

    // 旧 provider 会一直存活，直到 `old`（以及 in-flight run 持有的任何克隆）
    // 被 drop。你可以：
    //   - 立即 drop(old)，让 Rust 在后台回收它，或者
    //   - 持有 old 并轮询 Arc::strong_count(&old) 直到它降到 1
    //     （意味着只剩你的引用），然后 drop 它。
    drop(old);
    Ok(())
}
```

## 边界情况与错误语义

- **Name 不存在** —— 如果 name 从未注册过，`replace` 返回 `ExtensionError::NotFound`。不能"替换一个不存在的东西"；先 `register`。
- **并发 unregister** —— 如果 `unregister("k")` 在你的 `get("k")` 与你的 `replace("k", …)` 之间运行，`replace` 返回 `NotFound`。这是有意的：并发的 unregister 意味着 Operator 改变了主意，swap 应中止。
- **Swap 时的 strong count** —— 如果 storage 槽位是唯一引用（没有 in-flight 请求，也没有外部持有者），返回的 `Arc<T>` 就是最后一个；drop 它会立即回收旧实例。
- **长跑持有者** —— 如果一个任务长时间持有 `Arc<T>` 克隆（例如一个耗时数分钟的流式响应），旧实例会在内存里停留那么久。`ExtensionPoint` 层面没有超时；如果你需要期限，请在调用方强制执行（例如在持有 `Arc` 的工作周围用 `tokio::time::timeout`）。
- **锁中毒** —— 如果在持有内部 `RwLock` 时发生 panic，后续调用返回 `ExtensionError::LockPoisoned`。

## 与其它组件的关系

协议完全在 `ExtensionPoint` 中实现；`Extensions` 只是通过 13 个 `ExtensionPoint` 字段暴露它。消费者是 `ManagedRuntime::reload`，通过 `replace` 以及可选的 pre/post-replace 钩子来 swap provider、store 以及任何其它可热插拔的组件。

- **[ExtensionPoint](extension-point.md)** —— 实现 `replace`。
- **[Extensions](extensions-facade.md)** —— 通过 13 个 `ExtensionPoint` 字段暴露协议。
- **[ManagedRuntime](../ops/managed-runtime.md)** —— 高层 `reload(name, new_cfg)` API。
- **[Hot Reload](../ops/hot-reload.md)** —— 完整运维故事：pre-replace 钩子、post-replace 钩子、drain 指引。

## 另见

- **[ExtensionPoint](extension-point.md)** —— 存储原语。
- **[ManagedRuntime](../ops/managed-runtime.md)** —— 顶层编排器。
- **[Hot Reload](../ops/hot-reload.md)** —— 面向 Operator 的热重载指南。
