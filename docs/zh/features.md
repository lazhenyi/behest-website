# 特性标志

## 默认

| 特性 | 描述 |
|---|---|
| `tls-rustls` | 使用 rustls 的默认 TLS 栈 |

## 提供商适配器

| 特性 | 描述 |
|---|---|
| `openai` | OpenAI 兼容的聊天和嵌入适配器 |
| `anthropic` | Anthropic 兼容的聊天适配器 |

## TLS

| 特性 | 描述 |
|---|---|
| `tls-rustls` | 为 HTTP/启用的后端启用 rustls TLS 集成 |
| `tls-native` | 为 HTTP/启用的后端启用原生 TLS 集成 |

## 存储

| 特性 | 描述 |
|---|---|
| `redis` | Redis 支持的存储和 Redis Streams 原语。为运行时事件层启用 `RedisRuntimeEventStore`（Streams XADD/XRANGE）、`RedisRuntimeStreamAdapter`（Pub/Sub）和 `RedisSessionDataStore`（基于 Hash 的会话数据存储）。 |
| `redis-cluster` | Redis 集群支持；隐含 `redis` |
| `sqlx-postgres` | SQLx PostgreSQL 存储支持。为运行时事件层启用 `PostgresRuntimeEventStore`（`runtime_events` 表，event 字段为 JSONB）。 |
| `sqlx-mysql` | SQLx MySQL 存储支持 |
| `sqlx-sqlite` | SQLx SQLite 存储支持 |
| `mongodb` | MongoDB 会话存储支持 |
| `surrealdb` | SurrealDB 会话存储支持 |
| `object_store` | 对象存储支持，包括 AWS S3 |
| `storage-all` | Redis、PostgreSQL、MySQL、SQLite、MongoDB 和 SurrealDB 存储特性 |

## RAG

| 特性 | 描述 |
|---|---|
| `rag` | 核心 RAG 上下文适配器 |
| `qdrant` | Qdrant 嵌入存储后端 |
| `tantivy` | Tantivy 后端支持 |
| `rag-all` | 启用 `rag`、`qdrant` 和 `tantivy` |

## 队列

| 特性 | 描述 |
|---|---|
| `queue` | 核心事件发布器 traits |
| `nats` | NATS 事件发布器。为运行时事件层启用 `NatsJetStreamStreamAdapter`（每个 room 独立 JetStream stream，ephemeral pull consumer）。 |
| `queue-all` | 启用 `queue`、`nats` 和 `redis` |

## 服务器和可观测性

| 特性 | 描述 |
|---|---|
| `server` | gRPC 服务器二进制文件和 protobuf 服务层 |
| `otel` | OpenTelemetry 追踪集成 |

## 便利配置

| 特性 | 描述 |
|---|---|
| `full` | 意见完整的运行时配置：OpenAI、Anthropic、Redis、Redis 集群、NATS、PostgreSQL、MongoDB、SurrealDB、OpenTelemetry、所有 RAG 后端、所有队列后端和对象存储。它有意不启用 `server`、`sqlx-mysql` 或 `sqlx-sqlite`。 |

## 使用选定特性的示例

```toml
[dependencies]
behest = {
    version = "0.3",
    default-features = false,
    features = ["tls-rustls", "openai", "anthropic", "redis", "queue", "nats"]
}
```
