# 示例

本文档提供 behest 的实用示例。

## 基本聊天补全

使用提供商的简单聊天补全：

```rust
use behest::prelude::*;
use behest::runtime::{AgentRuntime, RuntimePolicy, ToolRuntime, ContextPipeline, RuntimeStore};
use behest::store::memory::{MemorySessionStore, MemoryExecutionStore};
use behest::runtime::memory::MemoryRunStore;
use std::sync::Arc;

#[tokio::main]
async fn main() -> Result<()> {
    // 设置提供商
    let mut registry = ProviderRegistry::new();
    // registry.register_chat(your_provider);

    // 设置运行时
    let sessions = MemorySessionStore::new();
    let executions = MemoryExecutionStore::new();
    let runs = MemoryRunStore::new();
    let store = Arc::new(RuntimeStore::new(
        Box::new(sessions),
        Box::new(executions),
        Box::new(runs),
    ));

    let policy = RuntimePolicy::new();
    let tool_runtime = ToolRuntime::new(ToolRegistry::new(), policy.clone());
    let context = ContextPipeline::new();

    let runtime = AgentRuntime::new(registry, context, tool_runtime, store, policy);

    let request = RunRequest::new(
        ProviderId::new("openai"),
        ModelName::new("gpt-4"),
        "法国的首都是什么？",
    );

    let output = runtime.run(request).await?;
    println!("运行完成: {:?}", output.finish_reason);

    Ok(())
}
```

## 自定义提供商

实现自定义提供商：

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
        let last_text = request.messages.last()
            .and_then(|m| match m {
                Message::User { content } | Message::System { content } => {
                    content.first().map(|p| match p {
                        ContentPart::Text { text } => text.as_str(),
                        _ => "",
                    })
                }
                _ => None,
            })
            .unwrap_or("");

        Ok(ChatResponse {
            provider: self.id.clone(),
            model: request.model,
            message: Message::assistant_text(&format!("Echo: {last_text}")),
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

    let mut registry = ProviderRegistry::new();
    registry.register_chat(provider);

    let request = ChatRequest::new(ModelName::new("echo-model"))
        .with_user_text("Hello!");

    let response = registry.complete(
        &ProviderId::new("echo"),
        request,
    ).await?;

    if let Message::Assistant { content, .. } = &response.message {
        if let Some(ContentPart::Text { text }) = content.first() {
            println!("响应: {text}");
        }
    }

    Ok(())
}
```

## 工具使用

定义和使用工具：

```rust
use behest::prelude::*;
use serde_json::{json, Value};

#[tokio::main]
async fn main() -> Result<()> {
    // 定义计算器工具
    let calculator = FunctionTool::new(
        "calculate",
        "执行基本算术运算。",
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
            Ok(json!({ "result": format!("计算结果: {expr}") }))
        },
    )
    .read_only()
    .concurrency_safe();

    // 创建注册表并注册工具
    let registry = ToolRegistry::new();
    registry.register(calculator);

    // 执行工具调用
    let call = ToolCall::new(
        "call_1",
        "calculate",
        json!({ "expression": "2 + 2" }),
    );

    let output = registry.execute(&call).await?;
    println!("结果: {}", output.value);

    Ok(())
}
```

## 多工具 Agent

具有多个工具的 Agent：

```rust
use behest::prelude::*;
use serde_json::{json, Value};

#[tokio::main]
async fn main() -> Result<()> {
    // 定义工具
    let weather = FunctionTool::new(
        "get_weather",
        "获取指定地点的当前天气。",
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
                .unwrap_or("未知");
            Ok(json!({
                "location": location,
                "temperature": "22°C",
                "condition": "晴"
            }))
        },
    )
    .read_only()
    .concurrency_safe();

    let time = FunctionTool::new(
        "get_time",
        "获取指定时区的当前时间。",
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

    // 创建注册表
    let registry = ToolRegistry::new();
    registry.register(weather);
    registry.register(time);

    // 列出可用工具
    println!("可用工具: {:?}", registry.names());

    // 执行工具调用
    let weather_call = ToolCall::new(
        "call_1",
        "get_weather",
        json!({ "location": "巴黎" }),
    );

    let time_call = ToolCall::new(
        "call_2",
        "get_time",
        json!({ "timezone": "Europe/Paris" }),
    );

    let weather_result = registry.execute(&weather_call).await?;
    let time_result = registry.execute(&time_call).await?;

    println!("天气: {}", weather_result.value);
    println!("时间: {}", time_result.value);

    Ok(())
}
```

## 从文件加载配置

从文件加载配置：

```rust
use behest::prelude::*;

#[tokio::main]
async fn main() -> Result<()> {
    // 创建配置文件
    let config_content = r#"
[providers.openai]
api_key = "env:OPENAI_API_KEY"
model = "gpt-4"

[runtime.policy]
max_iterations = 10
max_tool_concurrency = 4
"#;

    std::fs::write("behest.toml", config_content)?;

    // 加载配置
    let config = AgentConfig::builder()
        .with_file("behest.toml")?
        .with_env("BEHEST")?
        .build()?;

    // 使用配置手动设置运行时
    // ... 详见配置文档 ...

    // 清理
    std::fs::remove_file("behest.toml")?;

    Ok(())
}
```

## 错误处理

全面的错误处理：

```rust
use behest::prelude::*;

#[tokio::main]
async fn main() {
    match run().await {
        Ok(_) => println!("成功！"),
        Err(e) => {
            eprintln!("错误: {e}");
            match e {
                Error::Provider(e) => {
                    eprintln!("提供商错误: {e:?}");
                }
                Error::Tool(e) => {
                    eprintln!("工具错误: {e:?}");
                }
                Error::Storage(e) => {
                    eprintln!("存储错误: {e:?}");
                }
                _ => {
                    eprintln!("其他错误: {e}");
                }
            }
        }
    }
}

async fn run() -> Result<()> {
    let mut registry = ProviderRegistry::new();
    // ... 注册提供商 ...

    let request = ChatRequest::new(ModelName::new("gpt-4"))
        .with_user_text("Hello!");

    let response = registry.complete(&ProviderId::new("openai"), request).await?;
    if let Message::Assistant { content, .. } = &response.message {
        if let Some(ContentPart::Text { text }) = content.first() {
            println!("响应: {text}");
        }
    }

    Ok(())
}
```

## 流式传输

通过 `ProviderRegistry` 进行流式聊天补全：

```rust
use behest::prelude::*;
use futures_util::StreamExt;

#[tokio::main]
async fn main() -> Result<()> {
    let mut registry = ProviderRegistry::new();
    // registry.register_chat(your_streaming_provider);

    let request = ChatRequest::new(ModelName::new("gpt-4"))
        .with_user_text("写一首短诗。");

    let mut stream = registry.stream(&ProviderId::new("openai"), request).await?;

    while let Some(event) = stream.next().await {
        match event {
            Ok(ChatStreamEvent::TextDelta { delta }) => {
                print!("{delta}");
            }
            Ok(ChatStreamEvent::Finished { .. }) => {
                println!("\n[完成]");
            }
            Err(e) => {
                eprintln!("流错误: {e}");
            }
            _ => {}
        }
    }

    Ok(())
}
```

## 更多示例

参见仓库中的 [examples/](https://github.com/lazhenyi/behest/tree/main/examples) 目录获取更多示例。

## 参见

- [快速开始](getting-started.md) - 基本设置
- [工具](tools.md) - 工具实现
- [提供商](providers.md) - 提供商实现
- [配置](configuration.md) - 配置选项
