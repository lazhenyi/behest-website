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

`behest` is a library crate, not a standalone binary. You can deploy it in several ways.

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

## Sidecar

Run the behest runtime in a sidecar process alongside your main application. The main app submits runs via the library API; the sidecar handles model calls, tool execution, and persistence.

## Resource requirements

- **Memory**: ~20 MB baseline (runtime + default memory stores). Grows with session history and embedding vectors.
- **CPU**: Model calls are I/O-bound. Tool execution is CPU-bound but usually short.
- **Network**: Outbound to model providers (HTTPS) and optional stores (Redis, Postgres, etc.).

## See also

- **[Performance](performance.md)** — throughput and latency.
- **[Feature Flags](../intro/feature-flags.md)** — the `full` feature and other flags.
