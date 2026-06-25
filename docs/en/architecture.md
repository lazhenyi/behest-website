# Architecture

## Runtime Model

At the runtime layer, `AgentRuntime` orchestrates the full agent loop:

```text
RunRequest
  -> load or create session
  -> admit input
  -> build context
  -> call model provider
  -> stream / persist assistant output
  -> execute tool calls
  -> append tool results
  -> repeat until completion, limit, or error
  -> emit AgentEvent values
```

The runtime brings together:

- `ProviderRegistry`
- `ContextPipeline`
- `ToolRuntime`
- `RuntimeStore`
- `RuntimePolicy`
- `CompactionService`
- `SessionGate`
- optional event publisher
- optional snapshot store
- optional background job pool

## Error Model

`behest` exposes typed error categories instead of stringly framework failures:

- `ProviderError`
- `ToolError`
- `StorageError`
- `ContextError`
- `RuntimeError`
- top-level `Error`
- crate-level `Result<T>`

Provider errors distinguish unsupported capabilities, retryable failures, transport failures, invalid responses, and adapter-specific errors.

Tool errors distinguish missing tools, invalid arguments, execution failures, timeouts, and unimplemented external tools.

## Runtime Event Layer

The runtime event layer sits beside the agent loop and provides transport-neutral event sourcing for cross-instance observability and replay:

```text
AgentRuntime
  -> AgentEvent
  -> RuntimeEventBridge
      -> RuntimeEventStore::append (durable persistence)
      -> RuntimeStreamAdapter::publish (live fanout)
  -> RuntimeSubscriptionHub::subscribe_run
      -> live first, then list_after replay
      -> caller dedupes via RuntimeEventEnvelope::seq
```

Core types:

- `RuntimeEventEnvelope` — wraps an `AgentEvent` with `event_id` (UUIDv7), per-run `seq`, `run_id`, optional `session_id`, and `emitted_at`.
- `RuntimeEventStore` — durable persistence: `append(AgentEvent) -> RuntimeEventEnvelope` and `list_after(run_id, after_seq, limit)`. The in-memory implementation guards all state under a single `Mutex` so sequence assignment, session propagation, and event insertion are atomic per append. Unknown runs return an empty replay.
- `RuntimeStreamAdapter` — best-effort live fanout across rooms (`Run`, `Session`, `Provider`).
- `RuntimeSubscriptionHub` — pairs an `EventStore` with a `StreamAdapter`. `subscribe_run` opens the live subscription first to avoid losing events published between replay and subscription; callers deduplicate overlapping envelopes via `seq`.
- `RuntimeInvocation` — transport-neutral `emit` / `on` facade. The `on` handler receives `RuntimeEventEnvelope` and a `Control` handle, and is gated by an optional `tokio::sync::Semaphore` for concurrency limiting. A `session_map` (run_id → session_id) is maintained on the runtime to propagate session identity to every event.

Backends (feature-gated):

- `MemoryRuntimeEventStore` + `MemoryRuntimeStreamAdapter` (default, in-process).
- `RedisRuntimeEventStore` (Redis Streams XADD/XRANGE) + `RedisRuntimeStreamAdapter` (Redis Pub/Sub) — `redis` feature.
- `PostgresRuntimeEventStore` (PostgreSQL `runtime_events` table with JSONB) — `sqlx-postgres` feature.
- `NatsJetStreamStreamAdapter` (per-room JetStream stream, ephemeral pull consumer) — `nats` feature.

## Lint Policy

The crate is intentionally strict:

- `unsafe_code = "forbid"`
- `missing_docs = "deny"`
- `unreachable_pub = "deny"`
- `clippy::all = "deny"`
- `dbg_macro = "deny"`
- `expect_used = "deny"`
- `todo = "deny"`
- `unimplemented = "deny"`
- `unwrap_used = "deny"`

This project treats public API clarity and failure-path hygiene as part of the runtime contract.
