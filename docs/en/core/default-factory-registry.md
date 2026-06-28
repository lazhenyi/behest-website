---
title: Default Factory Registry
description: " The built-in `FactoryRegistry` populated with every adapter, store, and adapter the runtime ships with."
group: core
order: 7
summary: " The built-in factory invoker set: OpenAI, Anthropic, memory stores, context."
related:
  - core/factory-registry
  - core/component-wrappers
  - core/component-registry
  - config/agent-config
---

# `default_factory_registry()`

> The built-in set of `FactoryInvoker`s, ready to use.

`default_factory_registry()` returns a `FactoryRegistry` pre-loaded with every `Component` implementation that ships in the box. It is the entry point for `AgentConfig::into_extensions`: the config loads, the registry is consulted for each `[[components]]` entry, and the corresponding `Component` is constructed.

The full file is `src/runtime/components.rs`; the convenience entry point is `default_factory_registry`.

## What it registers

| `kind` | Component | Required feature |
|---|---|---|
| `provider.openai.chat` | `OpenAiChatComponent` | `openai` |
| `provider.openai.embedding` | `OpenAiEmbeddingComponent` | `openai` |
| `provider.anthropic.chat` | `AnthropicChatComponent` | `anthropic` |
| `store.session.memory` | `MemorySessionStoreComponent` | (default) |
| `store.execution.memory` | `MemoryExecutionStoreComponent` | (default) |
| `store.run.memory` | `MemoryRunStoreComponent` | (default) |
| `store.embedding.memory` | `MemoryEmbeddingStoreComponent` | (default) |
| `store.artifact.memory` | `MemoryArtifactStoreComponent` | (default) |
| `context.pipeline` | `ContextPipelineComponent` | (default) |

Additional factories are added by feature flag:

| `kind` | Component | Feature |
|---|---|---|
| `provider.anthropic.chat` | `AnthropicChatComponent` | `anthropic` |
| `store.session.redis` | `RedisSessionStoreComponent` | `redis` |
| `store.session.postgres` | `PostgresSessionStoreComponent` | `sqlx-postgres` |
| `store.session.mongodb` | `MongoSessionStoreComponent` | `mongodb` |
| `store.session.surrealdb` | `SurrealSessionStoreComponent` | `surrealdb` |
| `store.embedding.qdrant` | `QdrantEmbeddingStoreComponent` | `qdrant` |
| `event_store.redis` | `RedisRuntimeEventStoreComponent` | `redis` |
| `stream_adapter.redis` | `RedisRuntimeStreamAdapterComponent` | `redis` |
| `stream_adapter.nats_jetstream` | `NatsJetStreamStreamAdapterComponent` | `nats` |
| `event_publisher.nats` | `NatsEventPublisherComponent` | `nats` + `queue` |
| `event_publisher.redis_streams` | `RedisStreamsPublisherComponent` | `redis` + `queue` |

The exact set of registered kinds is determined at compile time. Calling `kinds()` on the registry returns the active set.

## How to extend

The default registry is built via:

```rust
pub fn default_factory_registry() -> FactoryRegistry {
    let reg = FactoryRegistry::new();
    let reg = register_providers(reg);
    let reg = register_memory_stores(reg);
    register_context_pipeline(reg)
}
```

Each `register_*` function takes a `FactoryRegistry` and returns the augmented one:

```rust
pub fn register_providers(reg: FactoryRegistry) -> FactoryRegistry;
pub fn register_memory_stores(reg: FactoryRegistry) -> FactoryRegistry;
pub fn register_context_pipeline(reg: FactoryRegistry) -> FactoryRegistry;
```

To add a custom factory, call `register` on the result:

```rust
let mut reg = default_factory_registry();
reg = reg.register("mycompany.internal-chat", my_invoke);
```

For feature-gated backends, `register_*` functions are added at compile time, so the augmentation depends on the feature set.

## Worked example

```rust
use behest::runtime::factory_registry::FactoryRegistry;
use behest::runtime::default_factory_registry;
use serde_json::json;

let reg: FactoryRegistry = default_factory_registry();
for kind in reg.kinds() {
    println!("{kind}");
}
// default features, no `openai` or `anthropic`:
//   store.session.memory
//   store.execution.memory
//   store.run.memory
//   store.embedding.memory
//   store.artifact.memory
//   context.pipeline
```

## Edge cases

- **Feature off** — a `kind` registered by a feature is simply absent; `invoke` returns `FactoryError::UnknownKind`. The factory is not "disabled" — it is not compiled in.
- **Custom registration replaces default** — if you call `reg.register("store.session.memory", my_invoke)`, your `my_invoke` shadows the default. There is no "extend" semantics; if you want both, register yours under a different `kind` and pick the one you want in the config.
- **Order does not matter** — `register` returns `self`; the resulting registry is identical regardless of the order in which kinds were registered.

## Relationship to other components

- **[FactoryRegistry](factory-registry.md)** — the type this builds.
- **[Component Wrappers](component-wrappers.md)** — the `Component` implementations registered.
- **[AgentConfig](../../config/agent-config)** — the consumer that calls `default_factory_registry()` to populate the runtime from TOML.

## See also

- **[FactoryRegistry](factory-registry.md)** — the registry type.
- **[Component Wrappers](component-wrappers.md)** — the individual `Component` types.
- **[AgentConfig](../../config/agent-config)** — the config loader that uses this.
