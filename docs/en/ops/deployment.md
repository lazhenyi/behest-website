---
title: Deployment
description: " \"Deploying behest: container, VM, sidecar, library.\""
group: ops
order: 3
summary: " Deploying behest: container, VM, sidecar, library."
related:
  - ops/performance
  - intro/feature-flags
---

# Deployment

> Deployment models for `behest`.

`behest` is a library crate, not a standalone binary (unless you build `agent-server`). You can deploy it in several ways.

## Library

The most common model. Add `behest` to your `Cargo.toml`, construct an `AgentRuntime` in your application, and run it in-process:

```rust
let runtime = AgentConfig::builder()
    .with_file("behest.toml")?
    .build_runtime()
    .await?;
runtime.run(req).await?;
```

No network, no serialisation, no overhead. The runtime is just a Rust struct.

## gRPC server

Feature `server`. The `agent-server` binary exposes the runtime as a gRPC service:

```bash
cargo run --bin agent-server --features server -- --config behest.toml
```

Deploy as a container, a VM, or a Kubernetes pod. Non-Rust clients interact via gRPC.

## Sidecar

Run `agent-server` alongside your main application. The main app submits runs via gRPC; the sidecar handles model calls, tool execution, and persistence.

## Container

```dockerfile
FROM rust:1.85 AS builder
WORKDIR /app
COPY . .
RUN cargo build --release --bin agent-server --features server,full

FROM debian:bookworm-slim
COPY --from=builder /app/target/release/agent-server /usr/local/bin/
COPY behest.toml /etc/behest/
CMD ["agent-server", "--config", "/etc/behest/behest.toml"]
```

## Resource requirements

- **Memory**: ~20 MB baseline (runtime + default memory stores). Grows with session history and embedding vectors.
- **CPU**: Model calls are I/O-bound. Tool execution is CPU-bound but usually short.
- **Network**: Outbound to model providers (HTTPS) and optional stores (Redis, Postgres, etc.). Inbound only for gRPC.

## See also

- **[Performance](performance.md)** — throughput and latency.
- **[Feature Flags](../intro/feature-flags.md)** — the `server` and `full` features.
