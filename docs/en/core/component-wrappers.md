---
title: Component Wrappers
description: The built-in `Component` implementations that bridge providers, stores, and adapters to the lifecycle contract.
group: core
order: 8
summary: Component-shaped wrappers for each provider and store.
related:
  - core/component-trait
  - core/default-factory-registry
  - core/factory-registry
  - providers/chat-provider
---

# Component Wrappers

> The built-in `Component` implementations.

Every concrete provider, store, and adapter in the runtime has a `Component`-shaped wrapper that lets it participate in the lifecycle (`init → start → [serve] → stop → health`) and be constructed from JSON config. The wrappers live in `src/runtime/components.rs`.

## Provider wrappers

| Wrapper | Underlying | `Config` |
|---|---|---|
| `OpenAiChatComponent` | `OpenAiChatAdapter` | `ProviderHttpComponentConfig` |
| `AnthropicChatComponent` | `AnthropicChatAdapter` | `ProviderHttpComponentConfig` |
| `OpenAiEmbeddingComponent` | `OpenAiEmbeddingAdapter` | `ProviderHttpComponentConfig` |

All three use the same `ProviderHttpComponentConfig` (id, base_url, optional api_key, organization, timeouts, max_retries) because they share the same HTTP+secrets machinery. The `init` step deserialises the config, wraps the `api_key` in `SecretString`, and constructs the underlying adapter.

## Memory store wrappers

| Wrapper | Underlying | `Config` |
|---|---|---|
| `MemorySessionStoreComponent` | `MemorySessionStore` | `serde_json::Value` (ignored) |
| `MemoryExecutionStoreComponent` | `MemoryExecutionStore` | `serde_json::Value` (ignored) |
| `MemoryRunStoreComponent` | `MemoryRunStore` | `serde_json::Value` (ignored) |
| `MemoryEmbeddingStoreComponent` | `MemoryEmbeddingStore` | `serde_json::Value` (ignored) |
| `MemoryArtifactStoreComponent` | `MemoryArtifactStore` | `serde_json::Value` (ignored) |

The memory stores take no configuration; the wrapper still requires a `Config` type for trait conformance, so the placeholder is `serde_json::Value`. JSON like `{}` works fine.

## Context wrapper

| Wrapper | Underlying | `Config` |
|---|---|---|
| `ContextPipelineComponent` | `ContextPipeline` | `ContextPipelineConfig` |

`ContextPipelineConfig` carries `max_history_messages`, `max_history_tokens`, and `enable_compaction_filter`. The wrapper applies them on `init` via builder methods.

## The error type

All wrappers share a single error type, `ComponentError`, that wraps the underlying error categories:

```rust
#[derive(Debug, thiserror::Error)]
pub enum ComponentError {
    #[error("provider error: {0}")]
    Provider(String),
    #[error("store error: {0}")]
    Store(String),
    #[error("context error: {0}")]
    Context(String),
}

impl From<ProviderError> for ComponentError { ... }
```

`From<ProviderError>` is the only non-trivial impl; it stringifies the provider error so it can flow through the registry. Callers who need the typed error can downcast via `as_any_arc` and recover the original error chain.

## `ProviderHttpComponentConfig`

The shared config type for HTTP-backed providers:

```rust
pub struct ProviderHttpComponentConfig {
    pub id: String,
    pub base_url: String,
    pub api_key: Option<String>,
    pub organization: Option<String>,
    pub timeout_secs: Option<u64>,
    pub connect_timeout_secs: Option<u64>,
    pub max_retries: Option<usize>,
}
```

It converts to `ProviderHttpConfig` via `into_provider_http_config()`, wrapping `api_key` in `SecretString` so it is not serialised or logged.

## Worked example

```rust
use serde_json::json;
use behest::runtime::factory_registry::FactoryRegistry;
use behest::runtime::default_factory_registry;
use behest::runtime::component::ComponentContext;
use behest::runtime::lifecycle::ShutdownToken;

let reg = default_factory_registry();
let ctx = ComponentContext::new(ShutdownToken::new());

// Construct an OpenAI chat provider.
let cfg = json!({
    "id": "openai-primary",
    "base_url": "https://api.openai.com/v1",
    "api_key": "sk-…",
    "timeout_secs": 60,
    "max_retries": 3,
});
let comp = reg.invoke("provider.openai.chat", cfg, &ctx)?;
comp.start().await?;
println!("{}", comp.health().await.summary());
comp.stop().await?;
```

## Edge cases

- **No-op `start` / `stop`** — for components whose underlying type doesn't need start/stop (e.g. the in-memory stores), the default trait methods return `Ok(())`. The wrapper does not override them.
- **Secret redaction** — `api_key` is never logged. `Debug` output for `ProviderHttpComponentConfig` deliberately omits the key. The conversion to `ProviderHttpConfig` wraps it in `SecretString`, which redacts on display.
- **Default timeouts** — `into_provider_http_config` falls back to `DEFAULT_TIMEOUT` (60s) and `DEFAULT_CONNECT_TIMEOUT` (10s) when `timeout_secs` / `connect_timeout_secs` are `None`.
- **Default retries** — `max_retries` defaults to 2.

## Relationship to other components

- **[Component](component-trait.md)** — the trait every wrapper implements.
- **[Default Factory Registry](default-factory-registry.md)** — the factory that invokes these wrappers.
- **[ChatProvider](../../providers/chat-provider)** — the underlying provider trait that the wrappers implement (indirectly, via the adapter).

## See also

- **[Component](component-trait.md)** — the trait.
- **[Default Factory Registry](default-factory-registry.md)** — the registry that exposes these.
- **[ChatProvider](../../providers/chat-provider)** — the provider port.
