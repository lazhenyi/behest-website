---
title: Component Trait
description: " \"The lifecycle contract for every pluggable runtime element: init, start, stop, health.\""
group: core
order: 4
summary: " The lifecycle contract: init → start → serve → stop → health."
related:
  - core/component-registry
  - core/extension-point
  - core/factory-registry
  - core/component-wrappers
---

# `Component` Trait

> The lifecycle contract every pluggable runtime element implements.

Every pluggable element — chat providers, embedding providers, tools, context adapters, stores, event publishers, snapshot stores, RAG adapters, and the transport layer — implements `Component`. The trait gives the runtime a uniform shape for declarative configuration, ordered initialization, lifecycle management, and health aggregation.

The full file is `src/runtime/component.rs`.

## Lifecycle

```text
   register factory ──► init ──► start ──► [serve] ──► stop
                           │
                           └──► on init error: instance is dropped
```

- **`init`** is the only phase that takes a configuration value. It must be a pure constructor: no side effects, no network calls. The `ctx` parameter provides a `ShutdownToken` that the component can plumb into background tasks.
- **`start`** opens connections, spawns background tasks, and registers with external systems. It must be **idempotent**: re-starting a component that is already started should succeed.
- **`stop`** is the inverse of `start`. It must drain in-flight work, close connections, and persist pending state. Idempotent.
- **`health`** is a non-mutating probe. It must be cheap (sub-millisecond) and safe to call from a hot path.

## Definition

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

### Why a `ComponentContext`?

The `ComponentContext` carries the `ShutdownToken` and a name. It is plumbed into `init` so that components can construct child shutdown tokens for their own background tasks. A child token does not trigger global shutdown on drop — only the parent does. This is how a single component's failure can be observed independently from the whole runtime.

## Errors

Every phase returns `Result<_, Self::Error>`. The associated error type must implement `std::error::Error` so the registry can format it uniformly:

```rust
#[derive(Debug, thiserror::Error)]
pub enum MyError {
    #[error("connection refused: {0}")]
    ConnectionRefused(String),
    #[error("timeout after {0:?}")]
    Timeout(Duration),
}
```

The trait is **deliberately typed**: implementations use the most precise error type (e.g. `reqwest::Error` for HTTP providers) without forcing the registry to model every variant.

## Object safety

`Component` is **not** object-safe — it has `Self::Config` and `Self::Error` associated types and a `Self: Sized` bound on `init`. The object-safe view is `AnyComponent`:

```rust
pub trait AnyComponent: Send + Sync + 'static {
    fn name(&self) -> &'static str;
    fn as_any_arc(&self) -> Arc<dyn Any + Send + Sync>;
    fn start(&self) -> futures_util::future::BoxFuture<'_, Result<(), AnyComponentError>>;
    fn stop(&self)  -> futures_util::future::BoxFuture<'_, Result<(), AnyComponentError>>;
    fn health(&self) -> futures_util::future::BoxFuture<'_, HealthStatus>;
}
```

The `ComponentRegistry` stores `Box<dyn AnyComponent>`. To recover the concrete type, downcast via `as_any_arc`.

## Hot-plugging

`Component` provides two optional hooks for hot-swap coordination:

```rust
#[async_trait]
pub trait Component: Send + Sync + 'static {
    // ... standard lifecycle methods ...

    /// Called before this component is replaced by a new instance.
    /// Default is a no-op. Override to reject new traffic, flush
    /// buffers, or signal upstream systems.
    async fn pre_replace_hook(&self) -> Result<(), Self::Error> {
        Ok(())
    }

    /// Called after this component has been replaced by a new instance.
    /// Default is a no-op. Override to clean up resources or notify
    /// upstream systems.
    async fn post_replace_hook(&self) -> Result<(), Self::Error> {
        Ok(())
    }
}
```

The drain-aware replace protocol (`ManagedRuntime::reload`) calls these hooks around the atomic swap:

1. `pre_replace_hook` on the old instance — signal that replacement is imminent.
2. New instance is constructed and started.
3. Atomic swap in the `ComponentRegistry`.
4. `post_replace_hook` on the old instance — cleanup after replacement.

A component that wants hot-swap support must:

1. Be storable behind an `Arc<Self>`.
2. Implement `pre_replace_hook` / `post_replace_hook` for graceful coordination.
3. Tolerate being **stopped** while still in use (or rely on natural drain via `Arc` reference counting).
4. Not hold global state that survives `stop`.

The built-in `OpenAiChatComponent`, `MemorySessionStoreComponent`, etc. all satisfy these constraints.

## Worked example

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
        // Open a connection, spawn a task, etc.
        Ok(())
    }

    async fn health(&self) -> HealthStatus {
        HealthStatus::healthy()
    }
}
```

## Edge cases

- **`init` failure** — the registry drops the instance. The state machine moves to `Failed` and is reported via `health()`. A subsequent `init_all` may retry.
- **`start` after `stop`** — must succeed (idempotent). This is what makes hot-swap possible: you stop the old instance and start the new one without restarts.
- **`health` panics** — caught by the registry; reported as a degraded aggregate `HealthStatus::degraded("health probe panicked")`.
- **`start` is async** — the registry awaits each component sequentially in dependency order. If a component's start takes a long time, downstream components wait.

## Relationship to other components

- **[ComponentRegistry](component-registry.md)** — the orchestrator that drives the lifecycle.
- **[FactoryRegistry](factory-registry.md)** — the `kind` → `FactoryInvoker` mapping that constructs `Component` instances from JSON.
- **[ExtensionPoint](extension-point.md)** — the storage layer where components are registered by name.

## See also

- **[ComponentRegistry](component-registry.md)** — the lifecycle orchestrator.
- **[FactoryRegistry](factory-registry.md)** — `kind` → factory mapping.
- **[Component Wrappers](component-wrappers.md)** — the built-in `Component` implementations.
- **[HealthStatus](../../health)** — the health-probe result type.
