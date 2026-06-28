---
title: Component Trait
description: 每个可插拔运行时元素的生命周期合约：init、start、stop、health。
group: core
order: 4
summary: 生命周期合约：init → start → serve → stop → health。
related:
  - core/component-registry
  - core/extension-point
  - core/factory-registry
  - core/component-wrappers
---

# `Component` Trait

> 每个可插拔运行时元素实现的生命周期合约。

每一种可插拔元素 —— chat provider、embedding provider、工具、上下文适配器、store、event publisher、snapshot store、RAG 适配器、传输层 —— 都要实现 `Component`。这个 trait 给运行时一个统一的形状：声明式配置、有序初始化、生命周期管理、健康聚合。

完整源码在 `src/runtime/component.rs`。

## 生命周期

```text
   register factory ──► init ──► start ──► [serve] ──► stop
                           │
                           └──► on init error: instance is dropped
```

- **`init`** 是唯一接受配置值的阶段。它必须是纯构造器：没有副作用、没有网络调用。`ctx` 参数提供一个 `ShutdownToken`，组件可以把它串入后台任务。
- **`start`** 打开连接、生成后台任务、注册到外部系统。必须**幂等**：对一个已启动的组件再次 `start` 应成功。
- **`stop`** 是 `start` 的逆操作。必须 drain in-flight 工作、关闭连接、持久化挂起状态。幂等。
- **`health`** 是非可变探针。必须廉价（亚毫秒），且在热路径中调用安全。

## 定义

```rust
use async_trait::async_trait;
use schemars::JsonSchema;
use serde::de::DeserializeOwned;
use std::error::Error as StdError;
use crate::health::HealthStatus;
use crate::runtime::lifecycle::ShutdownToken;

#[derive(Clone)]
pub struct ComponentContext {
    shutdown: ShutdownToken,
}

impl ComponentContext {
    pub fn new(shutdown: ShutdownToken) -> Self;
    pub fn shutdown(&self) -> ShutdownToken;
    pub fn child_shutdown(&self) -> ShutdownToken;
}

#[async_trait]
pub trait Component: Send + Sync + 'static {
    const NAME: &'static str;

    type Config: DeserializeOwned + JsonSchema + Send + Sync + 'static;
    type Error: StdError + Send + Sync + 'static;

    async fn init(
        cfg: &Self::Config,
        ctx: &ComponentContext,
    ) -> Result<Self, Self::Error>
    where Self: Sized;

    async fn start(&self) -> Result<(), Self::Error> { Ok(()) }
    async fn stop(&self)  -> Result<(), Self::Error> { Ok(()) }
    async fn health(&self) -> HealthStatus { HealthStatus::healthy() }

    fn depends_on() -> &'static [&'static str] { &[] }
}
```

### 为什么要 `ComponentContext`？

`ComponentContext` 携带 `ShutdownToken` 和一个名字。它被串入 `init`，让组件能为自己的后台任务构造子 shutdown token。子 token 在 drop 时**不**触发全局 shutdown —— 只有父 token 才会。这让单个组件的失败能被独立于整个运行时观察。

## 错误

每个阶段返回 `Result<_, Self::Error>`。关联错误类型必须实现 `std::error::Error`，这样 registry 才能统一地格式化：

```rust
#[derive(Debug, thiserror::Error)]
pub enum MyError {
    #[error("connection refused: {0}")]
    ConnectionRefused(String),
    #[error("timeout after {0:?}")]
    Timeout(Duration),
}
```

trait 故意**类型化**：实现使用最精确的错误类型（例如 HTTP provider 用 `reqwest::Error`），不需要 registry 建模每一种变体。

## 对象安全

`Component` **不**是对象安全的 —— 它有 `Self::Config` 和 `Self::Error` 关联类型，以及 `init` 上的 `Self: Sized` 约束。对象安全的视图是 `AnyComponent`：

```rust
pub trait AnyComponent: Send + Sync + 'static {
    fn name(&self) -> &'static str;
    fn as_any_arc(&self) -> Arc<dyn Any + Send + Sync>;
    fn start(&self) -> futures_util::future::BoxFuture<'_, Result<(), AnyComponentError>>;
    fn stop(&self)  -> futures_util::future::BoxFuture<'_, Result<(), AnyComponentError>>;
    fn health(&self) -> futures_util::future::BoxFuture<'_, HealthStatus>;
}
```

`ComponentRegistry` 存储 `Box<dyn AnyComponent>`。要拿回具体类型，通过 `as_any_arc` downcast。

## 热插拔

`Component` 提供两个可选钩子用于热替换协调：

```rust
#[async_trait]
pub trait Component: Send + Sync + 'static {
    // ... 标准生命周期方法 ...

    /// 在组件被新实例替换前调用。
    /// 默认 no-op。重写以拒绝新流量、刷新缓冲区或通知上游系统。
    async fn pre_replace_hook(&self) -> Result<(), Self::Error> {
        Ok(())
    }

    /// 在组件被新实例替换后调用。
    /// 默认 no-op。重写以清理资源或通知上游系统。
    async fn post_replace_hook(&self) -> Result<(), Self::Error> {
        Ok(())
    }
}
```

drain-aware 替换协议（`ManagedRuntime::reload`）在原子交换前后调用这些钩子：

1. 旧实例上的 `pre_replace_hook` —— 信号替换即将发生。
2. 构造并启动新实例。
3. `ComponentRegistry` 中的原子交换。
4. 旧实例上的 `post_replace_hook` —— 替换后清理。

想要支持热替换的组件必须：

1. 能被 `Arc<Self>` 持有。
2. 实现 `pre_replace_hook` / `post_replace_hook` 以进行优雅协调。
3. 容忍在仍被使用时**被 stop**（或通过 `Arc` 引用计数依赖自然 drain）。
4. 不持有跨 `stop` 存活的全局状态。

内置的 `OpenAiChatComponent`、`MemorySessionStoreComponent` 等都满足这些约束。

## 完整示例

```rust
use std::time::Duration;
use async_trait::async_trait;
use schemars::JsonSchema;
use serde::Deserialize;
use behest::health::HealthStatus;
use behest::runtime::component::{Component, ComponentContext};

#[derive(Debug, Deserialize, JsonSchema)]
struct EchoConfig {
    prefix: String,
}

struct EchoComponent {
    prefix: String,
}

#[async_trait]
impl Component for EchoComponent {
    const NAME: &'static str = "demo.echo";
    type Config = EchoConfig;
    type Error = std::io::Error;

    async fn init(cfg: &Self::Config, _ctx: &ComponentContext) -> Result<Self, Self::Error> {
        Ok(Self { prefix: cfg.prefix.clone() })
    }

    async fn start(&self) -> Result<(), Self::Error> {
        // 打开连接、生成任务等。
        Ok(())
    }

    async fn health(&self) -> HealthStatus {
        HealthStatus::healthy()
    }
}
```

## 边界情况

- **`init` 失败** —— registry drop 掉该实例。状态机进入 `Failed`，通过 `health()` 上报。后续 `init_all` 可重试。
- **`stop` 之后 `start`** —— 必须成功（幂等）。这让热替换成为可能：stop 旧实例、start 新实例，无需重启。
- **`health` panic** —— 被 registry 捕获；以聚合降级 `HealthStatus::degraded("health probe panicked")` 上报。
- **`start` 是异步** —— registry 按依赖顺序依次 await 每个组件。如果一个组件的 start 耗时很长，下游组件会等待。

## 与其它组件的关系

- **[ComponentRegistry](component-registry.md)** —— 驱动生命周期的编排器。
- **[FactoryRegistry](factory-registry.md)** —— 从 JSON 构造 `Component` 实例的 `kind` → `FactoryInvoker` 映射。
- **[ExtensionPoint](extension-point.md)** —— 组件按名注册的存储层。

## 另见

- **[ComponentRegistry](component-registry.md)** —— 生命周期编排器。
- **[FactoryRegistry](factory-registry.md)** —— `kind` → factory 映射。
- **[Component Wrappers](component-wrappers.md)** —— 内置的 `Component` 实现。
