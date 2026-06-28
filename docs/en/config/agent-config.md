---
title: AgentConfig
description: " \"`AgentConfig` + builder: the user-facing configuration surface with layered sources.\""
group: config
order: 1
summary: " `AgentConfig` + builder: the user-facing configuration surface."
related:
  - config/layered-config
  - intro/quick-start
  - core/extensions-facade
---

# `AgentConfig`

> The user-facing configuration surface.

`AgentConfig` is the entry point for configuring a runtime from TOML, environment variables, or programmatic builders. It produces either an `AgentRuntime` (via `into_runtime`) or an `Extensions` facade (via `into_extensions`).

The full file is `src/config/mod.rs`.

## Builder

```rust
pub struct AgentConfigBuilder {
    config: AgentConfig,
}

impl AgentConfigBuilder {
    pub fn new() -> Self;
    pub fn with_file(self, path: &str) -> Result<Self, Error>;
    pub fn with_env(self, prefix: &str) -> Result<Self, Error>;
    pub fn with_runtime(self, config: RuntimeConfig) -> Self;
    pub fn with_provider(self, id: &str, config: ProviderConfig) -> Self;
    pub fn with_store(self, id: &str, config: StoreConfig) -> Self;
    pub fn build(self) -> Result<AgentConfig, Error>;
    pub async fn build_runtime(self) -> Result<AgentRuntime>;
}
```

## Layered sources

The builder merges configuration from three sources in order:

1. **Defaults** — reasonable values for all fields.
2. **File** — TOML file loaded via `with_file`.
3. **Environment** — env vars loaded via `with_env`.

Later sources override earlier ones. See **[Layered Config](layered-config.md)** for the exact merging rules.

## Quick start

```rust
use behest::config::AgentConfig;

let runtime = AgentConfig::builder()
    .with_file("behest.toml")?
    .with_env("BEHEST")?
    .build_runtime()
    .await?;
```

## `into_extensions`

`build_runtime` calls `into_extensions` internally:

```rust
let exts = config.into_extensions().await?;  // Async; opens connections
let runtime = AgentRuntime::new(Arc::new(exts), policy);
```

`into_extensions` walks the loaded config, calls `FactoryRegistry::invoke` for each `[[components]]` entry, runs `init` and `start`, and registers the resulting instances in an `Extensions` facade.

## See also

- **[Layered Config](layered-config.md)** — the merging logic.
- **[Quick Start](../intro/quick-start.md)** — the simplest path.
- **[Extensions Facade](../core/extensions-facade.md)** — the output.
