---
title: gRPC Transport
description: GrpcTransport component, TransportHub orchestration, and the protobuf service layer.
group: config
order: 6
summary: GrpcTransport component wrapping a tonic server, TransportHub with serve_all.
related:
  - config/agent-config
  - intro/feature-flags
  - ops/managed-runtime
  - ops/health-aggregation
---

# gRPC Transport

> Optional gRPC server and transport layer.

Feature `server`. Provides the `agent-server` binary, the `GrpcTransport` component, and the gRPC transport layer. The server exposes the runtime as a gRPC service, allowing non-Rust clients to submit runs and subscribe to events.

## `GrpcTransport`

`GrpcTransport` is a `Transport` implementation that wraps a tonic gRPC server. It accepts a fully configured tonic `Router` (containing all services and interceptors) and serves it until the shutdown token fires.

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

// Transport trait implementation
impl Transport for GrpcTransport {
    const NAME: &'static str = "transport.grpc";
    type Config = GrpcTransportConfig;
    type Error = GrpcTransportError;

    async fn serve(&self, shutdown: ShutdownToken) -> Result<(), Self::Error>;
    async fn health(&self) -> HealthStatus;
    fn addr(&self) -> Option<String>;
}
```

The router is consumed on the first call to `serve`; subsequent calls return `GrpcTransportError::AlreadyServed`.

## `TransportHub`

`TransportHub` manages multiple transport implementations (gRPC, future HTTP/WebSocket). It is the transport-layer equivalent of `Extensions`:

```rust
pub struct TransportHub { /* ... */ }

impl TransportHub {
    pub fn new() -> Self;

    // Registration
    pub fn add<T: Transport + 'static>(
        &self, name: impl Into<String>, transport: Arc<T>,
    ) -> Result<(), TransportError>;

    // Typed lookup
    pub fn get_typed<T: Transport + 'static>(
        &self, name: &str,
    ) -> Result<Arc<T>, TransportError>;

    // Lifecycle
    pub async fn start_all(&self, shutdown: ShutdownToken)
        -> Result<(), TransportError>;
    pub async fn serve_all(&self, shutdown: ShutdownToken)
        -> Result<(), TransportError>;

    // Health
    pub async fn health(&self) -> HashMap<String, HealthStatus>;

    // Inspection
    pub fn len(&self) -> usize;
    pub fn is_empty(&self) -> bool;
    pub fn names(&self) -> Vec<String>;
}
```

### `start_all` vs `serve_all`

- **`start_all`** spawns every transport and returns immediately. Transports run in the background until the shutdown token fires. Use this when you want to do other work after starting transports.

- **`serve_all`** spawns every transport and **waits for all of them to complete**. Returns the first error encountered. Use this in `main()` when you want to block until all transports have shut down.

```rust
// Non-blocking: start and continue
hub.start_all(shutdown.clone()).await?;
// ... do other work ...

// Blocking: start and wait for shutdown
hub.serve_all(shutdown).await?;
// All transports have stopped here
```

### Health probes

`health()` runs probes concurrently across all registered transports:

```rust
let map = hub.health().await;
// { "grpc": Healthy, "websocket": Degraded, ... }
```

## Binary

```bash
cargo run --bin agent-server --features server -- --config behest.toml
```

The binary loads `AgentConfig`, constructs a runtime, registers all gRPC services, and serves via `GrpcTransport`.

## Service definition

The gRPC services are defined in protobuf (`src/transport/grpc/proto/`). Key services:

- `AgentService` — run management.
- `AdminService` — runtime status, health checks, readiness probes.
- `SessionService` — session lifecycle.
- `ChatService` — streaming chat completions.

## When to use

- Non-Rust clients (Python, TypeScript, Go) interacting with the runtime.
- Microservice architectures where the runtime is a standalone service.
- gRPC-native observability and load balancing.

## See also

- **[ManagedRuntime](../ops/managed-runtime.md)** — the top-level orchestrator.
- **[Health Aggregation](../ops/health-aggregation.md)** — transport health probes.
- **[AgentConfig](agent-config.md)** — the configuration.
- **[Feature Flags](../intro/feature-flags.md)** — the `server` feature.
