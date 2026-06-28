---
title: Deployment
description: 部署 behest：容器、VM、sidecar、library。
group: ops
order: 3
summary: 部署 behest：容器、VM、sidecar、library。
related: []
---

# Deployment

> 部署模型。

## Library

```rust
let runtime = AgentConfig::builder().with_file("behest.toml")?.build_runtime().await?;
```

## gRPC server

```bash
cargo run --bin agent-server --features server -- --config behest.toml
```

## 资源需求

内存 ~20 MB baseline。模型调用 I/O-bound。Tool 执行 CPU-bound 但通常短暂。

## 另见

- **[Performance](performance.md)** —— 吞吐与延迟。

