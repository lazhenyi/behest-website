---
title: Migration Guides
description: 在 behest 主要版本间迁移的说明。
group: ref
order: 3
summary: 在主要版本间迁移的说明。
related: []
---

# Migration Guides

> 主要版本间迁移说明。

## 0.3 → 0.4

- `AgentRuntime::new` 现在接收 `Arc<Extensions>` 而非单独 owned 组件
- `ProviderRegistry` 内部使用 `ExtensionPoint`
- `ModelRouter` 接收 `Arc<ProviderRegistry>`
- 新增 `Extensions` facade、`Component` trait、`ComponentRegistry`、`FactoryRegistry`

## 0.2 → 0.3

- `ChatRequest::new` 现在要求 `ModelName` 而非 `&str`
- `ProviderId` 现在是 newtype
- `Tool::execute` 返回 `ToolResult<ToolOutput>`

## 另见

- **[API Reference](api-reference.md)** —— 完整类型索引。

