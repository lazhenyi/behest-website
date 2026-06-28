---
title: ExtensionPoint<T>
description: 类型化、按名索引、可热插拔的集合，支持 drain-aware 替换。
group: core
order: 1
summary: 以字符串为 key、基于 `Arc<T>` 的轻量注册表，具备 live-reference 检测与两阶段 drain 协议。
related:
  - core/extensions-facade
  - core/drain-aware-replace
  - core/component-trait
  - core/component-registry
---

# `ExtensionPoint<T>`

> 类型化、按名索引、可热插拔的集合。

`ExtensionPoint<T>` 是可组合运行时的基底。每一种可插拔类别 —— chat provider、embedding provider、工具、上下文适配器、session store、execution store、embedding store、artifact store、run store、event publisher、session data store、runtime event store、snapshot store —— 都被建模为 `ExtensionPoint<dyn Trait>`。Operator 通过按名注册实现来组装运行时，并可在运行时替换任何已注册的实例。

完整源码位于 `src/runtime/extension.rs`。

## 为什么存在

在 `ExtensionPoint<T>` 出现之前，运行时里的每一个"注册表"都是各自定制的结构：`ProviderRegistry` 内部有两个 `HashMap`，`RuntimeStore` 持有五个 trait object，`ContextPipeline` 用一个 `IndexMap`，等等。每个都各自决定如何处理查找、热替换与 live-reference 检测。行为出现分歧：

- `ProviderRegistry::register_chat` 会静默替换已有条目并返回旧值，但**不**检查是否还有人持有它。
- `RuntimeStore` 完全不支持热替换 —— 要换 store 必须重建 runtime。
- context pipeline 直接暴露一个 `IndexMap`，它的可变规则就是 public API。

`ExtensionPoint<T>` 统一了每个注册表都需要的四件事：

1. **Register** — 按名注册，冲突检测。
2. **Replace** — 原子替换，返回旧 `Arc<T>`。
3. **Live reference 检测** —— 防止误删仍在使用的实例。
4. **Drain-aware replace** —— 运行时热替换，等待 in-flight 请求完成。

结果是任意组件（`ProviderRegistry`、`RuntimeStore`、`ContextPipeline`、`ComponentRegistry`、`FactoryRegistry`）都可以把 `ExtensionPoint<T>` 当作内部存储，免费获得这四种行为。

## 设计原则

- **按名索引** —— 每个条目以稳定字符串为 key。命名空间与 component registry 共享，因此配置文件可按名引用 extension（例如 `"primary"`、`"fallback-eu"`）。
- **可克隆** —— 内部状态用 `Arc` 包装，克隆廉价。克隆观察到原对象上的所有注册。
- **可热插拔** —— `replace` 原子地交换存储的 `Arc<T>`，返回上一个。持有旧 `Arc` 的调用方继续使用旧实例；新的 `get` 返回新实例。
- **In-use 检测** —— `unregister` 在外部 `Arc` 仍存在时拒绝删除。这能捕获"删掉一个还在为 run 服务的 provider"这类常见 bug。
- **Drain-aware** —— `begin_replace` + `complete_replace` 组成两阶段协议，允许新实例在旧实例被丢弃前开始接流，配有可配置的 drain 超时。

## API 表面

```rust
use std::sync::Arc;
use behest::runtime::extension::ExtensionPoint;

pub struct ExtensionPoint<T: ?Sized> {
    // private
}

impl<T: ?Sized> ExtensionPoint<T> {
    pub fn new() -> Self;
    pub fn register(&self, name: impl Into<String>, value: Arc<T>) -> Result<(), ExtensionError>;
    pub fn register_or_replace(&self, name: impl Into<String>, value: Arc<T>) -> Option<Arc<T>>;
    pub fn get(&self, name: &str) -> Option<Arc<T>>;
    pub fn names(&self) -> Vec<String>;
    pub fn is_empty(&self) -> bool;
    pub fn len(&self) -> usize;
    pub fn unregister(&self, name: &str) -> Result<Option<Arc<T>>, ExtensionError>;
    pub fn replace(&self, name: &str, new: Arc<T>) -> Result<Arc<T>, ExtensionError>;
    pub fn begin_replace(&self, name: &str, drain_timeout: Duration) -> Result<ReplaceToken, ExtensionError>;
    pub async fn complete_replace(
        self: Arc<Self>,
        name: &str,
        new: Arc<T>,
        token: ReplaceToken,
    ) -> Result<(), ExtensionError>;
}

impl<T: ?Sized> Default for ExtensionPoint<T> { ... }
impl<T: ?Sized> Clone for ExtensionPoint<T> { ... }   // 廉价，Arc-backed
```

### 错误

```rust
pub enum ExtensionError {
    AlreadyRegistered { name: String },
    NotFound { name: String },
    InUse { name: String, strong_count: usize },
    LockPoisoned,
    Replace(ReplaceError),
}
```

所有 variant 标了 `#[non_exhaustive]`；穷尽匹配需要写通配分支。

## 行为

### 注册与查找

```rust
let ep: ExtensionPoint<String> = ExtensionPoint::new();
ep.register("greeting", Arc::new("hello".to_string()))?;
assert_eq!(ep.get("greeting").map(|s| (*s).clone()), Some("hello".to_string()));
```

如果名字已被占用，`register` 返回 `AlreadyRegistered`。`register_or_replace` 是运行时代码最常用的形式 —— 返回旧 `Arc<T>`，让调用方决定如何处理。

### In-use 检测

```rust
let ep: ExtensionPoint<String> = ExtensionPoint::new();
ep.register("k", Arc::new("v".to_string()))?;
let external = ep.get("k").unwrap();           // strong_count = 2 (storage + external)
assert!(ep.unregister("k").is_err());          // 拒绝；仍被使用
drop(external);                                // strong_count = 1
assert!(ep.unregister("k").is_ok());           // 成功；storage 被丢弃
```

强引用计数与注册表自身的那一份引用比较。一个正在被 run await 的外部 `Arc` 就足以阻止 unregister。

### 用 `replace` 热替换

```rust
let ep: ExtensionPoint<String> = ExtensionPoint::new();
ep.register("k", Arc::new("old".to_string()))?;
let old = ep.replace("k", Arc::new("new".to_string()))?;
assert_eq!(*old.unwrap(), "old");
assert_eq!(*ep.get("k").unwrap(), "new");
```

`replace` 在存储 map 的层面是**同步、原子的**。旧 `Arc` 被交还，调用方如果想优雅关闭可以把它交给 drain 协议。`replace` **不会**检查旧 `Arc` 是否仍在使用 —— 这是调用方的责任。想要自动检测，请见下文。

### Drain-aware 热替换

两阶段 `begin_replace` / `complete_replace` 是 `ManagedRuntime::reload` 使用的热替换路径。完整协议、时序图与超时语义见 **[Drain-aware Replace](drain-aware-replace.md)**。

```rust
use std::time::Duration;
use behest::runtime::replace::DEFAULT_DRAIN_TIMEOUT;

let token = ep.begin_replace("k", DEFAULT_DRAIN_TIMEOUT)?;  // 30s
// ... 同时构造并启动新实例 ...
ep_clone.complete_replace("k", new_instance, token).await?;
```

整个流程的设计目标是：**只要还有人可能用着旧值，就绝不丢弃它**。如果 drain 超时到达时仍有 in-flight 引用，替换仍然继续 —— 但旧实例会"泄露"直到最长持有的引用被 drop。

## 完整示例

```rust
use std::sync::Arc;
use std::time::Duration;
use behest::runtime::extension::ExtensionPoint;
use behest::runtime::replace::DEFAULT_DRAIN_TIMEOUT;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 一个存放不透明 "metrics sink" trait object 的 extension point。
    let ep: ExtensionPoint<dyn Send + Sync> = ExtensionPoint::new();

    // 阶段 1：拉起 v1。
    let v1: Arc<dyn Send + Sync> = Arc::new("v1-metrics");
    ep.register("primary", v1.clone())?;

    // 阶段 2：一个长跑任务持着 v1 的引用。
    let inflight = ep.get("primary").unwrap();
    let task = tokio::spawn(async move {
        tokio::time::sleep(Duration::from_millis(100)).await;
        // 在任务结束前释放持有的 Arc
        drop(inflight);
    });

    // 阶段 3：热替换。drain 协议等待 in-flight 任务结束
    // 后才允许覆盖 storage 槽位。
    let ep_arc = Arc::new(ep);
    let v2: Arc<dyn Send + Sync> = Arc::new("v2-metrics");
    let token = ep_arc.begin_replace("primary", DEFAULT_DRAIN_TIMEOUT)?;
    ep_arc.complete_replace("primary", v2, token).await?;

    task.await?;
    println!("swap complete");
    Ok(())
}
```

## 边界情况与错误语义

- **注册竞争** —— 两个线程同时调用 `register("k", …)`：恰好一个成功，另一个拿到 `AlreadyRegistered`。不会死锁。
- **替换缺失** —— 对从未注册过的 name 调用 `replace` 返回 `NotFound`。`complete_replace` 也是如此：如果 name 在 `begin_replace` 与 `complete_replace` 之间被 unregister 了，返回 `NotFound`。
- **Token 复用** —— `complete_replace` 拒绝一个已经被 commit 的 `ReplaceToken`（第二次调用得到 `ReplaceError::AlreadyCommitted`）。Token 故意做成 `Clone`，便于传给 deadline 任务。
- **锁中毒** —— 如果在持有内部 `RwLock` 时发生 panic，后续调用返回 `LockPoisoned`。实际很少见，因为内部锁只在 hash-map 操作期间持有，但调用方仍应处理这个错误。
- **最后一个 `Arc<T>` 被 drop** —— 当 storage 槽位和最后一个外部 `Arc` 都被 drop 时自动发生。`ExtensionPoint<T>` 没有 `Drop` impl；只要还有任何克隆存在，内部 `Arc<ExtensionInner<T>>` 就让 map 保持存活。
- **Trait object** —— `T: ?Sized` 约束允许 `ExtensionPoint<dyn ChatProvider>`。对于 sized 类型，常见用法也都支持。`Default` impl 产生一个空的 extension point。

## 与其它组件的关系

`ExtensionPoint<T>` 是**存储原语**。其它核心抽象都构建在它之上：

- **[`Extensions`](extensions-facade.md)** 是一个包含 13 个 `ExtensionPoint` 字段的结构，每个字段对应一种可插拔类别。运行时中所有 public API 都从它读取。
- **[`Component`](component-trait.md)** 是与 `ComponentRegistry` 内部 `ExtensionPoint<Box<dyn AnyComponent>>` 配对的生命周期合约。
- **[`FactoryRegistry`](factory-registry.md)** 内部使用 `ExtensionPoint` 把 `kind` 字符串映射到 factory 函数。
- 完整的 drain 协议详见 **[Drain-aware Replace](drain-aware-replace.md)**。

## 另见

- **[Extensions Facade](extensions-facade.md)** —— 13 字段的 `ExtensionPoint` 集合。
- **[Drain-aware Replace](drain-aware-replace.md)** —— 两阶段替换协议。
- **[Component Trait](component-trait.md)** —— 插件的生命周期合约。
- **[ComponentRegistry](component-registry.md)** —— 编排器。
- **[FactoryRegistry](factory-registry.md)** —— `kind` → factory 映射。
