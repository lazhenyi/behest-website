---
title: Storage Overview
description: 存储分类、trait 矩阵、feature-flag backend 与 RuntimeStore facade。
group: storage
order: 1
summary: 存储分类、facade 与 feature-flag 矩阵。
related: []
---

# Storage Overview

> 可插拔持久化层。

## Trait 矩阵

| Trait | 用途 |
|---|---|
| SessionStore | Session CRUD + 消息历史 |
| EmbeddingStore | 向量持久化 + 搜索 |
| ExecutionStore | Tool 执行 + token 用量 + session 统计 |
| ArtifactStore | 二进制文件存储 |
| RunStore | 事件溯源 run 生命周期 |

## Backend 矩阵

| Backend | Session | Embedding | Execution | Artifact | Run | Feature |
|---|---|---|---|---|---|---|
| Memory | ✓ | ✓ | ✓ | ✓ | ✓ | (default) |
| Redis | ✓ | — | — | — | — | redis |
| SQLx | ✓ | — | — | — | — | sqlx-* |
| MongoDB | ✓ | — | — | — | — | mongodb |
| SurrealDB | ✓ | — | — | — | — | surrealdb |
| Qdrant | — | ✓ | — | — | — | qdrant |
| Object | — | — | — | ✓ | — | object_store |

## RuntimeStore facade

`RuntimeStore` 把各 store 组合为一个句柄。运行时通过 `Extensions` facade 按名访问 store。

## 另见

- **[SessionStore](session-store.md)** —— session trait。
- **[EmbeddingStore](embedding-store.md)** —— 向量 trait。
- **[RuntimeStore](runtime-store.md)** —— facade。

