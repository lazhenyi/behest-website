# Examples

This document provides practical examples of using behest.

## Basic Chat Completion

Simple chat completion with a provider:

```rust
use behest::prelude::*;

#[tokio::main]
async fn main() -> Result<()> {
    // Configure with OpenAI
    let config = AgentConfig::builder()
        .with_env("BEHEST")?
        .build()?;

    let runtime = config.into_runtime().await?;

    let request = ChatRequest::new(ModelName::new("gpt-4"))
        .with_system_text("You are a helpful assistant.")
        .with_user_text("What is the capital of France?");

    let response = runtime.complete(request).await?;
    println!("Response: {}", response.message.content);

    Ok(())
}
```

## Custom Provider

Implement a custom provider:

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
        let last_message = request.messages.last()
            .map(|m| m.content.to_string())
            .unwrap_or_default();

        Ok(ChatResponse {
            provider: self.id.clone(),
            model: request.model,
            message: Message::assistant_text(&format!("Echo: {}", last_message)),
            finish_reason: FinishReason::Stop,
            usage: None,
            raw: None,
        })
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    let provider = EchoProvider {
        id: ProviderId::new("echo"),
    };

    let registry = ProviderRegistry::new();
    registry.register_chat(provider);

    let request = ChatRequest::new(ModelName::new("echo-model"))
        .with_user_text("Hello!");

    let response = registry.complete(
        &ProviderId::new("echo"),
        request,
    ).await?;

    println!("Response: {}", response.message.content);

    Ok(())
}
```

## Tool Usage

Define and use tools:

```rust
use behest::prelude::*;
use serde_json::{json, Value};

#[tokio::main]
async fn main() -> Result<()> {
    // Define a calculator tool
    let calculator = FunctionTool::new(
        "calculate",
        "Performs basic arithmetic.",
        json!({
            "type": "object",
            "properties": {
                "expression": { "type": "string" }
            },
            "required": ["expression"]
        }),
        |args: Value| async move {
            let expr = args.get("expression")
                .and_then(|v| v.as_str())
                .unwrap_or("0");
            // Simple evaluation for demonstration
            Ok(json!({ "result": format!("Evaluated: {}", expr) }))
        },
    )
    .read_only()
    .concurrency_safe();

    // Create registry and register tool
    let registry = ToolRegistry::new();
    registry.register(calculator);

    // Execute tool call
    let call = ToolCall::new(
        "call_1",
        "calculate",
        json!({ "expression": "2 + 2" }),
    );

    let output = registry.execute(&call).await?;
    println!("Result: {}", output);

    Ok(())
}
```

## Multi-Tool Agent

Agent with multiple tools:

```rust
use behest::prelude::*;
use serde_json::{json, Value};

#[tokio::main]
async fn main() -> Result<()> {
    // Define tools
    let weather = FunctionTool::new(
        "get_weather",
        "Gets current weather for a location.",
        json!({
            "type": "object",
            "properties": {
                "location": { "type": "string" }
            },
            "required": ["location"]
        }),
        |args: Value| async move {
            let location = args.get("location")
                .and_then(|v| v.as_str())
                .unwrap_or("Unknown");
            Ok(json!({
                "location": location,
                "temperature": "22°C",
                "condition": "Sunny"
            }))
        },
    )
    .read_only()
    .concurrency_safe();

    let time = FunctionTool::new(
        "get_time",
        "Gets current time for a timezone.",
        json!({
            "type": "object",
            "properties": {
                "timezone": { "type": "string" }
            },
            "required": ["timezone"]
        }),
        |args: Value| async move {
            let timezone = args.get("timezone")
                .and_then(|v| v.as_str())
                .unwrap_or("UTC");
            Ok(json!({
                "timezone": timezone,
                "time": "14:30:00"
            }))
        },
    )
    .read_only()
    .concurrency_safe();

    // Create registry
    let registry = ToolRegistry::new();
    registry.register(weather);
    registry.register(time);

    // List available tools
    println!("Available tools: {:?}", registry.list());

    // Execute tool calls
    let weather_call = ToolCall::new(
        "call_1",
        "get_weather",
        json!({ "location": "Paris" }),
    );

    let time_call = ToolCall::new(
        "call_2",
        "get_time",
        json!({ "timezone": "Europe/Paris" }),
    );

    let weather_result = registry.execute(&weather_call).await?;
    let time_result = registry.execute(&time_call).await?;

    println!("Weather: {}", weather_result);
    println!("Time: {}", time_result);

    Ok(())
}
```

## Configuration from File

Load configuration from a file:

```rust
use behest::prelude::*;

#[tokio::main]
async fn main() -> Result<()> {
    // Create configuration file
    let config_content = r#"
[providers.openai]
api_key = "env:OPENAI_API_KEY"
model = "gpt-4"

[runtime]
max_tokens = 4096
temperature = 0.7
stream = true
"#;

    std::fs::write("behest.toml", config_content)?;

    // Load configuration
    let config = AgentConfig::builder()
        .with_file("behest.toml")?
        .with_env("BEHEST")?
        .build()?;

    let runtime = config.into_runtime().await?;

    // Use runtime
    let request = ChatRequest::new(ModelName::new("gpt-4"))
        .with_user_text("Hello!");

    let response = runtime.complete(request).await?;
    println!("Response: {}", response.message.content);

    // Clean up
    std::fs::remove_file("behest.toml")?;

    Ok(())
}
```

## Error Handling

Comprehensive error handling:

```rust
use behest::prelude::*;

#[tokio::main]
async fn main() {
    match run().await {
        Ok(_) => println!("Success!"),
        Err(e) => {
            eprintln!("Error: {}", e);
            match e {
                Error::Provider(e) => {
                    eprintln!("Provider error: {:?}", e);
                }
                Error::Tool(e) => {
                    eprintln!("Tool error: {:?}", e);
                }
                Error::Storage(e) => {
                    eprintln!("Storage error: {:?}", e);
                }
                _ => {
                    eprintln!("Other error: {}", e);
                }
            }
        }
    }
}

async fn run() -> Result<()> {
    let config = AgentConfig::builder()
        .with_env("BEHEST")?
        .build()?;

    let runtime = config.into_runtime().await?;

    let request = ChatRequest::new(ModelName::new("gpt-4"))
        .with_user_text("Hello!");

    let response = runtime.complete(request).await?;
    println!("Response: {}", response.message.content);

    Ok(())
}
```

## Streaming

Streaming chat completion:

```rust
use behest::prelude::*;
use futures_util::StreamExt;

#[tokio::main]
async fn main() -> Result<()> {
    let config = AgentConfig::builder()
        .with_env("BEHEST")?
        .build()?;

    let runtime = config.into_runtime().await?;

    let request = ChatRequest::new(ModelName::new("gpt-4"))
        .with_user_text("Write a short poem.")
        .with_stream(true);

    let mut stream = runtime.stream(request).await?;

    while let Some(event) = stream.next().await {
        match event {
            Ok(ChatEvent::Delta(delta)) => {
                print!("{}", delta);
            }
            Ok(ChatEvent::Done) => {
                println!("\n[Done]");
            }
            Err(e) => {
                eprintln!("Stream error: {}", e);
            }
            _ => {}
        }
    }

    Ok(())
}
```

## More Examples

See the [examples/](https://github.com/lazhenyi/behest/tree/main/examples) directory in the repository for more examples:

- `hello_world.rs` - Basic usage
- `custom_provider.rs` - Custom provider implementation
- `tool_usage.rs` - Tool definition and execution
- `configuration.rs` - Configuration loading
- `streaming.rs` - Streaming responses

## See Also

- [Getting Started](getting-started.md) - Basic setup
- [Tools](tools.md) - Tool implementation
- [Providers](providers.md) - Provider implementation
- [Configuration](configuration.md) - Configuration options
