---
title: 示例
description: 一份按主题分类的可运行示例清单，覆盖 provider、工具、session、RAG、流式与新的可组合运行时。
group: intro
order: 3
summary: 一份按主题分类的可运行示例清单。
related:
  - intro/quick-start
  - tools/tool-trait
  - storage/session-store
  - tools/rag-context-adapter
---

# 示例

每个示例都是 `behest` crate 中 `examples/` 目录下的独立 Rust 二进制。它们被设计为自上而下阅读；较长的示例按"分层"组织，逐步建立在前一个示例的基础之上。

## 按主题

### Provider

| 示例 | 展示内容 |
|---|---|
| [`provider_setup.rs`](https://github.com/lazhenyi/behest/blob/main/examples/provider_setup.rs) | 把 `ChatProvider` 与 `EmbeddingProvider` 注册到 `ProviderRegistry`。 |
| [`real_request.rs`](https://github.com/lazhenyi/behest/blob/main/examples/real_request.rs) | 通过 `ProviderRegistry::complete` 跑一次端到端 chat 请求。 |
| [`custom_provider.rs`](https://github.com/lazhenyi/behest/blob/main/examples/custom_provider.rs) | 为内部模型端点实现 `ChatProvider`。 |

### 工具

| 示例 | 展示内容 |
|---|---|
| [`tool_registry.rs`](https://github.com/lazhenyi/behest/blob/main/examples/tool_registry.rs) | 用 `FunctionTool` 与 `ExternalTool` 构造 `ToolRegistry`。 |
| [`tool_execution.rs`](https://github.com/lazhenyi/behest/blob/main/examples/tool_execution.rs) | 完整 tool-calling turn，含校验、超时、ExecutionStore 记录。 |
| [`tool_scope.rs`](https://github.com/lazhenyi/behest/blob/main/examples/tool_scope.rs) | LIFO shadow-stack 作用域：turn / run / agent / base。 |

### Session 与存储

| 示例 | 展示内容 |
|---|---|
| [`session_lifecycle.rs`](https://github.com/lazhenyi/behest/blob/main/examples/session_lifecycle.rs) | 创建、加载、追加、列出 session。 |
| [`message_history.rs`](https://github.com/lazhenyi/behest/blob/main/examples/message_history.rs) | 通过 `SessionStore` 持久化 `MessageRecord` 历史。 |
| [`session_data_store.rs`](https://github.com/lazhenyi/behest/blob/main/examples/session_data_store.rs) | 调用上下文用的 per-session 数据存储。 |

### 运行时与流式

| 示例 | 展示内容 |
|---|---|
| [`run_streaming.rs`](https://github.com/lazhenyi/behest/blob/main/examples/run_streaming.rs) | 从 `AgentRuntime::run_stream` 流式读取模型事件。 |
| [`invocation_facade.rs`](https://github.com/lazhenyi/behest/blob/main/examples/invocation_facade.rs) | 与传输无关的 `emit` / `on` 外观。 |
| [`control_basics.rs`](https://github.com/lazhenyi/behest/blob/main/examples/control_basics.rs) | 通过 `Control` 句柄 pause / resume / cancel。 |

### 事件与可观测性

| 示例 | 展示内容 |
|---|---|
| [`event_store_replay.rs`](https://github.com/lazhenyi/behest/blob/main/examples/event_store_replay.rs) | 进程重启后从 `RuntimeEventStore` 回放事件。 |
| [`event_subscription.rs`](https://github.com/lazhenyi/behest/blob/main/examples/event_subscription.rs) | 通过 `RuntimeSubscriptionHub` 实现 live + replay 订阅。 |

### 上下文与 RAG

| 示例 | 展示内容 |
|---|---|
| [`context_pipeline.rs`](https://github.com/lazhenyi/behest/blob/main/examples/context_pipeline.rs) | 带 static、function 与 RAG 适配器的 `ContextPipeline`。 |
| [`rag_basic.rs`](https://github.com/lazhenyi/behest/blob/main/examples/rag_basic.rs) | 与 Qdrant 或 Tantivy 配合的 RAG 上下文适配器。 |

### 可组合运行时

| 示例 | 展示内容 |
|---|---|
| [`composable_runtime.rs`](https://github.com/lazhenyi/behest/blob/main/examples/composable_runtime.rs) | `Extensions` 外观、`FactoryRegistry` 与 `default_factory_registry()`。 |
| [`hot_reload.rs`](https://github.com/lazhenyi/behest/blob/main/examples/hot_reload.rs) | Drain-aware 替换：运行时替换 chat provider。 |

### 配置

| 示例 | 展示内容 |
|---|---|
| [`config_from_toml.rs`](https://github.com/lazhenyi/behest/blob/main/examples/config_from_toml.rs) | 加载 `behest.toml` 并叠加环境变量。 |
| [`hello_config.rs`](https://github.com/lazhenyi/behest/blob/main/examples/hello_config.rs) | 最小化的 `AgentConfig` 装配。 |
| [`agent_registry.rs`](https://github.com/lazhenyi/behest/blob/main/examples/agent_registry.rs) | 定义具名 `AgentDefinition` 并按名路由。 |

### 其它

| 示例 | 展示内容 |
|---|---|
| [`snapshot_compaction.rs`](https://github.com/lazhenyi/behest/blob/main/examples/snapshot_compaction.rs) | 进程崩溃后从 snapshot 恢复 run。 |
| [`token_estimation.rs`](https://github.com/lazhenyi/behest/blob/main/examples/token_estimation.rs) | token 估算启发式。 |

## 怎么跑

```bash
git clone https://github.com/lazhenyi/behest
cd behest
cargo run --example provider_setup --features openai
```

除非要启用的 feature 已在 `Cargo.toml` 标明，否则所有示例都在默认 feature 下运行。涉及网络 API 的示例（`real_request`、`run_streaming`、`event_subscription` 等）需要相应的 provider 或 queue feature。

## 新用户推荐阅读顺序

:::callout{type=tip}
1. **provider_setup** — 最小化的端到端示例。
2. **tool_registry** — 加入一个工具。
3. **run_streaming** — 看到事件流。
4. **context_pipeline** — 用 function 适配器组合上下文。
5. **composable_runtime** — 认识新抽象。
6. **hot_reload** — 在 run 飞行途中替换 provider。
:::
