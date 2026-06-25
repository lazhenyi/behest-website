# Event System

behest provides a comprehensive event system for monitoring and observing agent runtime execution, with both in-process broadcast and transport-neutral event sourcing for cross-instance scenarios.

## Overview

The event system allows you to:

- Monitor agent execution in real-time
- Track tool calls and executions
- Observe model interactions
- Implement custom logging and analytics
- Build dashboards and audit trails
- Persist and replay events across processes or hosts
- Fan out live events to multiple subscribers

## AgentEvent

The `AgentEvent` enum represents all possible events during agent execution:

```rust
use behest::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AgentEvent {
    RunStarted(RunStarted),
    ContextBuilt(ContextBuilt),
    ModelStarted(ModelStarted),
    TextDelta(TextDelta),
    ToolCallStarted(ToolCallStarted),
    ToolCallDelta(ToolCallDelta),
    ToolCallCompleted(ToolCallCompleted),
    ToolExecutionStarted(ToolExecutionStarted),
    ToolExecutionFinished(ToolExecutionFinished),
    AssistantMessageCommitted(MessageCommitted),
    ToolMessageCommitted(MessageCommitted),
    UsageRecorded(UsageRecorded),
    RunCompleted(RunCompleted),
    RunFailed(RunFailed),
    RunCancelled(RunCancelled),
    DoomLoopDetected(DoomLoopDetected),
    CompactionCircuitOpened(CompactionCircuitOpened),
}
```

### Event Types

#### Run Events

- `RunStarted` - Run begins execution
- `RunCompleted` - Run completes successfully
- `RunFailed` - Run fails with an error
- `RunCancelled` - Run is cancelled

#### Context Events

- `ContextBuilt` - Context pipeline has built the message list

#### Model Events

- `ModelStarted` - Model call has started
- `TextDelta` - Streaming text delta from model

#### Tool Events

- `ToolCallStarted` - Tool call has started
- `ToolCallDelta` - Tool call arguments delta
- `ToolCallCompleted` - Tool call has completed
- `ToolExecutionStarted` - Tool execution has started
- `ToolExecutionFinished` - Tool execution has finished

#### Message Events

- `AssistantMessageCommitted` - Assistant message saved to store
- `ToolMessageCommitted` - Tool message saved to store

#### Usage Events

- `UsageRecorded` - Token usage has been recorded

#### Safety Events

- `DoomLoopDetected` - Doom loop has been detected
- `CompactionCircuitOpened` - Compaction circuit breaker opened

## Runtime Event Layer

For transport-neutral event sourcing, behest wraps `AgentEvent` in a `RuntimeEventEnvelope` and persists it through a pluggable `RuntimeEventStore` and fans it out live through a `RuntimeStreamAdapter`.

### RuntimeEventEnvelope

```rust
pub struct RuntimeEventEnvelope {
    /// Globally unique event identity (UUIDv7).
    pub event_id: RuntimeEventId,
    /// Per-run monotonic sequence number.
    pub seq: u64,
    /// Run this event belongs to.
    pub run_id: RunId,
    /// Session this event belongs to, when known from `RunStarted`.
    pub session_id: Option<Uuid>,
    /// The wrapped runtime event.
    pub event: AgentEvent,
    /// When the envelope was emitted by the runtime bridge.
    pub emitted_at: DateTime<Utc>,
}
```

`seq` is per-run monotonic, which lets subscribers deduplicate when a replay page overlaps with live events.

### RuntimeEventStore

A durable store for `RuntimeEventEnvelope`. The in-process implementation guards all state under a single `Mutex` so sequence assignment, session propagation, and event insertion are atomic per append. `list_after` for an unknown run returns an empty page rather than an error.

```rust
#[async_trait]
pub trait RuntimeEventStore: Send + Sync {
    async fn append(&self, event: AgentEvent) -> Result<RuntimeEventEnvelope, RuntimeEventStoreError>;
    async fn list_after(
        &self,
        run_id: RunId,
        after_seq: Option<u64>,
        limit: usize,
    ) -> Result<Vec<RuntimeEventEnvelope>, RuntimeEventStoreError>;
}
```

### RuntimeStreamAdapter

A best-effort live fanout surface for envelopes. Rooms are typed: `RuntimeRoom::Run`, `RuntimeRoom::Session`, or `RuntimeRoom::Provider`.

```rust
#[async_trait]
pub trait RuntimeStreamAdapter: Send + Sync {
    async fn publish(&self, room: RuntimeRoom, envelope: RuntimeEventEnvelope)
        -> Result<(), RuntimeStreamError>;
    async fn subscribe(&self, room: RuntimeRoom) -> Result<BoxRuntimeEventStream, RuntimeStreamError>;
}
```

Adapter failures are recoverable: callers are expected to fall back to the event store for replay and deduplicate by `event_id`/`seq`.

### RuntimeSubscriptionHub

Pairs an `EventStore` with a `StreamAdapter`. `subscribe_run` opens the live subscription first, then fetches a replay page from the event store. Callers consume the replay first and then live events, deduplicating any overlap by `seq`.

```rust
let subscription = hub.subscribe_run(run_id, after_seq, limit).await?;
let RuntimeSubscription { replay, mut live } = subscription;
for env in replay {
    handle(env).await;
}
while let Some(env) = live.next().await {
    handle(env).await;
}
```

### RuntimeEventBridge

`RuntimeEventBridge` is the seam between `AgentRuntime` and the event layer. It subscribes to `AgentRuntime::subscribe()` and forwards every event to both the store and the adapter:

```rust
let bridge = RuntimeEventBridge::new(Arc::new(runtime), store, adapter);
let handle = bridge.forward_events();
// drop handle to stop forwarding
```

A bridge `append` failure does not stop a `publish` (and vice versa) — the surfaces are independent so that a transient store or stream failure does not block the other path.

## RuntimeInvocation

`RuntimeInvocation` is a transport-neutral `emit` / `on` facade over `AgentRuntime`. It is the foundation transport adapters build on.

```rust
use std::sync::Arc;
use behest::prelude::*;

let invocation = RuntimeInvocation::new(Arc::new(runtime));

// Subscribe to text deltas across all runs.
let handle = invocation.on(EventKind::TextDelta, |envelope, control| async move {
    if let AgentEvent::TextDelta(delta) = envelope.event {
        print!("{}", delta.delta);
    }
    let _ = control;
})?;
```

The handler signature is:

```rust
F: Fn(RuntimeEventEnvelope, Control) -> Fut + Send + Sync + 'static
```

Where `Control` exposes:

- `is_cancelled()` / `cancel()`
- `timeout()`
- `concurrency_limit()` — when `Some`, the listener uses a `tokio::sync::Semaphore` to cap in-flight handler invocations.

`RuntimeInvocation` maintains a `session_map` (run_id → session_id) so that envelopes for the same run consistently carry the session identity established by `RunStarted`.

## Backends

### Memory (default)

`MemoryRuntimeEventStore` and `MemoryRuntimeStreamAdapter` ship as the default in-process backends. They are the simplest choice for unit tests and single-process deployments.

```rust
use std::sync::Arc;
use behest::prelude::*;

let store = Arc::new(MemoryRuntimeEventStore::new());
let adapter = Arc::new(MemoryRuntimeStreamAdapter::new());
let hub = RuntimeSubscriptionHub::new(store, adapter);
```

### Redis Streams + Pub/Sub

Enable with the `redis` feature:

```toml
[dependencies]
behest = { version = "0.3", features = ["redis"] }
```

- `RedisRuntimeEventStore` — durable persistence on Redis Streams (`XADD` with `MAXLEN ~`, `XRANGE` + `COUNT` for reads). Each `append` increments a per-run sequence counter and stores the session id.
- `RedisRuntimeStreamAdapter` — live fanout over Redis Pub/Sub. The pub/sub subscriber is held on a dedicated connection (the regular `ConnectionManager` is used for `PUBLISH`).

```rust
#[cfg(feature = "redis")]
async fn setup_redis(client: redis::Client) -> Result<()> {
    let store = Arc::new(RedisRuntimeEventStore::new(client.clone()).await?);
    let adapter = Arc::new(RedisRuntimeStreamAdapter::new(client).await?);
    let hub = RuntimeSubscriptionHub::new(store, adapter);
    Ok(())
}
```

### PostgreSQL

Enable with the `sqlx-postgres` feature:

```toml
[dependencies]
behest = { version = "0.3", features = ["sqlx-postgres"] }
```

`PostgresRuntimeEventStore` persists envelopes to a `runtime_events` table (event stored as JSONB) and tracks session identity in a `runtime_sessions` table. The store is safe to share across runtime instances.

```sql
CREATE TABLE runtime_events (
    run_id     UUID         NOT NULL,
    seq        BIGINT       NOT NULL,
    event_id   UUID         NOT NULL,
    session_id UUID,
    event      JSONB        NOT NULL,
    emitted_at TIMESTAMPTZ  NOT NULL,
    PRIMARY KEY (run_id, seq)
);
CREATE TABLE runtime_sessions (
    run_id     UUID PRIMARY KEY,
    session_id UUID NOT NULL
);
```

```rust
#[cfg(feature = "sqlx-postgres")]
async fn setup_postgres(pool: sqlx::PgPool) -> Result<()> {
    let store = Arc::new(PostgresRuntimeEventStore::new(pool));
    // pair with any RuntimeStreamAdapter (e.g. Redis Pub/Sub or NATS JetStream)
    Ok(())
}
```

### NATS JetStream

Enable with the `nats` feature:

```toml
[dependencies]
behest = { version = "0.3", features = ["nats"] }
```

`NatsJetStreamStreamAdapter` creates a dedicated JetStream stream per room (Interest retention policy) and an ephemeral pull consumer per subscription. `publish` writes to the room's stream; `subscribe` returns a stream that yields envelopes as they arrive at the consumer.

```rust
#[cfg(feature = "nats")]
async fn setup_nats(client: async_nats::Client) -> Result<()> {
    let adapter = Arc::new(NatsJetStreamStreamAdapter::new(client));
    // pair with any RuntimeEventStore (e.g. Memory or Postgres)
    Ok(())
}
```

## Subscribing to Events

### Local Subscription

Subscribe to events using the runtime's broadcast channel:

```rust
use behest::prelude::*;
use behest::runtime::AgentEvent;
use std::sync::Arc;
use tokio::sync::broadcast;

#[tokio::main]
async fn main() -> Result<()> {
    let config = AgentConfigBuilder::default().build()?;
    let runtime = Arc::new(config.into_runtime().await?);

    // Subscribe to events
    let mut events: broadcast::Receiver<AgentEvent> = runtime.subscribe();

    // Spawn event handler
    tokio::spawn(async move {
        while let Ok(event) = events.recv().await {
            match event {
                AgentEvent::RunStarted(e) => {
                    println!("Run started: {}", e.run_id);
                }
                AgentEvent::TextDelta(e) => {
                    print!("{}", e.delta);
                }
                AgentEvent::ToolCallStarted(e) => {
                    println!("Tool call: {}", e.tool_name);
                }
                AgentEvent::RunCompleted(e) => {
                    println!("Run completed: {}", e.run_id);
                }
                AgentEvent::RunFailed(e) => {
                    eprintln!("Run failed: {}", e.error);
                }
                _ => {}
            }
        }
    });

    // Use runtime...
    Ok(())
}
```

### Event Filtering

Filter events by type using `EventKind`:

```rust
use behest::prelude::*;

let handle = invocation.on(EventKind::TextDelta, |envelope, _control| async move {
    if let AgentEvent::TextDelta(delta) = envelope.event {
        print!("{}", delta.delta);
    }
})?;
```

`EventKind` variants cover every `AgentEvent` variant plus an `Any` catch-all. `EventKind::matches_agent(&event)` returns whether a given `AgentEvent` matches.

## Configuration

Configure event publishing in `behest.toml`:

```toml
[queue]
enabled = true
backend = "nats"

[queue.nats]
url = "nats://localhost:4222"
subject = "behest.events"
```

Or with Redis:

```toml
[queue]
enabled = true
backend = "redis"

[queue.redis]
url = "redis://localhost:6379"
stream = "behest-events"
```

## Example: Event Logging

```rust
use behest::prelude::*;
use behest::runtime::AgentEvent;
use std::sync::Arc;
use tokio::sync::broadcast;

struct EventLogger;

impl EventLogger {
    async fn log_events(&self, mut events: broadcast::Receiver<AgentEvent>) {
        while let Ok(event) = events.recv().await {
            match event {
                AgentEvent::RunStarted(e) => {
                    tracing::info!(
                        run_id = %e.run_id,
                        session_id = %e.session_id,
                        provider = %e.provider,
                        model = %e.model,
                        "Run started"
                    );
                }
                AgentEvent::TextDelta(e) => {
                    tracing::debug!(run_id = %e.run_id, "Text delta: {}", e.delta);
                }
                AgentEvent::ToolCallStarted(e) => {
                    tracing::info!(
                        run_id = %e.run_id,
                        tool_name = %e.tool_name,
                        "Tool call started"
                    );
                }
                AgentEvent::ToolExecutionFinished(e) => {
                    tracing::info!(
                        run_id = %e.run_id,
                        tool_name = %e.tool_name,
                        success = e.success,
                        duration_ms = e.duration.as_millis(),
                        "Tool execution finished"
                    );
                }
                AgentEvent::RunCompleted(e) => {
                    tracing::info!(
                        run_id = %e.run_id,
                        "Run completed"
                    );
                }
                AgentEvent::RunFailed(e) => {
                    tracing::error!(
                        run_id = %e.run_id,
                        error = %e.error,
                        "Run failed"
                    );
                }
                _ => {}
            }
        }
    }
}
```

## Example: Event Metrics

```rust
use behest::prelude::*;
use behest::runtime::AgentEvent;
use std::sync::Arc;
use std::sync::atomic::{AtomicU64, Ordering};
use tokio::sync::broadcast;

struct EventMetrics {
    runs_started: AtomicU64,
    runs_completed: AtomicU64,
    runs_failed: AtomicU64,
    tool_calls: AtomicU64,
    text_deltas: AtomicU64,
}

impl EventMetrics {
    fn new() -> Self {
        Self {
            runs_started: AtomicU64::new(0),
            runs_completed: AtomicU64::new(0),
            runs_failed: AtomicU64::new(0),
            tool_calls: AtomicU64::new(0),
            text_deltas: AtomicU64::new(0),
        }
    }

    async fn collect(&self, mut events: broadcast::Receiver<AgentEvent>) {
        while let Ok(event) = events.recv().await {
            match event {
                AgentEvent::RunStarted(_) => {
                    self.runs_started.fetch_add(1, Ordering::Relaxed);
                }
                AgentEvent::RunCompleted(_) => {
                    self.runs_completed.fetch_add(1, Ordering::Relaxed);
                }
                AgentEvent::RunFailed(_) => {
                    self.runs_failed.fetch_add(1, Ordering::Relaxed);
                }
                AgentEvent::ToolCallStarted(_) => {
                    self.tool_calls.fetch_add(1, Ordering::Relaxed);
                }
                AgentEvent::TextDelta(_) => {
                    self.text_deltas.fetch_add(1, Ordering::Relaxed);
                }
                _ => {}
            }
        }
    }

    fn report(&self) {
        println!("Metrics:");
        println!("  Runs started: {}", self.runs_started.load(Ordering::Relaxed));
        println!("  Runs completed: {}", self.runs_completed.load(Ordering::Relaxed));
        println!("  Runs failed: {}", self.runs_failed.load(Ordering::Relaxed));
        println!("  Tool calls: {}", self.tool_calls.load(Ordering::Relaxed));
        println!("  Text deltas: {}", self.text_deltas.load(Ordering::Relaxed));
    }
}
```

## See Also

- [Architecture](architecture.md) - Runtime model and runtime event layer
- [Configuration](configuration.md) - Queue configuration
- [Features](features.md) - Runtime event layer feature flags
- [API Reference](api-reference.md) - RuntimeEventStore, RuntimeStreamAdapter, RuntimeSubscriptionHub
