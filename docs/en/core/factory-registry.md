---
title: FactoryRegistry
description: " Maps `kind` strings to factory invokers that construct `Component` instances from JSON config."
group: core
order: 6
summary: " `kind` string → JSON config → `Box<dyn AnyComponent>`."
related:
  - core/component-trait
  - core/default-factory-registry
  - core/component-registry
  - core/extension-point
---

# `FactoryRegistry`

> `kind` string → `Component` instance.

`FactoryRegistry` is the **config-to-instance** mapper. Given a string like `"provider.openai.chat"` and a JSON config, it returns a `Box<dyn AnyComponent>` that can be registered into a `ComponentRegistry`. The default registry includes all built-in providers, stores, and adapters.

The full file is `src/runtime/factory_registry.rs`.

## Why a registry of factories

Without a factory registry, every place that wanted to construct a `Component` from config would have to know about every concrete type:

```rust
match kind {
    "provider.openai.chat" => Box::new(OpenAiChatComponent::init(&cfg, &ctx)?),
    "provider.anthropic.chat" => Box::new(AnthropicChatComponent::init(&cfg, &ctx)?),
    "store.session.memory" => Box::new(MemorySessionStoreComponent::init(&cfg, &ctx)?),
    // ... 30 more arms ...
}
```

`FactoryRegistry` centralises this mapping. New components register their factory once; the rest of the runtime just calls `registry.invoke(kind, cfg, &ctx)`.

## `FactoryInvoker` trait

```rust
pub trait FactoryInvoker: Send + Sync {
    fn invoke(
        &self,
        config: Value,
        ctx: ComponentContext,
    ) -> Result<Box<dyn AnyComponent>, FactoryError>;
}

impl<F> FactoryInvoker for F
where
    F: Fn(Value, ComponentContext) -> Result<Box<dyn AnyComponent>, FactoryError>
        + Send + Sync + 'static,
{ /* blanket impl */ }
```

The blanket impl means closures work directly. Most registrations look like:

```rust
registry.register("provider.openai.chat", |cfg, ctx| {
    let cfg: ProviderHttpComponentConfig = serde_json::from_value(cfg)?;
    let component = OpenAiChatComponent::init(&cfg, &ctx)
        .map_err(|e| FactoryError::FactoryFailed("provider.openai.chat".into(), e.to_string()))?;
    Ok(Box::new(TypedAnyComponent::new(component)))
});
```

## API

```rust
pub struct FactoryRegistry {
    by_kind: HashMap<&'static str, Arc<dyn FactoryInvoker>>,
}

impl FactoryRegistry {
    pub fn new() -> Self;
    pub fn register(self, kind: &'static str, invoker: impl FactoryInvoker + 'static) -> Self;
    pub fn contains(&self, kind: &str) -> bool;
    pub fn kinds(&self) -> impl Iterator<Item = &'static str>;
    pub fn invoke(
        &self,
        kind: &str,
        cfg: Value,
        ctx: &ComponentContext,
    ) -> Result<Box<dyn AnyComponent>, FactoryError>;
}
```

### Errors

```rust
pub enum FactoryError {
    UnknownKind(String),
    InvalidConfig { kind: String, source: serde_json::Error },
    FactoryFailed(String, String),
}
```

## Worked example

```rust
use serde_json::json;
use behest::runtime::factory_registry::FactoryRegistry;
use behest::runtime::default_factory_registry;
use behest::runtime::component::ComponentContext;
use behest::runtime::lifecycle::ShutdownToken;

let registry = default_factory_registry();
let ctx = ComponentContext::new(ShutdownToken::new());

let cfg = json!({
    "id": "openai-primary",
    "base_url": "https://api.openai.com/v1",
    "api_key": "sk-…",
});

let component = registry.invoke("provider.openai.chat", cfg, &ctx)?;
assert_eq!(component.name(), "provider.openai.chat");
```

## Edge cases

- **Unknown kind** — `invoke("nonexistent", …)` returns `FactoryError::UnknownKind("nonexistent")`. The message includes the offending kind for diagnostics.
- **Invalid JSON** — deserialization errors are surfaced as `FactoryError::InvalidConfig { kind, source }`. The `source` is the original `serde_json::Error`.
- **Factory failure** — construction failures (e.g. a config value that compiles to a struct but fails runtime validation) become `FactoryError::FactoryFailed(kind, message)`.
- **Registration is append-only** — `register` is a builder method: it returns `self` to allow chaining. The same kind cannot be registered twice; the second call replaces the first.
- **Config schema** — the `Config` associated type on each `Component` impl is `JsonSchema + DeserializeOwned`, so the registry can emit a JSON Schema for IDE / CLI tools. Validation of incoming JSON happens at the serde boundary; the rest of the error path is the component's own error type.

## Relationship to other components

- **[Component](component-trait.md)** — every factory invokes `Component::init` to produce a typed instance.
- **[Default Factory Registry](default-factory-registry.md)** — the built-in set of factories.
- **[ComponentRegistry](component-registry.md)** — the consumer; it looks up the factory for each name and constructs the instance.

## See also

- **[Default Factory Registry](default-factory-registry.md)** — what's pre-registered.
- **[Component](component-trait.md)** — the trait factories produce.
- **[ComponentRegistry](component-registry.md)** — the orchestrator.
