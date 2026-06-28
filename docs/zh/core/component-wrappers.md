---
title: Component 包装器
description: 内置的 `Component` 实现，把 provider、store 与适配器接入生命周期合约。
group: core
order: 8
summary: 每个 provider 与 store 的 Component 形态包装器。
related:
  - core/component-trait
  - core/default-factory-registry
  - core/factory-registry
  - providers/chat-provider
---

# Component 包装器

> 内置的 `Component` 实现。

运行时中每个具体的 provider、store 与适配器都有一个 `Component` 形态的包装器，让它能参与生命周期（`init → start → [serve] → stop → health`），并从 JSON config 构造。包装器位于 `src/runtime/components.rs`。

## Provider 包装器

| 包装器 | 底层 | `Config` |
|---|---|---|
| `OpenAiChatComponent` | `OpenAiChatAdapter` | `ProviderHttpComponentConfig` |
| `AnthropicChatComponent` | `AnthropicChatAdapter` | `ProviderHttpComponentConfig` |
| `OpenAiEmbeddingComponent` | `OpenAiEmbeddingAdapter` | `ProviderHttpComponentConfig` |

三者使用同一个 `ProviderHttpComponentConfig`（id、base_url、可选 api_key、organization、超时、重试），因为它们共用同一套 HTTP+secrets 机制。`init` 步骤反序列化 config，把 `api_key` 包成 `SecretString`，再构造底层 adapter。

## 内存 store 包装器

| 包装器 | 底层 | `Config` |
|---|---|---|
| `MemorySessionStoreComponent` | `MemorySessionStore` | `serde_json::Value`（忽略） |
| `MemoryExecutionStoreComponent` | `MemoryExecutionStore` | `serde_json::Value`（忽略） |
| `MemoryRunStoreComponent` | `MemoryRunStore` | `serde_json::Value`（忽略） |
| `MemoryEmbeddingStoreComponent` | `MemoryEmbeddingStore` | `serde_json::Value`（忽略） |
| `MemoryArtifactStoreComponent` | `MemoryArtifactStore` | `serde_json::Value`（忽略） |

内存 store 不需要配置；包装器仍要为 trait 一致性提供 `Config` 类型，所以用 `serde_json::Value` 占位。`{}` 这样的 JSON 完全可以。

## 上下文包装器

| 包装器 | 底层 | `Config` |
|---|---|---|
| `ContextPipelineComponent` | `ContextPipeline` | `ContextPipelineConfig` |

`ContextPipelineConfig` 包含 `max_history_messages`、`max_history_tokens`、`enable_compaction_filter`。包装器在 `init` 时通过 builder 方法应用它们。

## 错误类型

所有包装器共享同一个错误类型 `ComponentError`，它包装底层的错误类别：

```rust
#[derive(Debug, thiserror::Error)]
pub enum ComponentError {
    #[error("provider error: {0}")]
    Provider(String),
    #[error("store error: {0}")]
    Store(String),
    #[error("context error: {0}")]
    Context(String),
}

impl From<ProviderError> for ComponentError { ... }
```

`From<ProviderError>` 是唯一非平凡的 impl；它把 provider error 字符串化，以便在 registry 中流转。需要类型化错误的调用方可以走 `as_any_arc` downcast，恢复原始错误链。

## `ProviderHttpComponentConfig`

HTTP-backed provider 共享的配置类型：

```rust
pub struct ProviderHttpComponentConfig {
    pub id: String,
    pub base_url: String,
    pub api_key: Option<String>,
    pub organization: Option<String>,
    pub timeout_secs: Option<u64>,
    pub connect_timeout_secs: Option<u64>,
    pub max_retries: Option<usize>,
}
```

通过 `into_provider_http_config()` 转为 `ProviderHttpConfig`，把 `api_key` 包成 `SecretString`，不会被序列化或打印。

## 完整示例

```rust
use serde_json::json;
use behest::runtime::factory_registry::FactoryRegistry;
use behest::runtime::default_factory_registry;
use behest::runtime::component::ComponentContext;
use behest::runtime::lifecycle::ShutdownToken;

let reg = default_factory_registry();
let ctx = ComponentContext::new(ShutdownToken::new());

// 构造一个 OpenAI chat provider。
let cfg = json!({
    "id": "openai-primary",
    "base_url": "https://api.openai.com/v1",
    "api_key": "sk-…",
    "timeout_secs": 60,
    "max_retries": 3,
});
let comp = reg.invoke("provider.openai.chat", cfg, &ctx)?;
comp.start().await?;
println!("{}", comp.health().await.summary());
comp.stop().await?;
```

## 边界情况

- **No-op `start` / `stop`** —— 对于底层类型不需要 start/stop 的组件（例如内存 store），默认 trait 方法返回 `Ok(())`。包装器不会覆盖它们。
- **密钥脱敏** —— `api_key` 从不被打日志。`ProviderHttpComponentConfig` 的 `Debug` 输出故意省略密钥。转 `ProviderHttpConfig` 时把它包成 `SecretString`，display 时会脱敏。
- **默认超时** —— `into_provider_http_config` 在 `timeout_secs` / `connect_timeout_secs` 为 `None` 时回退到 `DEFAULT_TIMEOUT`（60s）与 `DEFAULT_CONNECT_TIMEOUT`（10s）。
- **默认重试** —— `max_retries` 默认 2。

## 与其它组件的关系

- **[Component](component-trait.md)** —— 每个包装器实现的 trait。
- **[Default Factory Registry](default-factory-registry.md)** —— 调用这些包装器的 factory。
- **[ChatProvider](../../providers/chat-provider)** —— 包装器间接（通过 adapter）实现的 provider trait。

## 另见

- **[Component](component-trait.md)** —— trait。
- **[Default Factory Registry](default-factory-registry.md)** —— 暴露这些的注册表。
- **[ChatProvider](../../providers/chat-provider)** —— provider 端口。
