---
title: ""
description: " Qdrant embedding store backend，用于近似最近邻搜索。"
group: storage
order: 13
summary: " Qdrant embedding store backend。"
related: []
---

# Backend: Qdrant

> Qdrant embedding store backend，用于近似最近邻搜索。

Feature `qdrant`。提供对应 store trait 的实现。

## 配置

```toml
[store.session.qdrant]
url = "..."
```

## 适用场景

生产环境、多进程部署。

## 另见

- **[Storage Overview](storage-overview.md)** —— 完整矩阵。
