# behest

**用于生产级 AI Agent 运行时的 Rust 原生构建块**

[![CI](https://github.com/lazhenyi/behest/actions/workflows/ci.yml/badge.svg)](https://github.com/lazhenyi/behest/actions/workflows/ci.yml)
[![License: MIT OR Apache-2.0](https://img.shields.io/badge/license-MIT%20OR%20Apache--2.0-blue.svg)](#许可证)

---

## 什么是 behest

`behest` 提供了与提供商无关的契约，涵盖聊天、流式传输、工具调用、嵌入、运行时执行、存储、队列、RAG、可观测性以及可选的 gRPC 服务。

它专为需要显式控制模型提供商、工具执行、持久化和操作边界的系统而设计——而不是不透明的"agent 框架"魔法。

> 状态：早期基础 crate。公共 API 有意保持紧凑、强类型和文档化。

## 为什么选择 behest

**behest** /bɪˈhest/ — *名词* 一个人的命令或指令。

> 在用户的 **behest**（命令）下，agent 行动。

agent 运行时的核心不是"自主意识"，而是受控委托：用户发出意图，系统在显式边界内组合上下文、调用模型、执行工具、持久化状态、发布事件——可审计、可恢复、可约束、可替换。

名称 `behest` 故意避免了像"大脑/认知/智能"这样夸大的隐喻。它只陈述了一个工程事实：

> 工具调用、流式传输、内存、队列、RAG、快照——所有机制的存在都是因为有人下达了命令。

## 设计目标

- **Rust 原生优先**：类型化 API、显式错误、无隐藏运行时假设。
- **与提供商无关的核心**：OpenAI、Anthropic、本地模型、代理或内部提供商可以实现相同的契约。
- **流式优先运行时**：agent 循环围绕流式模型事件设计，在适当情况下提供非流式回退。
- **类型化工具边界**：工具由 JSON Schema 描述，通过显式注册表执行。
- **可插拔持久化**：默认内存存储，外部存储通过特性标志启用。
- **操作表面**：事件发布、快照、会话门控、压缩、重试策略和可选的 gRPC 服务器。
- **小型公共 API**：基础原语优先于框架膨胀。

## 快速开始

```toml
[dependencies]
behest = "0.3"
```

创建一个与提供商无关的聊天请求：

```rust
use behest::prelude::*;

let request = ChatRequest::new(ModelName::new("example-model"))
    .with_message(Message::system_text("你是一个简洁的助手。"))
    .with_user_text("用一句话总结这个项目。");
```

在注册表中注册提供商并路由请求：

```rust
use behest::prelude::*;

let registry = ProviderRegistry::new();
let provider_id = ProviderId::new("my-provider");

// 首先注册一个 ChatProvider 实现。
// registry.register_chat(my_provider);

// 然后通过中立注册表路由。
// let response = registry.complete(&provider_id, request).await?;
```

## 内容概览

| 领域 | 能力 |
|---|---|
| 提供商契约 | `ChatProvider`、`EmbeddingProvider`、请求/响应模型、流事件、提供商能力 |
| 提供商注册表 | 聊天和嵌入提供商的内存路由 |
| 聊天模型类型 | 消息、内容部分、工具调用、响应格式、token 使用量、完成原因 |
| 工具运行时 | `Tool`、`FunctionTool`、`ExternalTool`、`ToolRegistry`、schema 生成、执行分发 |
| Agent 运行时 | 上下文构建、模型调用、工具循环、会话持久化、事件发射 |
| 运行时安全 | 会话门控、运行时策略、输入准入、死循环检测、工具输出截断 |
| 存储 | 内存存储、Redis、SQLx、MongoDB、SurrealDB、对象存储、Qdrant 嵌入 |
| 上下文和 RAG | 上下文适配器、静态/函数适配器、可选 RAG 适配器 |
| 队列 | 通过 NATS 或 Redis Streams 的可选事件发布 |
| 配置 | 构建器、基于文件的配置、环境变量加载、密钥间接引用 |
| 服务器 | `server` 特性下的可选 gRPC 服务器二进制文件 |
| 可观测性 | 追踪和可选的 OpenTelemetry 集成 |

## 文档

- [快速入门](getting-started.md) - 安装和基本用法
- [提供商](providers.md) - 提供商适配器和自定义实现
- [工具](tools.md) - 工具定义和执行
- [会话](sessions.md) - 会话管理和对话状态
- [存储](storage.md) - 存储后端和持久化
- [配置](configuration.md) - 配置选项和层级
- [错误处理](error-handling.md) - 类型化错误类别
- [示例](examples.md) - 实用代码示例
- [架构](architecture.md) - 运行时模型和设计
- [RAG](rag.md) - 检索增强生成
- [事件](events.md) - 事件系统和可观测性
- [特性标志](features.md) - 可用的特性标志
- [API 参考](api-reference.md) - 核心类型和特性
- [开发](development.md) - 开发环境设置和贡献指南

## 许可证

根据以下之一许可：

- Apache License, Version 2.0
- MIT license

由您选择。
