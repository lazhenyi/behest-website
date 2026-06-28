---
title: AgentConfig
description: " \"`AgentConfig` + builder：面向用户的配置面，带分层来源。\""
group: config
order: 1
summary: " `AgentConfig` + builder：面向用户的配置面。"
related: []
---

# AgentConfig

> 面向用户的配置面。

## Builder

```rust
let runtime = AgentConfig::builder()
    .with_file("behest.toml")?
    .with_env("BEHEST")?
    .build_runtime().await?;
```

## 分层来源

1. Defaults → 2. File (TOML) → 3. Environment → 4. Builder

## `into_extensions`

`build_runtime` 内部调用 `into_extensions`，它会遍历加载的 config，通过 `FactoryRegistry` 构造 Component，执行 init 和 start，把实例注册到 `Extensions` facade。

## 另见

- **[Layered Config](layered-config.md)** —— 合并逻辑。
- **[Extensions Facade](../core/extensions-facade.md)** —— 输出。

