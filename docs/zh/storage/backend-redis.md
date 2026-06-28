---
title: ""
description: " Redis 支持的 session store 与事件原语。"
group: storage
order: 9
summary: " Redis 支持的 store 与 Redis Streams 原语。"
related: []
---

# Backend: Redis

> Redis 支持的 session store 与事件原语。

Feature `redis`。提供对应 store trait 的实现。

## 配置

```toml
[store.session.redis]
url = "..."
```

## 适用场景

生产环境、多进程部署。

## 另见

- **[Storage Overview](storage-overview.md)** —— 完整矩阵。
