---
title: 特性开关
description: 完整 feature flag 清单、依赖影响与选型指南。
group: intro
order: 4
summary: 完整 feature flag 清单与选型指南。
related:
  - intro/quick-start
  - config/agent-config
  - storage/storage-overview
---

# 特性开关

`behest` 遵循 "additive only" 的 feature flag 策略：每个 feature 默认**关闭**，必须显式开启；移除一个 feature 是破坏性变更。挑选能覆盖你用例的最小 feature 集；默认 feature 只有 `tls-rustls`。

## 命名约定

- **库 feature** 以来源依赖命名：`redis`、`nats`、`qdrant`、`mongodb`、`surrealdb`、`openai`、`anthropic`。
- **TLS 栈** 互斥：`tls-rustls`（默认）或 `tls-native`。切换时需显式禁用默认。
- **聚合 feature** 打开一组连贯的包：`full`、`storage-all`、`rag-all`、`queue-all`。

## 默认

| Feature | 描述 |
|---|---|
| `tls-rustls` | 默认 TLS 栈。引入 `rustls` 给 HTTP 客户端及任何使用 TLS 的 backend。 |

## Provider 适配器

| Feature | 描述 |
|---|---|
| `openai` | OpenAI 兼容的 chat 与 embedding 适配器（`OpenAiChatAdapter`、`OpenAiEmbeddingAdapter`）。同时启用 `provider.openai.*` factory kind。 |
| `anthropic` | Anthropic Messages API chat 适配器（`AnthropicChatAdapter`）。同时启用 `provider.anthropic.chat` factory kind。 |

## 存储 Backend

| Feature | 描述 |
|---|---|
| `redis` | Redis 后端 store；启用 `RedisRuntimeEventStore`、`RedisRuntimeStreamAdapter` 与 `RedisSessionDataStore`。 |
| `redis-cluster` | Redis Cluster 支持；隐含 `redis`。 |
| `sqlx-postgres` | SQLx PostgreSQL store backend。 |
| `sqlx-mysql` | SQLx MySQL store backend。 |
| `sqlx-sqlite` | SQLx SQLite store backend。 |
| `mongodb` | MongoDB session store backend。 |
| `surrealdb` | SurrealDB session store backend。 |
| `object_store` | 对象存储 backend（兼容 AWS S3），用于 `ArtifactStore`。 |
| `storage-all` | 启用 `redis` + `sqlx-postgres` + `sqlx-mysql` + `sqlx-sqlite` + `mongodb` + `surrealdb`。**不**启用 `object_store`。 |

## RAG

| Feature | 描述 |
|---|---|
| `rag` | 核心 RAG 上下文适配器（无额外依赖），启用 `rag` 模块。 |
| `qdrant` | Qdrant 向量 store backend。 |
| `tantivy` | Tantivy 全文检索 backend。 |
| `rag-all` | 启用 `rag` + `qdrant` + `tantivy`。 |

## 队列

| Feature | 描述 |
|---|---|
| `queue` | 核心 `EventPublisher` trait；启用 `queue` 模块。 |
| `nats` | NATS JetStream 发布器。 |
| `queue-all` | 启用 `queue` + `nats` + `redis`。 |

## 可观测性

| Feature | 描述 |
|---|---|
| `otel` | OpenTelemetry tracing 集成。 |

## 聚合

| Feature | 描述 |
|---|---|
| `full` | 推荐的全量 profile：`openai` + `anthropic` + `redis` + `redis-cluster` + `nats` + `sqlx-postgres` + `mongodb` + `surrealdb` + `otel` + `rag-all` + `queue-all` + `object_store`。**不**启用 `sqlx-mysql`、`sqlx-sqlite`。 |

## 选型指南

下表把常见用例映射到 feature 集合，按需扩展。

| 场景 | Feature 集 |
|---|---|
| 本地探索、无网络 | （除 `tls-rustls` 外不开任何 feature） |
| 仅 OpenAI chat | `openai` |
| OpenAI chat + embedding | `openai` |
| 多 provider | `openai` + `anthropic` |
| 生产：session 存 Postgres | `sqlx-postgres` |
| 生产：session 存 MongoDB | `mongodb` |
| 通过 NATS 发布事件 | `queue` + `nats` |
| RAG + 向量 store | `rag` + `qdrant` |
| 分布式事件日志 | `redis` 或 `nats` + `otel` |
| 完整 demo / 自包含 showcase | `full` |

## 互斥组合

同一时间只能启用一个 TLS 栈：

```toml
behest = { version = "0.4", default-features = false, features = ["tls-native", "openai", "redis"] }
```

不要同时启用 `tls-rustls` 与 `tls-native`；构建会以重复依赖错误失败。

## 查看元信息

要查看解析后的 feature 集：

```bash
cargo tree -p behest -e features --features full
```

这会打印在 `--features full` 下激活的完整 feature 图，标明每个依赖由哪个 feature 引入。
