---
title: DrainGuard
description: Explicit drain tracking after hot-swap via Arc reference counting.
group: core
order: 7
summary: Wrapping an old Arc to wait for in-flight references to drain.
related:
  - core/component-trait
  - core/component-registry
  - core/drain-aware-replace
  - ops/hot-reload
---

# `DrainGuard`

> Wait for in-flight references to a replaced component to drain.

After `ComponentRegistry::replace_instance` or `ManagedRuntime::reload` returns the old component, the caller holds an `Arc<T>`. Other tasks (in-flight requests, background jobs) may also hold `Arc<T>` clones. `DrainGuard` wraps the old `Arc<T>` and provides utilities to **wait** until all other holders drop their references.

## How it works

The guard itself holds one strong reference. Drain is considered complete when `Arc::strong_count` equals 1 — only the guard's reference remains. The guard polls `strong_count` at 50 ms intervals.

```text
   replace_instance returns old Arc<T>
         │
         ▼
   DrainGuard::new(old)
         │
         ▼
   wait_for_drain(timeout)
         │
    ┌────┴────┐
    │         │
  Drained   Timeout { remaining: N }
```

## API

```rust
pub enum DrainResult {
    /// All references were successfully drained.
    Drained,
    /// Timeout expired with outstanding references.
    Timeout { remaining: usize },
}

pub struct DrainGuard<T: ?Sized + Send + Sync> { /* ... */ }

impl<T: ?Sized + Send + Sync> DrainGuard<T> {
    /// Wrap an existing Arc<T>.
    pub fn new(inner: Arc<T>) -> Self;

    /// Outstanding references beyond this guard.
    /// 0 means only the guard holds a reference.
    pub fn outstanding_refs(&self) -> usize;

    /// Wait until all other holders drop, or timeout expires.
    /// Polls at 50 ms intervals.
    pub async fn wait_for_drain(&self, timeout: Duration) -> DrainResult;

    /// Borrow the inner Arc<T>.
    pub fn arc(&self) -> &Arc<T>;

    /// Consume the guard and return the inner Arc<T>.
    pub fn into_inner(self) -> Arc<T>;
}
```

## Usage

```rust
use behest::runtime::drain::DrainGuard;
use std::time::Duration;

// After replace_instance returns the old component:
let old = registry.replace_instance("db", new_instance).await?;
let guard = DrainGuard::new(old);

// Wait for in-flight references to drain (up to 30s).
match guard.wait_for_drain(Duration::from_secs(30)).await {
    DrainResult::Drained => {
        // All references dropped. Safe to clean up.
    }
    DrainResult::Timeout { remaining } => {
        tracing::warn!(remaining, "drain timeout; some references still held");
    }
}
```

## Natural drain vs explicit drain

`ManagedRuntime::reload` uses **natural drain**: the old `Arc<T>` is returned and the caller decides when to drop it. There is no timeout — the old instance lives as long as its last reference.

`DrainGuard` adds **explicit tracking** on top of natural drain:

| Approach | Mechanism | Timeout | Use when |
|----------|-----------|---------|----------|
| Natural drain | Return `Arc<T>`, caller drops | None | Most cases |
| `DrainGuard` | `wait_for_drain(timeout)` polls `strong_count` | Configurable | Need to know when drain completes or enforce a deadline |

## Relationship to `ExtensionPoint` drain

The `ExtensionPoint` drain protocol polls `Arc::strong_count` in a loop with a configurable timeout, built into the `replace` method itself. `DrainGuard` is a standalone utility for cases where the caller wants to manage the drain timeline explicitly — for example, logging when the last in-flight request completes, or forcing a stop after a deadline.

## See also

- **[Hot Reload](../ops/hot-reload.md)** — the operator-facing protocol.
- **[ComponentRegistry](component-registry.md)** — `replace_instance` returns the old Arc.
- **[Drain-aware Replace](drain-aware-replace.md)** — the ExtensionPoint-level protocol.
