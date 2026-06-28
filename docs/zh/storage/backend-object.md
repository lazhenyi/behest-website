---
title: ""
description: " 对象存储 backend（兼容 AWS S3），用于二进制 artifact。"
group: storage
order: 14
summary: " 对象存储 backend（兼容 AWS S3）。"
related: []
---

# Backend: Object

> 对象存储 backend（兼容 AWS S3），用于二进制 artifact。

Feature `object`。提供对应 store trait 的实现。

## 配置

```toml
[store.artifact.s3]
url = "..."
```

## 适用场景

生产环境、多进程部署。

## 另见

- **[Storage Overview](storage-overview.md)** —— 完整矩阵。
