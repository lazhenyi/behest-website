---
title: Performance
description: 吞吐、延迟与流式优先设计。
group: ops
order: 4
summary: 吞吐、延迟与流式优先设计。
related: []
---

# Performance

> 吞吐与延迟特征。

## 关键数字

| 指标 | 典型值 |
|---|---|
| 每个 turn 运行时开销 | <1 ms |
| Tool 执行开销 | <0.5 ms |
| 事件持久化延迟 | <1 ms |
| Snapshot 保存 | <5 ms |
| 构建时间（full features） | ~60 s |

## 调优

- 增加 `max_concurrent` 以并行更多 tool
- 向量 >10k 用 Qdrant 替代 Memory
- 高吞吐 scenario 设置 `record_execution: false`

## 另见

- **[Deployment](deployment.md)** —— 资源需求。

