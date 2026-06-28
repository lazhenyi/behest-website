---
title: Migration Guides
description: Notes for migrating between major versions of behest.
group: ref
order: 3
summary: Notes for migrating between major versions.
related:
  - ref/api-reference
  - intro/overview
---

# Migration Guides

> Notes for migrating between major versions.

## 0.3 → 0.4

### `AgentRuntime::new` signature changed

`AgentRuntime::new` now takes `Arc<Extensions>` instead of individual owned components:

```rust
// 0.3
let runtime = AgentRuntime::new(providers, store, tools, context, policy);

// 0.4
let exts = Arc::new(Extensions::default());
exts.chat_providers.register("openai", Arc::new(openai))?;
let runtime = AgentRuntime::new(exts, policy);
```

### `ProviderRegistry` internals changed

`ProviderRegistry` now uses `ExtensionPoint` internally. Public API is unchanged.

### `ModelRouter` takes `Arc<ProviderRegistry>`

```rust
// 0.3
let router = ModelRouter::new(registry, policy);

// 0.4
let router = ModelRouter::new(Arc::new(registry), policy);
```

### New: `Extensions` facade

The 13-field `Extensions` struct replaces the individual constructor arguments. See **[Extensions Facade](../core/extensions-facade.md)**.

### New: `Component` trait and `ComponentRegistry`

Components now have a lifecycle contract. See **[Component Trait](../core/component-trait.md)**.

### New: `FactoryRegistry`

Config-driven construction via `FactoryRegistry`. See **[FactoryRegistry](../core/factory-registry.md)**.

## 0.2 → 0.3

- `ChatRequest::new` now requires `ModelName` instead of `&str`.
- `ProviderId` is now a newtype, not a type alias.
- `Tool::execute` returns `ToolResult<ToolOutput>` instead of `Result<Value, ToolError>`.

## See also

- **[API Reference](api-reference.md)** — the full type index.
- **[Overview](../intro/overview.md)** — the high-level picture.
