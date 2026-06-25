# Event System

behest provides a comprehensive event system for monitoring and observing agent runtime execution.

## Overview

The event system allows you to:

- Monitor agent execution in real-time
- Track tool calls and executions
- Observe model interactions
- Implement custom logging and analytics
- Build dashboards and audit trails

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

Filter events by type:

```rust
use behest::prelude::*;
use behest::runtime::AgentEvent;

async fn handle_events(mut events: broadcast::Receiver<AgentEvent>) {
    while let Ok(event) = events.recv().await {
        // Only handle specific events
        match &event {
            AgentEvent::TextDelta(_) => {
                // Handle text deltas
            }
            AgentEvent::ToolExecutionFinished(_) => {
                // Handle tool completions
            }
            _ => {
                // Ignore other events
            }
        }
    }
}
```

## Event Publishing

### External Event Publishers

Publish events to external message brokers:

```rust
use behest::prelude::*;

#[cfg(feature = "queue")]
pub trait EventPublisher: Send + Sync {
    async fn publish(&self, event: AgentEvent) -> QueueResult<()>;
}
```

### NATS Publisher

Enable with `nats` feature:

```toml
[dependencies]
behest = { version = "0.3", features = ["queue", "nats"] }
```

```rust
use behest::prelude::*;

#[cfg(all(feature = "queue", feature = "nats"))]
async fn setup_nats_publisher() -> Result<()> {
    let publisher = NatsEventPublisher::new("nats://localhost:4222").await?;

    // Configure runtime with publisher
    let config = AgentConfigBuilder::default()
        .build()?;

    Ok(())
}
```

### Redis Streams Publisher

Enable with `redis` feature:

```toml
[dependencies]
behest = { version = "0.3", features = ["queue", "redis"] }
```

```rust
use behest::prelude::*;

#[cfg(all(feature = "queue", feature = "redis"))]
async fn setup_redis_publisher() -> Result<()> {
    let publisher = RedisStreamsPublisher::new("redis://localhost:6379").await?;

    // Configure runtime with publisher
    let config = AgentConfigBuilder::default()
        .build()?;

    Ok(())
}
```

### NoOp Publisher

For testing or when events are not needed:

```rust
use behest::prelude::*;

let publisher = NoOpPublisher::new();
```

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

- [Architecture](architecture.md) - Runtime model
- [Configuration](configuration.md) - Queue configuration
- [Features](features.md) - Queue feature flags
