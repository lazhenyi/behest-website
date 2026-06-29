---
title: Drain-aware Replace
description: Atomic replace with natural Arc drain for in-flight-safe hot swap.
group: core
order: 3
summary: Atomic replace that returns the old Arc<T>; natural reference-counting drain keeps in-flight work safe.
related:
  - core/extension-point
  - core/extensions-facade
  - ops/managed-runtime
  - ops/hot-reload
---

# Drain-aware Replace

> Atomic replace with natural `Arc` drain for in-flight-safe hot swap.

When you replace a registered `Arc<T>` inside an [`ExtensionPoint<T>`](extension-point.md), the swap is a single atomic `replace` call: the storage slot is updated to point at the new value, and the previous `Arc<T>` is handed back to the caller. In-flight requests that already hold a clone of the old `Arc<T>` keep working against the old instance until they drop it; new `get` calls return the new instance.

There is no separate drain API at the `ExtensionPoint` level. Drain is **natural**: the old value stays alive until its last external holder drops it, then is released by Rust's normal reference-counting. The caller that initiated the swap can choose to wait for that moment (by holding the returned `Arc<T>` and polling `Arc::strong_count`, or by awaiting any in-flight work it knows about) or simply drop it and let the old instance be reclaimed in the background.

The full file is `src/runtime/extension.rs`.

## Why this exists

`ProviderRegistry::register_chat_arc` in the legacy layout **silently replaced** the old provider and dropped it immediately. In production this had two failure modes:

1. **Aborted in-flight requests.** A `runtime.run()` call that had already issued a model request would, after the swap, attempt to consume a stream from the **new** provider using a request id issued to the **old** provider. The new provider returned `404 Not Found`; the call failed.
2. **Half-applied tool calls.** A tool execution that had been dispatched to the old store and was in the middle of writing to it would suddenly find the store disconnected, returning a partial result that was persisted by the new store under the same key.

Returning the old `Arc<T>` from `replace` eliminates both failure modes: the caller can observe when the old instance is truly idle (via `Arc::strong_count` or by awaiting known in-flight work) before recycling it.

## API

```rust
impl<T: ?Sized + Send + Sync + 'static> ExtensionPoint<T> {
    pub fn replace(&self, name: &str, new: Arc<T>) -> Result<Arc<T>, ExtensionError>;
}
```

`replace` is synchronous and atomic at the level of the storage map:

1. Looks up `name`. If missing, returns `ExtensionError::NotFound`.
2. Removes the old entry and inserts the new one.
3. Returns the previous `Arc<T>`.

After the call returns, new `get(name)` calls resolve to `new`. Callers that already hold a clone of the old `Arc<T>` continue to operate on the old instance until they drop it.

`replace` does **not** check whether the old `Arc<T>` is still in use — that is the caller's responsibility. If you need to wait for in-flight work to finish, hold the returned `Arc<T>` and poll `Arc::strong_count`, or await the work you know about.

## Worked example — provider hot-swap

```rust
use std::sync::Arc;
use behest::runtime::extensions::Extensions;

async fn swap_openai_provider(
    exts: Arc<Extensions>,
    new_adapter: Arc<dyn behest::provider::ChatProvider>,
) -> Result<(), Box<dyn std::error::Error>> {
    // Atomically swap. New requests now go to new_adapter.
    let old = exts.chat_providers.replace("openai", new_adapter)?;

    // The old provider stays alive until `old` (and any clones held by
    // in-flight runs) are dropped. You can either:
    //   - drop(old) immediately and let Rust reclaim it in the background, or
    //   - hold old and poll Arc::strong_count(&old) until it reaches 1
    //     (meaning only your reference remains), then drop it.
    drop(old);
    Ok(())
}
```

## Edge cases & error semantics

- **Name not present** — `replace` returns `ExtensionError::NotFound` if the name was never registered. You cannot "replace something that does not exist"; use `register` first.
- **Concurrent unregister** — if `unregister("k")` runs between your `get("k")` and your `replace("k", …)`, the `replace` returns `NotFound`. This is intentional: a concurrent unregister means the operator changed their mind, and the swap should abort.
- **Strong count at swap time** — if the storage slot was the only reference (no in-flight requests, no external holders), the returned `Arc<T>` is the last one; dropping it reclaims the old instance immediately.
- **Long-running holders** — if a task holds an `Arc<T>` clone for a long time (e.g. a streaming response that takes minutes), the old instance stays in memory for that duration. There is no timeout at the `ExtensionPoint` level; if you need a deadline, enforce it at the call site (e.g. `tokio::time::timeout` around the work that holds the `Arc`).
- **Lock poisoning** — if a panic occurs while holding the inner `RwLock`, subsequent calls return `ExtensionError::LockPoisoned`.

## Relationship to other components

The protocol is implemented entirely in `ExtensionPoint`; `Extensions` just exposes it via its 13 `ExtensionPoint` fields. The high-level consumer is `ManagedRuntime::reload`, which swaps providers, stores, and any other hot-pluggable component via `replace` and optional pre/post-replace hooks.

- **[ExtensionPoint](extension-point.md)** — implements `replace`.
- **[Extensions](extensions-facade.md)** — exposes the protocol via its 13 `ExtensionPoint` fields.
- **[ManagedRuntime](../ops/managed-runtime.md)** — the high-level `reload(name, new_cfg)` API.
- **[Hot Reload](../ops/hot-reload.md)** — the full operational story: pre-replace hooks, post-replace hooks, drain guidance.

## See also

- **[ExtensionPoint](extension-point.md)** — the storage primitive.
- **[ManagedRuntime](../ops/managed-runtime.md)** — the top-level orchestrator.
- **[Hot Reload](../ops/hot-reload.md)** — operator-facing hot-reload guide.
