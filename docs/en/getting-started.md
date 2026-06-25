# Getting Started

## Installation

Add `behest` to your `Cargo.toml`:

```toml
[dependencies]
behest = "0.3"
```

With specific features:

```toml
[dependencies]
behest = { version = "0.3", features = ["openai", "anthropic", "redis"] }
```

## Basic Usage

### Create a Chat Request

```rust
use behest::prelude::*;

let request = ChatRequest::new(ModelName::new("example-model"))
    .with_message(Message::system_text("You are concise."))
    .with_user_text("Summarize this project in one sentence.");
```

### Provider Registry

```rust
use behest::prelude::*;

let registry = ProviderRegistry::new();
let provider_id = ProviderId::new("my-provider");

// Register a ChatProvider implementation first.
// registry.register_chat(my_provider);

// Then route through the neutral registry.
// let response = registry.complete(&provider_id, request).await?;
```

### Custom Provider

Implement `ChatProvider` for any model backend:

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

### Define and Execute Tools

```rust
use behest::prelude::*;
use serde_json::{json, Value};

let tool = FunctionTool::new(
    "echo",
    "Echoes the input message.",
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

Execute tool calls:

```rust
use behest::prelude::*;
use serde_json::json;

let call = ToolCall::new("call_1", "echo", json!({ "message": "hello" }));
let output = registry.execute(&call).await?;
```

## Configuration

`AgentConfig` supports layered configuration:

```rust
use behest::prelude::*;

let config = AgentConfig::builder()
    .with_file("behest.toml")?
    .with_env("BEHEST")?
    .build()?;

let runtime = config.into_runtime().await?;
```

Secrets can be loaded through `env:VAR_NAME` indirection:

```toml
[providers.openai]
api_key = "env:OPENAI_API_KEY"
```

## Examples

See the [`examples/`](https://github.com/lazhenyi/behest/tree/main/examples) directory for more usage examples.
