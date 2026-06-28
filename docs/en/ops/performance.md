---
title: Performance
description: Throughput, latency, and the streaming-first design.
group: ops
order: 4
summary: Throughput, latency, and the streaming-first design.
related:
  - ops/deployment
  - runtime/agent-runtime
---

# Performance

> Throughput and latency characteristics.

`behest` is designed for streaming-first execution. The runtime's performance profile is dominated by model latency, not by Rust overhead.

## Key numbers

| Metric | Typical | Notes |
|---|---|---|
| Runtime overhead per turn | <1 ms | FSM transition + context build + event emission |
| Tool execution overhead | <0.5 ms | Schema validation + dispatch (excluding tool work) |
| Event persistence latency | <1 ms | In-process broadcast channel |
| Snapshot save | <5 ms | JSON serialisation + file write (local disk) |
| Memory store lookup | <0.1 ms | `HashMap` behind `RwLock` |
| Build time (full features) | ~60 s | Release, cold |

## Concurrency

The runtime is multi-tenant: multiple `run()` calls can proceed in parallel on different sessions. Per-session serialisation is enforced by `SessionGate`; unrelated sessions do not contend.

## Streaming latency

`RunStream` delivers `TextDelta` events as soon as the provider emits them. There is no buffering between the provider's SSE stream and the runtime's broadcast channel. The only delay is the provider's own latency plus the `tokio` task scheduling overhead (<1 ms).

## Bottlenecks

- **Model latency** — the dominant factor. `provider_timeout` caps wall-clock time.
- **Tool execution** — dominated by the tool's own work. `tool_timeout` caps wall-clock time.
- **Compaction** — a full LLM call to summarise history. Asynchronous; does not block the turn loop.
- **Event persistence** — synchronous append to the `RuntimeEventStore`. For Redis/Postgres backends, network latency applies.

## Tuning

- Increase `max_concurrent` in `ToolRuntimeConfig` to run more tools in parallel.
- Increase `event_buffer` in `RuntimePolicy` to reduce backpressure on the broadcast channel.
- Use `record_execution: false` in `ToolRuntimeConfig` for high-throughput tool scenarios.
- Use Qdrant instead of memory for >10k embedding vectors.

## See also

- **[Deployment](deployment.md)** — resource requirements.
- **[AgentRuntime](../runtime/agent-runtime.md)** — the runtime loop.
