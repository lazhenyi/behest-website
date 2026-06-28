---
title: ExtensionPoint<T>
description: Typed, name-indexed, hot-swappable collection with drain-aware replace.
group: core
order: 1
summary: A lock-free, clone-cheap registry of `Arc<T>` keyed by string, with live-reference detection and a two-phase drain protocol.
related:
  - core/extensions-facade
  - core/drain-aware-replace
  - core/component-trait
  - core/component-registry
---

# `ExtensionPoint<T>`

> A typed, name-indexed, hot-swappable collection.

`ExtensionPoint<T>` is the substrate of the composable runtime. Every pluggable category — chat providers, embedding providers, tools, context adapters, session stores, execution stores, embedding stores, artifact stores, run stores, event publishers, session data stores, runtime event stores, snapshot stores — is exposed as an `ExtensionPoint<dyn Trait>`. Operators compose a runtime by registering implementations by name, and can replace any registered instance at runtime.

The full file is `src/runtime/extension.rs`.

## Why it exists

Before `ExtensionPoint<T>`, every "registry" in the runtime was its own bespoke data structure: `ProviderRegistry` carried two `HashMap`s, `RuntimeStore` carried five trait objects, the `ContextPipeline` carried an `IndexMap`, and so on. Each one decided independently how to handle lookup, hot-swap, and live-reference detection. The behaviours diverged:

- `ProviderRegistry::register_chat` silently replaces the existing entry and returns the old one, but does **not** check whether anyone is still holding it.
- `RuntimeStore` had no hot-swap at all — to replace a store you had to rebuild the runtime.
- The context pipeline exposed an `IndexMap` whose mutation rules were the public API.

`ExtensionPoint<T>` unifies the four jobs every registry needs:

1. **Register** by name with conflict detection.
2. **Replace** atomically, returning the previous `Arc<T>`.
3. **Detect live references** so that callers don't accidentally drop something still in use.
4. **Drain-aware replace** for runtime hot-swap that waits for in-flight requests to finish.

The result is a single primitive that any component — `ProviderRegistry`, `RuntimeStore`, `ContextPipeline`, `ComponentRegistry`, `FactoryRegistry` — can use as its internal store, gaining all four behaviours for free.

## Design principles

- **Name-indexed** — every entry is keyed by a stable string. The same name space is shared with the component registry, so config files can reference extensions by name (e.g. `"primary"`, `"fallback-eu"`).
- **Clonable** — the inner state is wrapped in an `Arc`, so cloning an `ExtensionPoint` is cheap. A clone observes every registration performed on the original.
- **Hot-swappable** — `replace` atomically swaps the stored `Arc<T>` and returns the previous one. Callers holding the old `Arc` continue to use it; new `get` calls return the new instance.
- **In-use detection** — `unregister` refuses to drop an entry whose strong count is above the registry's reference (one reference for the storage slot). This catches the common bug of removing a provider that is still serving a run.
- **Drain-aware** — `begin_replace` + `complete_replace` form a two-phase protocol that allows the new instance to start serving requests before the old one is dropped, with a configurable drain timeout.

## API surface

```rust
use std::sync::Arc;
use behest::runtime::extension::ExtensionPoint;

pub struct ExtensionPoint<T: ?Sized> {
    // private
}

impl<T: ?Sized> ExtensionPoint<T> {
    pub fn new() -> Self;
    pub fn register(&self, name: impl Into<String>, value: Arc<T>) -> Result<(), ExtensionError>;
    pub fn register_or_replace(&self, name: impl Into<String>, value: Arc<T>) -> Option<Arc<T>>;
    pub fn get(&self, name: &str) -> Option<Arc<T>>;
    pub fn names(&self) -> Vec<String>;
    pub fn is_empty(&self) -> bool;
    pub fn len(&self) -> usize;
    pub fn unregister(&self, name: &str) -> Result<Option<Arc<T>>, ExtensionError>;
    pub fn replace(&self, name: &str, new: Arc<T>) -> Result<Arc<T>, ExtensionError>;
    pub fn begin_replace(&self, name: &str, drain_timeout: Duration) -> Result<ReplaceToken, ExtensionError>;
    pub async fn complete_replace(
        self: Arc<Self>,
        name: &str,
        new: Arc<T>,
        token: ReplaceToken,
    ) -> Result<(), ExtensionError>;
}

impl<T: ?Sized> Default for ExtensionPoint<T> { ... }
impl<T: ?Sized> Clone for ExtensionPoint<T> { ... }   // cheap, Arc-backed
```

### Errors

```rust
pub enum ExtensionError {
    AlreadyRegistered { name: String },
    NotFound { name: String },
    InUse { name: String, strong_count: usize },
    LockPoisoned,
    Replace(ReplaceError),
}
```

The variants are `#[non_exhaustive]`; exhaustive matching requires a wildcard arm.

## Behaviour

### Register and lookup

```rust
let ep: ExtensionPoint<String> = ExtensionPoint::new();
ep.register("greeting", Arc::new("hello".to_string()))?;
assert_eq!(ep.get("greeting").map(|s| (*s).clone()), Some("hello".to_string()));
```

`register` fails with `AlreadyRegistered` if the name is taken. `register_or_replace` is the form most runtime code uses — it returns the previous `Arc<T>` so the caller can decide what to do with it.

### In-use detection

```rust
let ep: ExtensionPoint<String> = ExtensionPoint::new();
ep.register("k", Arc::new("v".to_string()))?;
let external = ep.get("k").unwrap();           // strong_count = 2 (storage + external)
assert!(ep.unregister("k").is_err());          // refuses; still in use
drop(external);                                // strong_count = 1
assert!(ep.unregister("k").is_ok());           // succeeds; storage dropped
```

The strong count is checked against the registry's single reference. An external `Arc` that is currently being awaited by a run is enough to block the unregister.

### Hot-swap with `replace`

```rust
let ep: ExtensionPoint<String> = ExtensionPoint::new();
ep.register("k", Arc::new("old".to_string()))?;
let old = ep.replace("k", Arc::new("new".to_string()))?;
assert_eq!(*old.unwrap(), "old");
assert_eq!(*ep.get("k").unwrap(), "new");
```

`replace` is **synchronous and atomic** at the level of the storage map. The old `Arc` is handed back so the caller can pass it to the drain protocol if it wants graceful shutdown. `replace` does **not** check whether the old `Arc` is still in use — that's the caller's responsibility. For a protocol that does, see below.

### Drain-aware hot-swap

The two-phase `begin_replace` / `complete_replace` is the hot-swap path used by `ManagedRuntime::reload`. See **[Drain-aware Replace](drain-aware-replace.md)** for the full protocol, including the timing diagram and the timeout semantics.

```rust
use std::time::Duration;
use behest::runtime::replace::DEFAULT_DRAIN_TIMEOUT;

let token = ep.begin_replace("k", DEFAULT_DRAIN_TIMEOUT)?;  // 30s
// ... new instance is constructed and started in parallel ...
ep_clone.complete_replace("k", new_instance, token).await?;
```

The whole flow is designed to never drop a value while a caller might still be using it. If the drain timeout elapses with in-flight references, the swap still proceeds — but the old instance is now leaking for as long as the longest-held reference.

## Worked example

```rust
use std::sync::Arc;
use std::time::Duration;
use behest::runtime::extension::ExtensionPoint;
use behest::runtime::replace::DEFAULT_DRAIN_TIMEOUT;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Typed extension point for an opaque "metrics sink" trait object.
    let ep: ExtensionPoint<dyn Send + Sync> = ExtensionPoint::new();

    // Phase 1: bring up v1.
    let v1: Arc<dyn Send + Sync> = Arc::new("v1-metrics");
    ep.register("primary", v1.clone())?;

    // Phase 2: a long-running task holds a reference to v1.
    let inflight = ep.get("primary").unwrap();
    let task = tokio::spawn(async move {
        tokio::time::sleep(Duration::from_millis(100)).await;
        // drop the held Arc at the end of the task
        drop(inflight);
    });

    // Phase 3: hot-swap. The drain protocol waits for the inflight task
    // to finish before letting the storage slot be overwritten.
    let ep_arc = Arc::new(ep);
    let v2: Arc<dyn Send + Sync> = Arc::new("v2-metrics");
    let token = ep_arc.begin_replace("primary", DEFAULT_DRAIN_TIMEOUT)?;
    ep_arc.complete_replace("primary", v2, token).await?;

    task.await?;
    println!("swap complete");
    Ok(())
}
```

## Edge cases & error semantics

- **Register race** — two threads calling `register("k", …)` concurrently: exactly one succeeds; the other gets `AlreadyRegistered`. There is no deadlock.
- **Replace missing** — `replace` on a name that was never registered returns `NotFound`. So does `complete_replace` if the name was unregistered between `begin_replace` and `complete_replace`.
- **Token reuse** — `complete_replace` rejects a `ReplaceToken` that has already been committed (the second call gets `ReplaceError::AlreadyCommitted`). The token is intentionally `Clone` so it can be passed to a deadline task.
- **Lock poisoning** — if a panic occurs while holding the inner `RwLock`, subsequent calls return `LockPoisoned`. This is rare in practice because the inner lock is only held for hash-map operations, but callers should still surface the error.
- **Dropping the last `Arc<T>`** — happens automatically when both the storage slot and the last external `Arc` are dropped. There is no `Drop` impl for `ExtensionPoint<T>`; the inner `Arc<ExtensionInner<T>>` keeps the map alive as long as any clone exists.
- **Trait objects** — the `T: ?Sized` bound allows `ExtensionPoint<dyn ChatProvider>`. For sized types, the common case is also supported. The `Default` impl produces an empty point.

## Relationship to other components

`ExtensionPoint<T>` is the **storage primitive**. The other core abstractions layer on top:

- **[`Extensions`](extensions-facade.md)** is a struct of 13 `ExtensionPoint` fields, one per category of plug-in. Every public API in the runtime reads from this struct.
- **[`Component`](component-trait.md)** is the lifecycle contract that pairs with an `ExtensionPoint<Box<dyn AnyComponent>>` inside `ComponentRegistry`.
- **[`FactoryRegistry`](factory-registry.md)** uses `ExtensionPoint` under the hood to map `kind` strings to factory functions.
- The drain protocol is documented in detail at **[Drain-aware Replace](drain-aware-replace.md)**.

## See also

- **[Extensions Facade](extensions-facade.md)** — the 13-field struct of `ExtensionPoint`s.
- **[Drain-aware Replace](drain-aware-replace.md)** — the two-phase swap protocol.
- **[Component Trait](component-trait.md)** — the lifecycle contract for plug-ins.
- **[ComponentRegistry](component-registry.md)** — the orchestrator.
- **[FactoryRegistry](factory-registry.md)** — `kind` → factory mapping.
