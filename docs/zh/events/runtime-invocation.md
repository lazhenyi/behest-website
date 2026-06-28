---
title: RuntimeInvocation
description: 跨传输的事件发射与订阅 facade。
group: events
order: 1
summary: 与传输无关的 `emit` / `on` facade，含 `Control` 与 `EventKind`。
related:
  - events/agent-event
  - events/runtime-event-store
  - events/runtime-subscription-hub
  - runtime/agent-runtime
---

# `RuntimeInvocation`

> 与传输无关的事件发射与订阅 facade。

`RuntimeInvocation` 是**订阅**运行时事件的入口。它提供统一的 `on` API，隐藏底层传输是 in-process broadcast channel、Redis Streams 消费者、NATS JetStream 订阅还是其它任何东西。

完整源码在 `src/runtime/invocation.rs`。

## `emit`

Runtime 通过 bridge 发射事件：

```rust
runtime.event_bridge().emit(EmitRequest::new(EventKind::Agent(event)))?;
```

这**不是** `AgentRuntime` 上的 public API；它是内部的。Operator 通过 `on` 订阅。

## `on` 与 `Control`

```rust
pub fn on<F>(&self, handler: F) -> InvocationHandle
where
    F: FnMut(RuntimeEventEnvelope, &mut Control) + Send + 'static;
```

handler 按顺序接收每个事件，附带一个 `Control` 句柄，可以：

- **Pause** 订阅（事件在本地排队，不再投递给 handler）。
- **Resume** 订阅。
- **Cancel** 订阅（不再投递事件；handle 失效）。

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

枚举是**分类**——事件属于哪一类。订阅者可以在处理内部事件前对 `EventKind` 进行过滤。

## 并发

`on` 是**per-subscription**的。每次调用返回一个带自己状态的 `InvocationHandle`。多个订阅者可以挂到同一个 `RuntimeInvocation`；每个人都收到每个事件的副本。

Handler 运行在专用 tokio 任务上；事件在每个订阅的单一线程上按序投递。慢 handler **不会**阻塞其它订阅。

## 另见

- **[AgentEvent](agent-event.md)** —— 事件 payload。
- **[RuntimeEventStore](runtime-event-store.md)** —— 持久化存储。
- **[RuntimeSubscriptionHub](runtime-subscription-hub.md)** —— 把回放与 live 配对。
