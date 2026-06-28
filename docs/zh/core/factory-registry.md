---
title: FactoryRegistry
description: " \"把 `kind` 字符串映射到 factory invoker，根据 JSON config 构造 `Component` 实例。\""
group: core
order: 6
summary: " `kind` 字符串 → JSON config → `Box<dyn AnyComponent>`。"
related:
  - core/component-trait
  - core/default-factory-registry
  - core/component-registry
  - core/extension-point
---

# `FactoryRegistry`

> `kind` 字符串 → `Component` 实例。

`FactoryRegistry` 是**配置到实例**的映射器。给定类似 `"provider.openai.chat"` 的字符串和一段 JSON config，它返回一个可以注册进 `ComponentRegistry` 的 `Box<dyn AnyComponent>`。默认注册表包含所有内置 provider、store 与适配器。

完整源码在 `src/runtime/factory_registry.rs`。

## 为什么需要 factory 注册表

没有 factory 注册表的话，每个想从 config 构造 `Component` 的地方都必须了解每个具体类型：

```rust
match kind {
    "provider.openai.chat" => Box::new(OpenAiChatComponent::init(&cfg, &ctx)?),
    "provider.anthropic.chat" => Box::new(AnthropicChatComponent::init(&cfg, &ctx)?),
    "store.session.memory" => Box::new(MemorySessionStoreComponent::init(&cfg, &ctx)?),
    // ... 还有 30 多个分支 ...
}
```

`FactoryRegistry` 把这个映射集中起来。新组件只需注册一次自己的 factory；运行时的其余部分只需要 `registry.invoke(kind, cfg, &ctx)`。

## `FactoryInvoker` trait

```rust
pub trait FactoryInvoker: Send + Sync {
    fn invoke(
        &self,
        config: Value,
        ctx: ComponentContext,
    ) -> Result<Box<dyn AnyComponent>, FactoryError>;
}

impl<F> FactoryInvoker for F
where
    F: Fn(Value, ComponentContext) -> Result<Box<dyn AnyComponent>, FactoryError>
        + Send + Sync + 'static,
{ /* blanket impl */ }
```

blanket impl 让闭包直接可用。多数注册都长这样：

```rust
registry.register("provider.openai.chat", |cfg, ctx| {
    let cfg: ProviderHttpComponentConfig = serde_json::from_value(cfg)?;
    let component = OpenAiChatComponent::init(&cfg, &ctx)
        .map_err(|e| FactoryError::FactoryFailed("provider.openai.chat".into(), e.to_string()))?;
    Ok(Box::new(TypedAnyComponent::new(component)))
});
```

## API

```rust
pub struct FactoryRegistry {
    by_kind: HashMap<&'static str, Arc<dyn FactoryInvoker>>,
}

impl FactoryRegistry {
    pub fn new() -> Self;
    pub fn register(self, kind: &'static str, invoker: impl FactoryInvoker + 'static) -> Self;
    pub fn contains(&self, kind: &str) -> bool;
    pub fn kinds(&self) -> impl Iterator<Item = &'static str>;
    pub fn invoke(
        &self,
        kind: &str,
        cfg: Value,
        ctx: &ComponentContext,
    ) -> Result<Box<dyn AnyComponent>, FactoryError>;
}
```

### 错误

```rust
pub enum FactoryError {
    UnknownKind(String),
    InvalidConfig { kind: String, source: serde_json::Error },
    FactoryFailed(String, String),
}
```

## 完整示例

```rust
use serde_json::json;
use behest::runtime::factory_registry::FactoryRegistry;
use behest::runtime::default_factory_registry;
use behest::runtime::component::ComponentContext;
use behest::runtime::lifecycle::ShutdownToken;

let registry = default_factory_registry();
let ctx = ComponentContext::new(ShutdownToken::new());

let cfg = json!({
    "id": "openai-primary",
    "base_url": "https://api.openai.com/v1",
    "api_key": "sk-…",
});

let component = registry.invoke("provider.openai.chat", cfg, &ctx)?;
assert_eq!(component.name(), "provider.openai.chat");
```

## 边界情况

- **未知 kind** —— `invoke("nonexistent", …)` 返回 `FactoryError::UnknownKind("nonexistent")`。消息里包含出问题的 kind 便于诊断。
- **JSON 不合法** —— 反序列化错误以 `FactoryError::InvalidConfig { kind, source }` 上报，`source` 是原始 `serde_json::Error`。
- **Factory 失败** —— 构造失败（比如 config 编译出 struct 但运行期校验失败）变成 `FactoryError::FactoryFailed(kind, message)`。
- **注册是 append-only** —— `register` 是 builder 方法：返回 `self` 便于链式调用。同一个 kind 不能注册两次；第二次调用替换第一次。
- **Config schema** —— 每个 `Component` impl 的 `Config` 关联类型都是 `JsonSchema + DeserializeOwned`，所以注册表可以为 IDE / CLI 工具导出 JSON Schema。对输入 JSON 的校验发生在 serde 边界；其余错误路径是组件自身的错误类型。

## 与其它组件的关系

- **[Component](component-trait.md)** —— 每个 factory 调用 `Component::init` 来产生类型化实例。
- **[Default Factory Registry](default-factory-registry.md)** —— 内置的 factory 集合。
- **[ComponentRegistry](component-registry.md)** —— 消费者；它为每个名字查找 factory 并构造实例。

## 另见

- **[Default Factory Registry](default-factory-registry.md)** —— 默认注册了什么。
- **[Component](component-trait.md)** —— factory 产出的 trait。
- **[ComponentRegistry](component-registry.md)** —— 编排器。
