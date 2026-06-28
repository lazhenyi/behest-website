---
title: 默认 Factory Registry
description: 内置的 `FactoryRegistry`，预装运行时自带的每个适配器、store 与 adapter。
group: core
order: 7
summary: 内置 factory invoker 集合：OpenAI、Anthropic、内存 store、context。
related:
  - core/factory-registry
  - core/component-wrappers
  - core/component-registry
  - config/agent-config
---

# `default_factory_registry()`

> 开箱即用的 `FactoryInvoker` 集合。

`default_factory_registry()` 返回一个预装好运行时自带每个 `Component` 实现的 `FactoryRegistry`。它是 `AgentConfig::into_extensions` 的入口：配置加载后，为每个 `[[components]]` 条目查询这个注册表，并构造对应的 `Component`。

完整源码在 `src/runtime/components.rs`；便捷入口是 `default_factory_registry`。

## 注册了哪些

| `kind` | Component | 所需 feature |
|---|---|---|
| `provider.openai.chat` | `OpenAiChatComponent` | `openai` |
| `provider.openai.embedding` | `OpenAiEmbeddingComponent` | `openai` |
| `provider.anthropic.chat` | `AnthropicChatComponent` | `anthropic` |
| `store.session.memory` | `MemorySessionStoreComponent` | (default) |
| `store.execution.memory` | `MemoryExecutionStoreComponent` | (default) |
| `store.run.memory` | `MemoryRunStoreComponent` | (default) |
| `store.embedding.memory` | `MemoryEmbeddingStoreComponent` | (default) |
| `store.artifact.memory` | `MemoryArtifactStoreComponent` | (default) |
| `context.pipeline` | `ContextPipelineComponent` | (default) |

按 feature flag 额外添加：

| `kind` | Component | Feature |
|---|---|---|
| `provider.anthropic.chat` | `AnthropicChatComponent` | `anthropic` |
| `store.session.redis` | `RedisSessionStoreComponent` | `redis` |
| `store.session.postgres` | `PostgresSessionStoreComponent` | `sqlx-postgres` |
| `store.session.mongodb` | `MongoSessionStoreComponent` | `mongodb` |
| `store.session.surrealdb` | `SurrealSessionStoreComponent` | `surrealdb` |
| `store.embedding.qdrant` | `QdrantEmbeddingStoreComponent` | `qdrant` |
| `event_store.redis` | `RedisRuntimeEventStoreComponent` | `redis` |
| `stream_adapter.redis` | `RedisRuntimeStreamAdapterComponent` | `redis` |
| `stream_adapter.nats_jetstream` | `NatsJetStreamStreamAdapterComponent` | `nats` |
| `event_publisher.nats` | `NatsEventPublisherComponent` | `nats` + `queue` |
| `event_publisher.redis_streams` | `RedisStreamsPublisherComponent` | `redis` + `queue` |

已注册 kind 的精确集合在编译期确定。在注册表上调用 `kinds()` 返回当前激活的集合。

## 怎么扩展

默认注册表通过以下方式构造：

```rust
pub fn default_factory_registry() -> FactoryRegistry {
    let reg = FactoryRegistry::new();
    let reg = register_providers(reg);
    let reg = register_memory_stores(reg);
    register_context_pipeline(reg)
}
```

每个 `register_*` 函数接收一个 `FactoryRegistry` 并返回增强后的那一个：

```rust
pub fn register_providers(reg: FactoryRegistry) -> FactoryRegistry;
pub fn register_memory_stores(reg: FactoryRegistry) -> FactoryRegistry;
pub fn register_context_pipeline(reg: FactoryRegistry) -> FactoryRegistry;
```

要添加自定义 factory，在结果上调用 `register`：

```rust
let mut reg = default_factory_registry();
reg = reg.register("mycompany.internal-chat", my_invoke);
```

对于 feature-gated 的 backend，`register_*` 函数在编译期被加入，所以增强集合取决于 feature 集。

## 完整示例

```rust
use behest::runtime::factory_registry::FactoryRegistry;
use behest::runtime::default_factory_registry;
use serde_json::json;

let reg: FactoryRegistry = default_factory_registry();
for kind in reg.kinds() {
    println!("{kind}");
}
// 默认 feature，没有 `openai` 或 `anthropic`：
//   store.session.memory
//   store.execution.memory
//   store.run.memory
//   store.embedding.memory
//   store.artifact.memory
//   context.pipeline
```

## 边界情况

- **Feature 关闭** —— 由 feature 注册的 `kind` 干脆不存在；`invoke` 返回 `FactoryError::UnknownKind`。该 factory 不是"被禁用"，而是根本没有编译进去。
- **自定义注册会替换默认** —— 如果调用 `reg.register("store.session.memory", my_invoke)`，你的 `my_invoke` 会覆盖默认的。没有"扩展"语义；如果两个都想要，把你的注册到另一个 `kind` 下，并在 config 中选你想要的。
- **顺序无关** —— `register` 返回 `self`；最终注册表与注册顺序无关。

## 与其它组件的关系

- **[FactoryRegistry](factory-registry.md)** —— 本函数构造的类型。
- **[Component Wrappers](component-wrappers.md)** —— 注册的 `Component` 实现。
- **[AgentConfig](../../config/agent-config)** —— 调用 `default_factory_registry()` 从 TOML 填充运行时的消费者。

## 另见

- **[FactoryRegistry](factory-registry.md)** —— 注册表类型。
- **[Component Wrappers](component-wrappers.md)** —— 各 `Component` 类型。
- **[AgentConfig](../../config/agent-config)** —— 使用本注册表的配置加载器。
