---
title: Health Aggregation
description: Worst-case health aggregation across components.
group: ops
order: 3
summary: Worst-case semantics for component health probes.
related:
  - ops/managed-runtime
  - ops/hot-reload
  - core/component-trait
---

# Health Aggregation

> A single health signal from many independent probes.

`ManagedRuntime` aggregates the health of every registered component into a single `HealthStatus`. The aggregation uses **worst-case semantics**: the least healthy component determines the overall status.

## Semantics

```text
   Unhealthy  >  Degraded  >  Healthy
```

| Condition | Result |
|-----------|--------|
| Any component is `Unhealthy` | **Unhealthy** |
| No unhealthy, but any is `Degraded` | **Degraded** |
| All components are `Healthy` (or registry is empty) | **Healthy** |

The reason string lists all non-healthy components so operators can quickly identify the culprits:

```text
unhealthy components: store.session.redis, provider.openai.chat
```

## API

```rust
impl ManagedRuntime {
    /// Aggregate all component health into a single
    /// HealthStatus using worst-case semantics.
    pub async fn overall_health(&self) -> HealthStatus;

    /// Returns true if every component is at least operational
    /// (healthy or degraded). Suitable for readiness probes.
    pub async fn is_ready(&self) -> bool;

    /// Build a JSON /healthz response body.
    pub async fn healthz_json(&self) -> serde_json::Value;

    /// Returns true if every component is healthy.
    pub async fn is_healthy(&self) -> bool;
}
```

### `overall_health` vs `is_ready`

- **`overall_health`** returns the full `HealthStatus` enum (`Healthy`, `Degraded`, `Unhealthy`). Use it for dashboards and alerting.
- **`is_ready`** returns `true` when every component is at least operational (`Healthy` or `Degraded`). Use it for load-balancer readiness probes where `Degraded` still means "can serve traffic."

## `/healthz` JSON format

`healthz_json` produces a response suitable for Kubernetes liveness/readiness probes:

```json
{
  "status": "degraded",
  "components": {
    "provider.openai.chat": {
      "status": "healthy",
      "reason": null
    },
    "store.session.redis": {
      "status": "degraded",
      "reason": "connection pool exhausted"
    },
    "store.embedding.memory": {
      "status": "healthy",
      "reason": null
    }
  }
}
```

The top-level `status` is the aggregated result. The `components` object contains per-component detail.

## Worked example

```rust
use behest::config::AgentConfigBuilder;

let managed = AgentConfigBuilder::default()
    .build_managed()
    .await?;

// Kubernetes readiness probe
if managed.is_ready().await {
    // 200 OK
} else {
    // 503 Service Unavailable
}

// Full health report
let report = managed.healthz_json().await;
println!("{}", serde_json::to_string_pretty(&report)?);
```

## See also

- **[ManagedRuntime](managed-runtime.md)** — the orchestrator that drives health aggregation.
- **[Component Trait](../core/component-trait.md)** — the `health()` probe contract.
