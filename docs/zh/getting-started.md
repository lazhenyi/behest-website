# 快速入门

## 安装

在 `Cargo.toml` 中添加 `behest`：

```toml
[dependencies]
behest = "0.3"
```

使用特定特性：

```toml
[dependencies]
behest = { version = "0.3", features = ["openai", "anthropic", "redis"] }
```

## 基本用法

### 创建聊天请求

```rust
use behest::prelude::*;

let request = ChatRequest::new(ModelName::new("example-model"))
    .with_message(Message::system_text("你是一个简洁的助手。"))
    .with_user_text("用一句话总结这个项目。");
```

### 提供商注册表

```rust
use behest::prelude::*;

let registry = ProviderRegistry::new();
let provider_id = ProviderId::new("my-provider");

// 首先注册一个 ChatProvider 实现。
// registry.register_chat(my_provider);

// 然后通过中立注册表路由。
// let response = registry.complete(&provider_id, request).await?;
```

### 自定义提供商

为任何模型后端实现 `ChatProvider`：

```rust
use async_trait::async_trait;
use behest::prelude::*;

struct EchoProvider {
    id: ProviderId,
}

#[async_trait]
impl ChatProvider for EchoProvider {
    fn id(&self) -> ProviderId {
        self.id.clone()
    }

    fn capabilities(&self) -> ProviderCapabilities {
        ProviderCapabilities::chat()
    }

    async fn complete(&self, request: ChatRequest) -> ProviderResult<ChatResponse> {
        Ok(ChatResponse {
            provider: self.id.clone(),
            model: request.model,
            message: Message::assistant_text("echo"),
            finish_reason: FinishReason::Stop,
            usage: None,
            raw: None,
        })
    }
}
```

### 定义和执行工具

```rust
use behest::prelude::*;
use serde_json::{json, Value};

let tool = FunctionTool::new(
    "echo",
    "回显输入消息。",
    json!({
        "type": "object",
        "properties": {
            "message": { "type": "string" }
        },
        "required": ["message"]
    }),
    |args: Value| async move {
        Ok(args.get("message").cloned().unwrap_or(Value::Null))
    },
)
.read_only()
.concurrency_safe();

let registry = ToolRegistry::new();
registry.register(tool);
```

执行工具调用：

```rust
use behest::prelude::*;
use serde_json::json;

let call = ToolCall::new("call_1", "echo", json!({ "message": "hello" }));
let output = registry.execute(&call).await?;
```

## 配置

`AgentConfig` 支持分层配置：

```rust
use behest::prelude::*;

let config = AgentConfig::builder()
    .with_file("behest.toml")?
    .with_env("BEHEST")?
    .build()?;

let runtime = config.into_runtime().await?;
```

密钥可以通过 `env:VAR_NAME` 间接加载：

```toml
[providers.openai]
api_key = "env:OPENAI_API_KEY"
```

## 示例

更多示例请参见 [`examples/`](https://github.com/lazhenyi/behest/tree/main/examples) 目录。
