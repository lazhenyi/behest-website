---
title: RuntimeInvocation
description: The transport-neutral `emit` / `on` facade with `Control` handle and `EventKind` classification.
group: events
order: 1
summary: The transport-neutral `emit` / `on` facade with `Control` and `EventKind`.
related:
  - events/agent-event
  - events/runtime-event-store
  - events/runtime-subscription-hub
  - runtime/agent-runtime
---

# `RuntimeInvocation`

> The transport-neutral event-emission and subscription facade.

`RuntimeInvocation` is the entry point for **subscribing** to runtime events. It provides a uniform `on` API that hides whether the underlying transport is the in-process broadcast channel, a Redis Streams consumer, a NATS JetStream subscription, or anything else.

The full file is `src/runtime/invocation.rs`.

## `emit`

The runtime emits events by calling the bridge:

```rust
runtime.event_bridge().emit(EmitRequest::new(EventKind::Agent(event)))?;
```

This is **not** a public API on `AgentRuntime`; it is internal. Operators subscribe via `on`.

## `on` and `Control`

```rust
pub fn on<F>(&self, handler: F) -> InvocationHandle
where
    F: FnMut(RuntimeEventEnvelope, &mut Control) + Send + 'static;
```

The handler receives every event in order, along with a `Control` handle that can:

- **Pause** the subscription (events queue locally, no longer delivered to the handler).
- **Resume** the subscription.
- **Cancel** the subscription (no more events delivered; the handle is invalidated).

```rust
use behest::runtime::invocation::RuntimeInvocation;

let mut inv: RuntimeInvocation = runtime.invocation();
let handle = inv.on(|envelope, control| {
    if envelope.event.is_terminal() {
        control.cancel();
    }
});
```

## `EventKind`

```rust
pub enum EventKind {
    Agent(AgentEvent),
    Chat(ChatStreamEvent),
    Tool(ToolStreamEvent),
    Session(SessionEvent),
    System(SystemEvent),
}
```

The enum is the **classification** — what kind of event this is. Subscribers can filter on `EventKind` before processing the inner event.

## Concurrency

`on` is **per-subscription**. Each call returns an `InvocationHandle` with its own state. Multiple subscribers can attach to the same `RuntimeInvocation`; each gets a copy of every event.

The handler runs on a dedicated tokio task; events are delivered in order on a single thread per subscription. A slow handler does **not** block other subscriptions.

## See also

- **[AgentEvent](agent-event.md)** — the event payload.
- **[RuntimeEventStore](runtime-event-store.md)** — durable persistence.
- **[RuntimeSubscriptionHub](runtime-subscription-hub.md)** — pairs replay with live.
