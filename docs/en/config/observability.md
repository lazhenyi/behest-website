---
title: Observability
description: Tracing and optional OpenTelemetry integration for the runtime.
group: config
order: 4
summary: Tracing and OpenTelemetry integration.
related:
  - config/agent-config
  - runtime/agent-runtime
---

# Observability

> Tracing and OpenTelemetry.

`behest` uses the `tracing` crate for structured, span-based observability. Every major operation — model calls, tool executions, compaction runs, state transitions — is wrapped in a `tracing` span with structured fields.

## Spans

The runtime emits spans for:

| Operation | Span name | Key fields |
|---|---|---|
| Run | `run` | `run_id`, `session_id`, `provider` |
| Turn | `turn` | `run_id`, `iteration` |
| Model call | `model.call` | `provider`, `model`, `input_tokens` |
| Tool execution | `tool.execute` | `tool_name`, `call_id`, `duration_ms` |
| Compaction | `compaction` | `session_id`, `original_tokens`, `summary_tokens` |
| Snapshot save | `snapshot.save` | `run_id`, `seq` |

## Events

Key events are logged at `INFO` or `WARN` level:

```rust
tracing::info!(%run_id, %provider, %model, "run started");
tracing::warn!(%run_id, error = %e, "tool execution failed");
tracing::error!(%session_id, failures = %n, "compaction circuit opened");
```

## OpenTelemetry

Feature `otel` enables the `tracing-opentelemetry` layer:

```toml
[dependencies]
behest = { version = "0.4", features = ["otel"] }
```

The OpenTelemetry layer exports spans and events to an OTLP collector. Configure via standard `OTEL_*` environment variables:

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4317"
export OTEL_SERVICE_NAME="behest"
```

## Subscriber setup

The runtime does **not** set up the tracing subscriber. The caller is responsible for installing a subscriber before constructing the runtime:

```rust
use tracing_subscriber::fmt;

tracing_subscriber::fmt()
    .with_env_filter("behest=info")
    .init();

let runtime = config.build_runtime().await?;
```

## See also

- **[AgentRuntime](../runtime/agent-runtime.md)** — the instrumented code.
- **[Feature Flags](../intro/feature-flags.md)** — the `otel` feature.
