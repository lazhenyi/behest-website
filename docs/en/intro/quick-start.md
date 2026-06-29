---
title: Quick Start
description: Install behest, configure a provider, and run your first agent turn in under five minutes.
group: intro
order: 2
summary: Install, configure, run your first turn.
related:
  - intro/overview
  - intro/feature-flags
  - intro/examples
  - core/extension-point
---

# Quick Start

This page walks through the minimum steps to get a working agent turn on the screen. By the end you will have:

- a `Cargo.toml` with `behest` and the `openai` feature,
- a configured `ProviderRegistry` containing an OpenAI chat adapter,
- a runnable `AgentRuntime::run` that completes one user turn.

## 1. Add the dependency

```bash
cargo new hello-behest
cd hello-behest
```

In `Cargo.toml`:

```toml
[dependencies]
behest = { version = "0.4", features = ["openai"] }
tokio = { version = "1", features = ["macros", "rt-multi-thread"] }
async-trait = "0.1"
serde_json = "1"
```

:::callout{type=info}
The `openai` feature is **additive**: it pulls in the `OpenAiChatAdapter` and `OpenAiEmbeddingAdapter`. For Anthropic, also add `"anthropic"`. For TLS, the default is `tls-rustls`; switch to native TLS by enabling `"tls-native"` and disabling the default. See **[Feature Flags](feature-flags.md)** for the full matrix.
:::

## 2. Configure a provider

The shortest path is `AgentConfig::builder().with_env("BEHEST")`. It looks for a TOML file pointed to by `BEHEST_CONFIG` and merges env vars prefixed with `BEHEST__`.

```bash
export BEHEST__PROVIDERS__OPENAI__API_KEY="sk-…"
export BEHEST__PROVIDERS__OPENAI__BASE_URL="https://api.openai.com/v1"
```

`hello-behest/behest.toml`:

```toml
[providers.openai]
type = "openai"
base_url = "https://api.openai.com/v1"
api_key = "env:OPENAI_API_KEY"

[providers.openai.chat]
model = "gpt-4o-mini"
```

The `env:VAR_NAME` indirection is resolved at load time; the literal string `"env:…"` never reaches the HTTP client.

## 3. Build and run

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
        input: "Say hello in exactly five words.".to_string(),
        metadata: serde_json::Value::Null,
        tool_choice: ToolChoice::Auto,
        client_request_id: None,
    };

    let output = runtime.run(request).await?;
    println!("{}", output.final_message);
    Ok(())
}
```

## 4. Stream the response

The default `run` returns a `RunOutput` after the entire turn completes. To observe intermediate model events, use `run_stream` or subscribe to the `RuntimeInvocation` channel.

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

## 5. Inspect what happened

Every run emits a sequence of `AgentEvent` values, persisted by the `RuntimeEventStore` and replayable through the `RuntimeSubscriptionHub`.

```rust
let events = runtime.run_events(run_id).await?;
for e in events {
    println!("{:?}", e);
}
```

## Where next

- **[Feature Flags](feature-flags.md)** — turn on storage, queue, RAG backends.
- **[Examples](examples.md)** — full runnable examples covering tools, RAG, sessions, and streaming.
- **[Core Abstractions](../core/extension-point.md)** — once your first turn works, learn the composable substrate.
- **[Agent Runtime](../runtime/agent-runtime.md)** — the streaming-first FSM that drives every turn.

:::callout{type=tip}
The runtime can be constructed without `AgentConfig` by directly using the `Extensions` facade and `AgentRuntime::new(extensions, policy)`. See **[Extensions Facade](../core/extensions-facade.md)** for the lower-level API.
:::
