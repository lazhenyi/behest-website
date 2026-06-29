---
title: ManagedRuntime
description: The top-level orchestrator — AgentRuntime + ComponentRegistry + ShutdownToken in a single handle.
group: ops
order: 1
summary: Unified container with coordinated lifecycle, typed component access, aggregated health, and hot-reload.
related:
  - ops/hot-reload
  - ops/health-aggregation
  - core/component-registry
  - core/extensions-facade
  - runtime/agent-runtime
---

# `ManagedRuntime`

> The top-level orchestrator.

`ManagedRuntime` unifies `AgentRuntime`, `ComponentRegistry`, and a root `ShutdownToken` into a single handle. It provides coordinated lifecycle (`init_all → start_all → serve → stop_all`), typed component access, aggregated health probes, and a drain-aware hot-reload entry point.

The full file is `src/runtime/managed.rs`.

## Construction

### Via `build_managed`

The simplest path:

```rust
use behest::config::AgentConfigBuilder;

let managed = AgentConfigBuilder::default()
    .with_file("config.toml")?
    .build_managed()
    .await?;
```

`build_managed` constructs the `AgentRuntime`, registers all `[[component]]` entries from the configuration via the `FactoryRegistry`, runs `init_all` + `start_all`, and returns a fully wired `ManagedRuntime`.

### Manual construction

```rust
use behest::runtime::ManagedRuntime;

let managed = ManagedRuntime::new(
    runtime,
    registry,
    shutdown,   // ShutdownToken
);
```

## API

```rust
impl ManagedRuntime {
    // Accessors
    pub fn runtime(&self) -> &AgentRuntime;
    pub fn registry(&self) -> &ComponentRegistry;
    pub fn shutdown_token(&self) -> ShutdownToken;
    pub fn extensions(&self) -> Arc<Extensions>;

    // Typed component lookup
    pub fn component<T: Component>(&self, name: &str)
        -> Result<Arc<T>, ManagedError>;

    // Lifecycle
    pub async fn serve(&self) -> Result<(), ManagedError>;

    // Health
    pub async fn health(&self) -> HashMap<String, HealthStatus>;
    pub async fn overall_health(&self) -> HealthStatus;
    pub async fn is_healthy(&self) -> bool;
    pub async fn is_ready(&self) -> bool;
    pub async fn healthz_json(&self) -> serde_json::Value;

    // Hot-reload
    pub async fn reload<T: Component>(
        &self, name: &str, new_instance: T,
    ) -> Result<Arc<T>, ManagedError>;
    pub async fn reload_raw(
        &self, name: &str, new_instance: Box<dyn AnyComponent>,
    ) -> Result<Arc<dyn AnyComponent>, ManagedError>;
}
```

## Lifecycle

```text
   build_managed  →  init_all  →  start_all  →  serve  →  signal_shutdown  →  stop_all
```

`serve()` waits for the root shutdown token to fire. On shutdown, components stop in reverse dependency order.

## Health aggregation

`health()` collects probes from every initialized component:

```rust
let map = managed.health().await;
// { "provider.openai": Healthy, "store.session": Degraded, ... }
```

`overall_health()` aggregates via worst-case semantics:

- **Healthy** — all components are healthy.
- **Degraded** — at least one is degraded, none unhealthy.
- **Unhealthy** — at least one is unhealthy.

`is_ready()` returns `true` if every component is at least operational (healthy or degraded) — suitable for load-balancer readiness probes.

`healthz_json()` builds a JSON response:

```json
{
  "status": "healthy",
  "components": {
    "provider.openai": { "status": "healthy", "detail": null },
    "store.session":   { "status": "healthy", "detail": null }
  }
}
```

See **[Health Aggregation](health-aggregation.md)** for the full protocol.

## Hot-reload

`reload::<T>` performs a drain-aware component replacement:

1. Calls `pre_replace_hook` on the old instance.
2. Starts the new instance. If this fails, the old instance remains in place.
3. Atomically swaps the instance in the registry.
4. Calls `post_replace_hook` on the old instance (best-effort).
5. Returns the old `Arc<T>` so the caller can await explicit drain.

```rust
let old = managed.reload::<MyComponent>("my_comp", new_instance).await?;
// old is the previous Arc<T> — drop it to release the reference
```

See **[Hot Reload](hot-reload.md)** for the full protocol.

## Errors

All errors are `ManagedError`:

| Variant | When |
|---------|------|
| `ComponentNotFound(name)` | Lookup or reload target not registered |
| `Registry(RegistryError)` | Underlying registry failure |
| `Reload { name, message }` | Hot-swap protocol failure |

## See also

- **[Hot Reload](hot-reload.md)** — the drain-aware replace protocol.
- **[Health Aggregation](health-aggregation.md)** — probes and readiness.
- **[ComponentRegistry](../core/component-registry.md)** — the lifecycle orchestrator.
