# Feature Flags

## Default

| Feature | Description |
|---|---|
| `tls-rustls` | Default TLS stack using rustls |

## Provider Adapters

| Feature | Description |
|---|---|
| `openai` | OpenAI-compatible chat and embedding adapters |
| `anthropic` | Anthropic-compatible chat adapter |

## TLS

| Feature | Description |
|---|---|
| `tls-rustls` | Enable rustls TLS integration for HTTP / enabled backends |
| `tls-native` | Enable native TLS integration for HTTP / enabled backends |

## Storage

| Feature | Description |
|---|---|
| `redis` | Redis-backed store support and Redis Streams primitives |
| `redis-cluster` | Redis Cluster support; implies `redis` |
| `sqlx-postgres` | SQLx PostgreSQL store support |
| `sqlx-mysql` | SQLx MySQL store support |
| `sqlx-sqlite` | SQLx SQLite store support |
| `mongodb` | MongoDB session store support |
| `surrealdb` | SurrealDB session store support |
| `object_store` | Object storage support, including AWS S3 |
| `storage-all` | Redis, PostgreSQL, MySQL, SQLite, MongoDB, and SurrealDB storage features |

## RAG

| Feature | Description |
|---|---|
| `rag` | Core RAG context adapter |
| `qdrant` | Qdrant embedding store backend |
| `tantivy` | Tantivy backend support |
| `rag-all` | Enables `rag`, `qdrant`, and `tantivy` |

## Queues

| Feature | Description |
|---|---|
| `queue` | Core event publisher traits |
| `nats` | NATS event publisher |
| `queue-all` | Enables `queue`, `nats`, and `redis` |

## Server and Observability

| Feature | Description |
|---|---|
| `server` | gRPC server binary and protobuf service layer |
| `otel` | OpenTelemetry tracing integration |

## Convenience Profile

| Feature | Description |
|---|---|
| `full` | Opinionated full runtime profile: OpenAI, Anthropic, Redis, Redis Cluster, NATS, PostgreSQL, MongoDB, SurrealDB, OpenTelemetry, all RAG backends, all queue backends, and object storage. It intentionally does not enable `server`, `sqlx-mysql`, or `sqlx-sqlite`. |

## Example with Selected Features

```toml
[dependencies]
behest = {
    version = "0.3",
    default-features = false,
    features = ["tls-rustls", "openai", "anthropic", "redis", "queue", "nats"]
}
```
