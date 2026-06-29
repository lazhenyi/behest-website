---
title: 快速开始
description: 安装 behest、配置 provider，五分钟内跑通第一个 agent turn。
group: intro
order: 2
summary: 安装、配置、跑通第一个 turn。
related:
  - intro/overview
  - intro/feature-flags
  - intro/examples
  - core/extension-point
---

# 快速开始

这一页带你走过把一个 agent turn 跑起来所需的最小步骤。读完之后你会拥有：

- 一份带 `behest` 与 `openai` feature 的 `Cargo.toml`，
- 一个已配置的 `ProviderRegistry`（含 OpenAI chat adapter），
- 一段可运行的 `AgentRuntime::run`，完成一次 user turn。

## 1. 添加依赖

```bash
cargo new hello-behest
cd hello-behest
```

在 `Cargo.toml` 中：

```toml
[dependencies]
behest = { version = "0.4", features = ["openai"] }
tokio = { version = "1", features = ["macros", "rt-multi-thread"] }
async-trait = "0.1"
serde_json = "1"
```

:::callout{type=info}
`openai` feature 是**可叠加的**：它会引入 `OpenAiChatAdapter` 与 `OpenAiEmbeddingAdapter`。要使用 Anthropic，再加 `"anthropic"`。TLS 默认是 `tls-rustls`；要切换到 native TLS，请启用 `"tls-native"` 并禁用默认。完整矩阵见 **[特性开关](feature-flags.md)**。
:::

## 2. 配置 provider

最简路径是 `AgentConfig::builder().with_env("BEHEST")`。它会读 `BEHEST_CONFIG` 指向的 TOML 文件，并合并以 `BEHEST__` 为前缀的环境变量。

```bash
export BEHEST__PROVIDERS__OPENAI__API_KEY="sk-…"
export BEHEST__PROVIDERS__OPENAI__BASE_URL="https://api.openai.com/v1"
```

`hello-behest/behest.toml`：

```toml
[providers.openai]
type = "openai"
base_url = "https://api.openai.com/v1"
api_key = "env:OPENAI_API_KEY"

[providers.openai.chat]
model = "gpt-4o-mini"
```

`env:VAR_NAME` 这种间接引用在加载时解析；字符串字面值 `"env:…"` 永远不会到达 HTTP 客户端。

## 3. 构造并运行

```rust
use behest::prelude::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = AgentConfig::builder()
        .with_file("behest.toml")?
        .with_env("BEHEST")?
        .build()?;

    let runtime = config.into_runtime().await?;

    let request = RunRequest {
        session_id: None,
        run_id: None,
        provider: ProviderId::new("openai"),
        model: ModelName::new("gpt-4o-mini"),
        input: "请用恰好五个字打招呼。".to_string(),
        metadata: serde_json::Value::Null,
        tool_choice: ToolChoice::Auto,
        client_request_id: None,
    };

    let output = runtime.run(request).await?;
    println!("{}", output.final_message);
    Ok(())
}
```

## 4. 流式响应

默认的 `run` 在整个 turn 完成后返回 `RunOutput`。若要观察中间的模型事件，使用 `run_stream`，或订阅 `RuntimeInvocation` 通道。

```rust
use futures::StreamExt;

let mut stream = runtime.run_stream(request).await?;
while let Some(event) = stream.next().await {
    match event? {
        AgentEvent::TextDelta { delta, .. } => print!("{delta}"),
        AgentEvent::TurnCompleted { .. }     => break,
        _ => {}
    }
}
```

## 5. 检查事件

每一次 run 都会发出一系列 `AgentEvent` 值，由 `RuntimeEventStore` 持久化，并可通过 `RuntimeSubscriptionHub` 回放。

```rust
let events = runtime.run_events(run_id).await?;
for e in events {
    println!("{:?}", e);
}
```

## 下一步

- **[特性开关](feature-flags.md)** — 打开存储、队列、RAG backend。
- **[示例](examples.md)** — 涵盖工具、RAG、session 与流式的完整可运行示例。
- **[核心抽象](../core/extension-point.md)** — 第一个 turn 跑通后，学习可组合的基底。
- **[Agent 运行时](../runtime/agent-runtime.md)** — 驱动每个 turn 的流式优先 FSM。

:::callout{type=tip}
也可以不走 `AgentConfig`，而直接使用 `Extensions` 外观与 `AgentRuntime::new(extensions, policy)`。见 **[Extensions Facade](../core/extensions-facade.md)**。
:::
