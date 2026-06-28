---
title: gRPC Transport
description: GrpcTransport 组件、TransportHub 编排和 protobuf 服务层。
group: config
order: 6
summary: GrpcTransport 组件包装 tonic server，TransportHub 支持 serve_all。
related:
  - config/agent-config
  - intro/feature-flags
  - ops/managed-runtime
  - ops/health-aggregation
---

# gRPC Transport

> 可选的 gRPC 服务器和传输层。

Feature `server`。提供 `agent-server` 二进制文件、`GrpcTransport` 组件和 gRPC 传输层。服务器将运行时暴露为 gRPC 服务，允许非 Rust 客户端提交 run 和订阅事件。

## `GrpcTransport`

`GrpcTransport` 是包装 tonic gRPC 服务器的 `Transport` 实现。它接受完全配置的 tonic `Router`（包含所有服务和拦截器），并在 shutdown token 触发前持续服务。

```rust
use behest::transport::GrpcTransport;

let health = tonic_health::server::health_reporter();
let (_, health_svc) = health;
let router = tonic::transport::Server::builder()
    .add_service(my_admin_service)
    .add_service(my_agent_service)
    .add_service(health_svc);

let transport = GrpcTransport::new("0.0.0.0:50051", router)?;
```

### API

```rust
impl GrpcTransport {
    pub fn new(addr: impl AsRef<str>, router: Router)
        -> Result<Self, GrpcTransportError>;
    pub fn listen_addr(&self) -> SocketAddr;
}

// Transport trait 实现
impl Transport for GrpcTransport {
    const NAME: &'static str = "transport.grpc";
    type Config = GrpcTransportConfig;
    type Error = GrpcTransportError;

    async fn serve(&self, shutdown: ShutdownToken) -> Result<(), Self::Error>;
    async fn health(&self) -> HealthStatus;
    fn addr(&self) -> Option<String>;
}
```

Router 在首次调用 `serve` 时被消费；后续调用返回 `GrpcTransportError::AlreadyServed`。

## `TransportHub`

`TransportHub` 管理多个 transport 实现（gRPC、未来的 HTTP/WebSocket）。它是传输层的 `Extensions` 等价物：

```rust
pub struct TransportHub { /* ... */ }

impl TransportHub {
    pub fn new() -> Self;

    // 注册
    pub fn add<T: Transport + 'static>(
        &self, name: impl Into<String>, transport: Arc<T>,
    ) -> Result<(), TransportError>;

    // 类型化查找
    pub fn get_typed<T: Transport + 'static>(
        &self, name: &str,
    ) -> Result<Arc<T>, TransportError>;

    // 生命周期
    pub async fn start_all(&self, shutdown: ShutdownToken)
        -> Result<(), TransportError>;
    pub async fn serve_all(&self, shutdown: ShutdownToken)
        -> Result<(), TransportError>;

    // 健康检查
    pub async fn health(&self) -> HashMap<String, HealthStatus>;

    // 检查
    pub fn len(&self) -> usize;
    pub fn is_empty(&self) -> bool;
    pub fn names(&self) -> Vec<String>;
}
```

### `start_all` vs `serve_all`

- **`start_all`** 启动每个 transport 并立即返回。Transport 在后台运行直到 shutdown token 触发。适用于启动 transport 后还需要做其他工作的场景。

- **`serve_all`** 启动每个 transport 并**等待所有 transport 完成**。返回遇到的第一个错误。适用于在 `main()` 中阻塞直到所有 transport 关闭。

```rust
// 非阻塞：启动并继续
hub.start_all(shutdown.clone()).await?;
// ... 做其他工作 ...

// 阻塞：启动并等待关闭
hub.serve_all(shutdown).await?;
// 所有 transport 在此处已停止
```

### 健康探测

`health()` 在所有已注册 transport 上并发运行探测：

```rust
let map = hub.health().await;
// { "grpc": Healthy, "websocket": Degraded, ... }
```

## 二进制

```bash
cargo run --bin agent-server --features server -- --config behest.toml
```

二进制加载 `AgentConfig`，构造运行时，注册所有 gRPC 服务，并通过 `GrpcTransport` 提供服务。

## 服务定义

gRPC 服务定义在 protobuf 中（`src/transport/grpc/proto/`）。主要服务：

- `AgentService` —— run 管理。
- `AdminService` —— 运行时状态、健康检查、就绪探测。
- `SessionService` —— 会话生命周期。
- `ChatService` —— 流式 chat completions。

## 使用场景

- 非 Rust 客户端（Python、TypeScript、Go）与运行时交互。
- 运行时作为独立服务的微服务架构。
- gRPC 原生的可观测性和负载均衡。

## 另见

- **[ManagedRuntime](../ops/managed-runtime.md)** —— 顶层编排器。
- **[健康聚合](../ops/health-aggregation.md)** —— transport 健康探测。
- **[AgentConfig](agent-config.md)** —— 配置。
- **[Feature Flags](../intro/feature-flags.md)** —— `server` feature。
