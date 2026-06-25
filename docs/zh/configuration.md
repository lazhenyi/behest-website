# 配置

`AgentConfig` 支持分层配置，具有多个来源。

## 配置层级

配置按以下顺序加载（后面的来源覆盖前面的）：

1. **默认值** - 内置默认值
2. **文件来源** - TOML、JSON 或 YAML 配置文件
3. **环境变量** - 带前缀的环境变量
4. **手动构建器设置** - 编程式配置

## 基本配置

```rust
use behest::prelude::*;

let config = AgentConfig::builder()
    .with_file("behest.toml")?
    .with_env("BEHEST")?
    .build()?;

let runtime = config.into_runtime().await?;
```

## 配置文件

创建 `behest.toml` 文件：

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
# 或使用 Redis：
# backend = "redis"
# url = "env:REDIS_URL"

[tools]
enabled = true
max_concurrent = 10
```

## 环境变量

使用环境变量存储敏感数据：

```bash
export BEHEST_PROVIDERS_OPENAI_API_KEY="your-api-key"
export BEHEST_PROVIDERS_ANTHROPIC_API_KEY="your-api-key"
export BEHEST_STORAGE_URL="redis://localhost:6379"
```

### 密钥间接引用

密钥可以通过配置文件中的 `env:VAR_NAME` 间接加载：

```toml
[providers.openai]
api_key = "env:OPENAI_API_KEY"
```

这将从 `OPENAI_API_KEY` 环境变量读取 API 密钥。

## 构建器 API

使用构建器 API 进行编程式配置：

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

## 配置来源

### 文件来源

支持多种文件格式：

```rust
let config = AgentConfig::builder()
    .with_file("behest.toml")?    // TOML
    .with_file("behest.json")?    // JSON
    .with_file("behest.yaml")?    // YAML
    .build()?;
```

### 环境变量

从环境变量加载配置：

```rust
let config = AgentConfig::builder()
    .with_env("BEHEST")?  // 所有环境变量的前缀
    .build()?;
```

## 完整示例

```rust
use behest::prelude::*;

#[tokio::main]
async fn main() -> Result<()> {
    // 加载配置
    let config = AgentConfig::builder()
        .with_file("behest.toml")?
        .with_env("BEHEST")?
        .build()?;

    // 创建运行时
    let runtime = config.into_runtime().await?;

    // 使用运行时
    let request = ChatRequest::new(ModelName::new("gpt-4"))
        .with_user_text("你好！");

    let response = runtime.complete(request).await?;
    println!("响应: {}", response.message.content);

    Ok(())
}
```

## 默认配置

如果未提供配置，behest 使用合理的默认值：

- **提供商**: 无（必须配置）
- **存储**: 内存
- **运行时**: 4096 最大 token，0.7 温度，启用流式
- **工具**: 启用，10 个最大并发

## 验证

配置在构建时进行验证。无效配置将返回错误：

```rust
let config = AgentConfig::builder()
    .with_file("invalid.toml")?
    .build()?;  // 如果配置无效则返回错误
```

## 另请参阅

- [提供商](providers.md) - 提供商配置
- [特性标志](features.md) - 特性标志
- [快速入门](getting-started.md) - 基本设置
