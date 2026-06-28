---
title: ManagedRuntime
description: 顶层编排器 —— AgentRuntime + ComponentRegistry + TransportHub + ShutdownToken 统一句柄。
group: ops
order: 1
summary: 统一容器，协调生命周期、类型化组件访问、聚合健康检查和热替换。
related:
  - ops/hot-reload
  - ops/health-aggregation
  - core/component-registry
  - core/extensions-facade
  - runtime/agent-runtime
  - config/grpc-transport
---

# `ManagedRuntime`

> 顶层编排器。

`ManagedRuntime` 将 `AgentRuntime`、`ComponentRegistry`、可选的 `TransportHub` 和根 `ShutdownToken` 统一为单个句柄。提供协调的生命周期（`init_all → start_all → serve → stop_all`）、类型化组件访问、聚合健康探测和 drain-aware 热替换入口。

完整文件：`src/runtime/managed.rs`。

## 构造

### 通过 `build_managed`

最简单的方式：

```rust
use behest::config::AgentConfigBuilder;

let managed = AgentConfigBuilder::default()
    .with_file("config.toml")?
    .build_managed()
    .await?;
```

`build_managed` 构造 `AgentRuntime`，通过 `FactoryRegistry` 注册配置中的所有 `[[component]]` 条目，运行 `init_all` + `start_all`，返回完整连线的 `ManagedRuntime`。

### 手动构造

```rust
use behest::runtime::ManagedRuntime;

let managed = ManagedRuntime::new(
    runtime,
    registry,
    hub,        // TransportHub（server feature）
    shutdown,   // ShutdownToken
);
```

## API

```rust
impl ManagedRuntime {
    // 访问器
    pub fn runtime(&self) -> &AgentRuntime;
    pub fn registry(&self) -> &ComponentRegistry;
    pub fn hub(&self) -> &TransportHub;          // server feature
    pub fn shutdown_token(&self) -> ShutdownToken;
    pub fn extensions(&self) -> Arc<Extensions>;

    // 类型化组件查找
    pub fn component<T: Component>(&self, name: &str)
        -> Result<Arc<T>, ManagedError>;

    // 生命周期
    pub async fn serve(&self) -> Result<(), ManagedError>;

    // 健康检查
    pub async fn health(&self) -> HashMap<String, HealthStatus>;
    pub async fn overall_health(&self) -> HealthStatus;
    pub async fn is_healthy(&self) -> bool;
    pub async fn is_ready(&self) -> bool;
    pub async fn healthz_json(&self) -> serde_json::Value;

    // 热替换
    pub async fn reload<T: Component>(
        &self, name: &str, new_instance: T,
    ) -> Result<Arc<T>, ManagedError>;
    pub async fn reload_raw(
        &self, name: &str, new_instance: Box<dyn AnyComponent>,
    ) -> Result<Arc<dyn AnyComponent>, ManagedError>;
}
```

## 生命周期

```text
   build_managed  →  init_all  →  start_all  →  serve  →  signal_shutdown  →  stop_all
```

`serve()` 启动所有已注册的 transport（`server` feature 启用时），然后等待根 shutdown token 触发。关闭时，transport 通过子 token 停止，组件按依赖逆序停止。

阻塞替代方案：使用 `TransportHub::serve_all` 等待所有 transport 完成。

## 健康聚合

`health()` 从每个已初始化组件和（`server` feature 启用时）每个已注册 transport 收集探测结果：

```rust
let map = managed.health().await;
// { "provider.openai": Healthy, "store.session": Degraded, ... }
```

`overall_health()` 通过最差情况语义聚合：

- **Healthy** — 所有组件健康。
- **Degraded** — 至少一个降级，无 unhealthy。
- **Unhealthy** — 至少一个 unhealthy。

`is_ready()` 在每个组件至少可操作（healthy 或 degraded）时返回 `true` —— 适用于负载均衡器就绪探测。

`healthz_json()` 构建 JSON 响应：

```json
{
  "status": "healthy",
  "components": {
    "provider.openai": { "status": "healthy", "detail": null },
    "store.session":   { "status": "healthy", "detail": null }
  }
}
```

详见 **[健康聚合](health-aggregation.md)**。

## 热替换

`reload::<T>` 执行 drain-aware 组件替换：

1. 在旧实例上调用 `pre_replace_hook`。
2. 启动新实例。如果失败，旧实例保持不变。
3. 原子交换注册表中的实例。
4. 在旧实例上调用 `post_replace_hook`（尽力而为）。
5. 返回旧 `Arc<T>`，调用者可等待显式 drain。

```rust
let old = managed.reload::<MyComponent>("my_comp", new_instance).await?;
// old 是之前的 Arc<T> —— drop 它以释放引用
```

详见 **[热替换](hot-reload.md)**。

## 错误

所有错误为 `ManagedError`：

| 变体 | 触发条件 |
|------|----------|
| `ComponentNotFound(name)` | 查找或替换目标未注册 |
| `Registry(RegistryError)` | 底层注册表故障 |
| `Reload { name, message }` | 热替换协议故障 |
| `Transport(TransportError)` | Transport 启动故障（server feature） |

## 另见

- **[热替换](hot-reload.md)** —— drain-aware 替换协议。
- **[健康聚合](health-aggregation.md)** —— 探测和就绪检查。
- **[ComponentRegistry](../core/component-registry.md)** —— 生命周期编排器。
- **[gRPC Transport](../config/grpc-transport.md)** —— 传输层。
