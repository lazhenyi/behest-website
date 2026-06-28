---
title: ProviderConfig
description: " `ProviderConfig` and `ProviderHttpConfig` with secret indirection and timeout defaults."
group: providers
order: 5
summary: " `ProviderConfig` and `ProviderHttpConfig` with secret indirection."
related:
  - providers/chat-provider
  - providers/openai-adapter
  - providers/anthropic-adapter
---

# `ProviderConfig`

> The configuration surface for HTTP-backed providers.

`ProviderConfig` and `ProviderHttpConfig` are the types that describe a provider's connection parameters: base URL, API key, organisation, timeouts, and retries. They are the bridge between the user's TOML config and the adapter's HTTP client.

The full file is `src/provider/config.rs`.

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

impl ProviderHttpConfig {
    pub fn new(id: ProviderId, base_url: impl Into<String>) -> Self;
    pub fn with_api_key(self, key: SecretString) -> Self;
    pub fn with_organization(self, org: impl Into<String>) -> Self;
    pub fn with_timeouts(self, timeout: Duration, connect: Duration) -> Self;
    pub fn with_max_retries(self, n: usize) -> Self;
}
```

### Secret indirection

The `api_key` field is `Option<SecretString>`, not `Option<String>`. `SecretString` wraps the key so that:

- `Debug` output redacts the value.
- `Display` output redacts the value.
- `Serialize` output redacts the value.

Config files use the `env:VAR_NAME` indirection to avoid embedding secrets in TOML:

```toml
[providers.openai]
api_key = "env:OPENAI_API_KEY"
```

The config loader resolves `env:VAR_NAME` at load time, reads the environment variable, and wraps the result in `SecretString`. The literal string `"env:…"` never reaches the HTTP client.

## `ProviderConfig`

```rust
pub struct ProviderConfig {
    pub id: ProviderId,
    pub provider_type: Option<ProviderType>,
    pub base_url: String,
    pub api_key: Option<String>,         // plain-text from config; wrapped later
    pub organization: Option<String>,
    pub timeout_secs: Option<u64>,
    pub connect_timeout_secs: Option<u64>,
    pub max_retries: Option<usize>,
    pub chat: Option<ChatProviderConfig>,
    pub embedding: Option<EmbeddingProviderConfig>,
}

impl ProviderConfig {
    pub fn to_http_config(&self, id: ProviderId) -> ProviderHttpConfig;
}
```

`ProviderConfig` is the deserialised form from TOML. `to_http_config` converts it to `ProviderHttpConfig`, wrapping the plain-text `api_key` in `SecretString`.

## Defaults

| Field | Default | Source |
|---|---|---|
| `timeout` | 60 s | `DEFAULT_TIMEOUT` |
| `connect_timeout` | 10 s | `DEFAULT_CONNECT_TIMEOUT` |
| `max_retries` | 2 | hard-coded |

## See also

- **[ChatProvider](chat-provider.md)** — the port that consumes this config.
- **[OpenAI Adapter](openai-adapter.md)** — the concrete adapter.
- **[Anthropic Adapter](anthropic-adapter.md)** — the concrete adapter.
