---
title: ProviderConfig
description: " \"`ProviderConfig` 与 `ProviderHttpConfig`，含密钥间接引用与超时默认值。\""
group: providers
order: 5
summary: " `ProviderConfig` 与 `ProviderHttpConfig`，含密钥间接引用。"
related:
  - providers/chat-provider
  - providers/openai-adapter
  - providers/anthropic-adapter
---

# `ProviderConfig`

> HTTP-backed provider 的配置面。

`ProviderConfig` 和 `ProviderHttpConfig` 是描述 provider 连接参数的类型。它们是用户 TOML 配置与 adapter HTTP 客户端之间的桥梁。

完整源码在 `src/provider/config.rs`。

## `ProviderHttpConfig`

```rust
pub struct ProviderHttpConfig {
    pub id: ProviderId,
    pub base_url: String,
    pub api_key: Option<SecretString>,
    pub organization: Option<String>,
    pub timeout: Duration,           // default 60s
    pub connect_timeout: Duration,   // default 10s
    pub max_retries: usize,          // default 2
}
```

### 密钥间接引用

`api_key` 字段是 `Option<SecretString>`。`SecretString` 包装密钥使得 `Debug`、`Display` 和 `Serialize` 输出都脱敏。

```toml
[providers.openai]
api_key = "env:OPENAI_API_KEY"
```

配置加载器在加载时解析 `env:VAR_NAME`，读取环境变量，把结果包进 `SecretString`。

## `ProviderConfig`

```rust
pub struct ProviderConfig {
    pub id: ProviderId,
    pub provider_type: Option<ProviderType>,
    pub base_url: String,
    pub api_key: Option<String>,
    pub timeout_secs: Option<u64>,
    pub connect_timeout_secs: Option<u64>,
    pub max_retries: Option<usize>,
}

impl ProviderConfig {
    pub fn to_http_config(&self, id: ProviderId) -> ProviderHttpConfig;
}
```

## 默认值

| 字段 | 默认 | 来源 |
|---|---|---|
| `timeout` | 60 s | `DEFAULT_TIMEOUT` |
| `connect_timeout` | 10 s | `DEFAULT_CONNECT_TIMEOUT` |
| `max_retries` | 2 | 硬编码 |

## 另见

- **[ChatProvider](chat-provider.md)** —— 消费此配置的端口。
- **[OpenAI Adapter](openai-adapter.md)** —— 具体 adapter。
