# Configuration

`AgentConfig` supports layered configuration with multiple sources.

## Configuration Layers

Configuration is loaded in the following order (later sources override earlier ones):

1. **Defaults** - Built-in default values
2. **File sources** - TOML, JSON, or YAML configuration files
3. **Environment variables** - Environment variables with a prefix
4. **Manual builder setters** - Programmatic configuration

## Basic Configuration

```rust
use behest::prelude::*;

let config = AgentConfig::builder()
    .with_file("behest.toml")?
    .with_env("BEHEST")?
    .build()?;

let runtime = config.into_runtime().await?;
```

## Configuration File

Create a `behest.toml` file:

```toml
[providers.openai]
api_key = "env:OPENAI_API_KEY"
model = "gpt-4"

[providers.anthropic]
api_key = "env:ANTHROPIC_API_KEY"
model = "claude-3-sonnet-20240229"

[runtime]
max_tokens = 4096
temperature = 0.7
stream = true

[storage]
backend = "memory"
# or for Redis:
# backend = "redis"
# url = "env:REDIS_URL"

[tools]
enabled = true
max_concurrent = 10
```

## Environment Variables

Use environment variables for sensitive data:

```bash
export BEHEST_PROVIDERS_OPENAI_API_KEY="your-api-key"
export BEHEST_PROVIDERS_ANTHROPIC_API_KEY="your-api-key"
export BEHEST_STORAGE_URL="redis://localhost:6379"
```

### Secret Indirection

Secrets can be loaded through `env:VAR_NAME` indirection in configuration files:

```toml
[providers.openai]
api_key = "env:OPENAI_API_KEY"
```

This will read the API key from the `OPENAI_API_KEY` environment variable.

## Builder API

Use the builder API for programmatic configuration:

```rust
use behest::prelude::*;

let config = AgentConfig::builder()
    .with_provider("openai", ProviderConfig {
        api_key: "your-key".to_string(),
        model: "gpt-4".to_string(),
        ..Default::default()
    })
    .with_storage(StorageConfig::Memory)
    .with_runtime(RuntimeConfig {
        max_tokens: 4096,
        temperature: 0.7,
        stream: true,
    })
    .build()?;
```

## Configuration Sources

### File Sources

Support multiple file formats:

```rust
let config = AgentConfig::builder()
    .with_file("behest.toml")?    // TOML
    .with_file("behest.json")?    // JSON
    .with_file("behest.yaml")?    // YAML
    .build()?;
```

### Environment Variables

Load configuration from environment variables:

```rust
let config = AgentConfig::builder()
    .with_env("BEHEST")?  // Prefix for all env vars
    .build()?;
```

## Complete Example

```rust
use behest::prelude::*;

#[tokio::main]
async fn main() -> Result<()> {
    // Load configuration
    let config = AgentConfig::builder()
        .with_file("behest.toml")?
        .with_env("BEHEST")?
        .build()?;

    // Create runtime
    let runtime = config.into_runtime().await?;

    // Use runtime
    let request = ChatRequest::new(ModelName::new("gpt-4"))
        .with_user_text("Hello!");

    let response = runtime.complete(request).await?;
    println!("Response: {}", response.message.content);

    Ok(())
}
```

## Default Configuration

If no configuration is provided, behest uses sensible defaults:

- **Provider**: None (must be configured)
- **Storage**: In-memory
- **Runtime**: 4096 max tokens, 0.7 temperature, streaming enabled
- **Tools**: Enabled, 10 max concurrent

## Validation

Configuration is validated at build time. Invalid configuration will return an error:

```rust
let config = AgentConfig::builder()
    .with_file("invalid.toml")?
    .build()?;  // Returns error if configuration is invalid
```

## See Also

- [Providers](providers.md) - Provider configuration
- [Features](features.md) - Feature flags
- [Getting Started](getting-started.md) - Basic setup
