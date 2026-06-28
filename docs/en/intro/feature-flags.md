---
title: Feature Flags
description: The full feature flag inventory, dependency implications, and selection guide.
group: intro
order: 4
summary: The full feature flag inventory and selection guide.
related:
  - intro/quick-start
  - config/agent-config
  - storage/storage-overview
---

# Feature Flags

`behest` follows the additive-only feature flag policy: every feature is **off** unless explicitly enabled, and removing a feature is a breaking change. Pick the smallest set of features that covers your use case; the default feature is `tls-rustls` and nothing else.

## Naming conventions

- **Library features** are named after the underlying dependency: `redis`, `nats`, `qdrant`, `mongodb`, `surrealdb`, `openai`, `anthropic`.
- **TLS stacks** are mutually exclusive: `tls-rustls` (default) or `tls-native`. Switching requires an explicit opt-out of the default.
- **Aggregator features** turn on a coherent bundle: `full`, `storage-all`, `rag-all`, `queue-all`, `server`.

## Default

| Feature | Description |
|---|---|
| `tls-rustls` | Default TLS stack. Pulls in `rustls` for HTTP clients and any TLS-using backends. |

## Provider adapters

| Feature | Description |
|---|---|
| `openai` | The OpenAI-compatible chat and embedding adapters (`OpenAiChatAdapter`, `OpenAiEmbeddingAdapter`). Also enables the `provider.openai.*` factory kinds. |
| `anthropic` | The Anthropic Messages API chat adapter (`AnthropicChatAdapter`). Also enables the `provider.anthropic.chat` factory kind. |

## Storage backends

| Feature | Description |
|---|---|
| `redis` | Redis-backed store support; also enables `RedisRuntimeEventStore`, `RedisRuntimeStreamAdapter`, and `RedisSessionDataStore`. |
| `redis-cluster` | Redis Cluster support; implies `redis`. |
| `sqlx-postgres` | SQLx PostgreSQL store backend. |
| `sqlx-mysql` | SQLx MySQL store backend. |
| `sqlx-sqlite` | SQLx SQLite store backend. |
| `mongodb` | MongoDB session store backend. |
| `surrealdb` | SurrealDB session store backend. |
| `object_store` | Object storage backend (AWS S3 compatible) for `ArtifactStore`. |
| `storage-all` | Enables `redis` + `sqlx-postgres` + `sqlx-mysql` + `sqlx-sqlite` + `mongodb` + `surrealdb`. Intentionally does not enable `object_store`. |

## RAG

| Feature | Description |
|---|---|
| `rag` | Core RAG context adapter (no extra deps). Enables the `rag` module. |
| `qdrant` | Qdrant vector store backend for embeddings. |
| `tantivy` | Tantivy full-text backend. |
| `rag-all` | Enables `rag` + `qdrant` + `tantivy`. |

## Queues

| Feature | Description |
|---|---|
| `queue` | Core `EventPublisher` trait; enables the `queue` module. |
| `nats` | NATS JetStream publisher. |
| `queue-all` | Enables `queue` + `nats` + `redis`. |

## Server and observability

| Feature | Description |
|---|---|
| `server` | The `agent-server` binary and the gRPC transport. |
| `otel` | OpenTelemetry tracing integration. |

## Aggregator

| Feature | Description |
|---|---|
| `full` | An opinionated full profile: `openai` + `anthropic` + `redis` + `redis-cluster` + `nats` + `sqlx-postgres` + `mongodb` + `surrealdb` + `otel` + `rag-all` + `queue-all` + `object_store`. Intentionally does not enable `server`, `sqlx-mysql`, or `sqlx-sqlite`. |

## Selection guide

The matrix below maps common use cases to a feature set. Add more only when needed.

| Use case | Feature set |
|---|---|
| Local exploration, no network | (no extra features beyond `tls-rustls`) |
| OpenAI chat only | `openai` |
| OpenAI chat + embeddings | `openai` |
| Multi-provider | `openai` + `anthropic` |
| Production with sessions in Postgres | `sqlx-postgres` |
| Production with sessions in MongoDB | `mongodb` |
| Event publishing through NATS | `queue` + `nats` |
| RAG over a vector store | `rag` + `qdrant` |
| Distributed event log | `redis` or `nats` + `otel` |
| Full demo / self-contained showcase | `full` |

## Mutually exclusive combinations

Only one TLS stack at a time:

```toml
behest = { version = "0.4", default-features = false, features = ["tls-native", "openai", "redis"] }
```

Do not enable `tls-rustls` together with `tls-native`; the build will fail with a duplicate-dependency error.

## Cargo metadata

To inspect the resolved feature set:

```bash
cargo tree -p behest -e features --features full
```

This prints the full feature graph as it would be activated with `--features full`, showing which dependencies are pulled in by which feature.
