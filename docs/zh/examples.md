# 示例

本文档提供了使用 behest 的实际示例。

## 基本聊天完成

使用提供商进行简单的聊天完成：

```rust
use behest::prelude::*;

#[tokio::main]
async fn main() -> Result<()> {
    // 使用 OpenAI 配置
    let config = AgentConfig::builder()
        .with_env("BEHEST")?
        .build()?;

    let runtime = config.into_runtime().await?;

    let request = ChatRequest::new(ModelName::new("gpt-4"))
        .with_system_text("你是一个有帮助的助手。")
        .with_user_text("法国的首都是什么？");

    let response = runtime.complete(request).await?;
    println!("响应: {}", response.message.content);

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
        let last_message = request.messages.last()
            .map(|m| m.content.to_string())
            .unwrap_or_default();

        Ok(ChatResponse {
            provider: self.id.clone(),
            model: request.model,
            message: Message::assistant_text(&format!("回显: {}", last_message)),
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
        .with_user_text("你好！");

    let response = registry.complete(
        &ProviderId::new("echo"),
        request,
    ).await?;

    println!("响应: {}", response.message.content);

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
            Ok(json!({ "result": format!("已计算: {}", expr) }))
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
    println!("结果: {}", output);

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
        "获取位置的当前天气。",
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
                "condition": "晴朗"
            }))
        },
    )
    .read_only()
    .concurrency_safe();

    let time = FunctionTool::new(
        "get_time",
        "获取时区的当前时间。",
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
    println!("可用工具: {:?}", registry.list());

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

    println!("天气: {}", weather_result);
    println!("时间: {}", time_result);

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
            eprintln!("错误: {}", e);
            match e {
                Error::Provider(e) => {
                    eprintln!("提供商错误: {:?}", e);
                }
                Error::Tool(e) => {
                    eprintln!("工具错误: {:?}", e);
                }
                Error::Storage(e) => {
                    eprintln!("存储错误: {:?}", e);
                }
                _ => {
                    eprintln!("其他错误: {}", e);
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
        .with_user_text("你好！");

    let response = runtime.complete(request).await?;
    println!("响应: {}", response.message.content);

    Ok(())
}
```

## 更多示例

请参见仓库中的 [examples/](https://github.com/lazhenyi/behest/tree/main/examples) 目录：

- `hello_world.rs` - 基本用法
- `custom_provider.rs` - 自定义提供商实现
- `tool_registry.rs` - 工具定义和执行
- `hello_config.rs` - 配置加载
- `provider_setup.rs` - 提供商配置
- `session_lifecycle.rs` - 会话管理
- `event_subscription.rs` - 事件订阅

## 另请参阅

- [快速入门](getting-started.md) - 基本设置
- [工具](tools.md) - 工具实现
- [提供商](providers.md) - 提供商实现
- [配置](configuration.md) - 配置选项
