---
title: Examples
description: A curated catalogue of runnable examples covering providers, tools, sessions, RAG, streaming, and the new composable runtime.
group: intro
order: 3
summary: A curated catalogue of runnable examples.
related:
  - intro/quick-start
  - tools/tool-trait
  - storage/session-store
  - tools/rag-context-adapter
---

# Examples

Each example is a self-contained Rust binary in the `examples/` directory of the `behest` crate. They are designed to be read top-to-bottom; the more interesting ones are organised in layers, building on the primitives from the previous example.

## By area

### Providers

| Example | What it shows |
|---|---|
| [`provider_setup.rs`](https://github.com/lazhenyi/behest/blob/main/examples/provider_setup.rs) | Registering a `ChatProvider` and an `EmbeddingProvider` against a `ProviderRegistry`. |
| [`real_request.rs`](https://github.com/lazhenyi/behest/blob/main/examples/real_request.rs) | End-to-end chat request through `ProviderRegistry::complete`. |
| [`custom_provider.rs`](https://github.com/lazhenyi/behest/blob/main/examples/custom_provider.rs) | Implementing `ChatProvider` for an internal model endpoint. |

### Tools

| Example | What it shows |
|---|---|
| [`tool_registry.rs`](https://github.com/lazhenyi/behest/blob/main/examples/tool_registry.rs) | Building a `ToolRegistry` from `FunctionTool` and `ExternalTool`. |
| [`tool_execution.rs`](https://github.com/lazhenyi/behest/blob/main/examples/tool_execution.rs) | A full tool-calling turn with validation, timeout, and execution-store recording. |
| [`tool_scope.rs`](https://github.com/lazhenyi/behest/blob/main/examples/tool_scope.rs) | LIFO shadow-stack scopes for turn / run / agent / base. |

### Sessions and storage

| Example | What it shows |
|---|---|
| [`session_lifecycle.rs`](https://github.com/lazhenyi/behest/blob/main/examples/session_lifecycle.rs) | Create, load, append, and list sessions. |
| [`message_history.rs`](https://github.com/lazhenyi/behest/blob/main/examples/message_history.rs) | Persisting the `MessageRecord` history through `SessionStore`. |
| [`session_data_store.rs`](https://github.com/lazhenyi/behest/blob/main/examples/session_data_store.rs) | Per-session data store for invocation context. |

### Runtime and streaming

| Example | What it shows |
|---|---|
| [`run_streaming.rs`](https://github.com/lazhenyi/behest/blob/main/examples/run_streaming.rs) | Streaming model events from `AgentRuntime::run_stream`. |
| [`invocation_facade.rs`](https://github.com/lazhenyi/behest/blob/main/examples/invocation_facade.rs) | The transport-neutral `emit` / `on` facade. |
| [`control_basics.rs`](https://github.com/lazhenyi/behest/blob/main/examples/control_basics.rs) | Pause / resume / cancel via the `Control` handle. |

### Events and observability

| Example | What it shows |
|---|---|
| [`event_store_replay.rs`](https://github.com/lazhenyi/behest/blob/main/examples/event_store_replay.rs) | Replaying events from `RuntimeEventStore` after a process restart. |
| [`event_subscription.rs`](https://github.com/lazhenyi/behest/blob/main/examples/event_subscription.rs) | Live fan-out via `RuntimeSubscriptionHub` with replay-then-live semantics. |

### Context and RAG

| Example | What it shows |
|---|---|
| [`context_pipeline.rs`](https://github.com/lazhenyi/behest/blob/main/examples/context_pipeline.rs) | A `ContextPipeline` with static, function, and RAG adapters. |
| [`rag_basic.rs`](https://github.com/lazhenyi/behest/blob/main/examples/rag_basic.rs) | The RAG context adapter with Qdrant or Tantivy. |

### Composable runtime

| Example | What it shows |
|---|---|
| [`composable_runtime.rs`](https://github.com/lazhenyi/behest/blob/main/examples/composable_runtime.rs) | The `Extensions` facade, `FactoryRegistry`, and `default_factory_registry()`. |
| [`hot_reload.rs`](https://github.com/lazhenyi/behest/blob/main/examples/hot_reload.rs) | Drain-aware replace: swapping a chat provider at runtime. |

### Configuration

| Example | What it shows |
|---|---|
| [`config_from_toml.rs`](https://github.com/lazhenyi/behest/blob/main/examples/config_from_toml.rs) | Loading `behest.toml` with env overrides. |
| [`hello_config.rs`](https://github.com/lazhenyi/behest/blob/main/examples/hello_config.rs) | The minimum `AgentConfig` setup. |
| [`agent_registry.rs`](https://github.com/lazhenyi/behest/blob/main/examples/agent_registry.rs) | Defining named `AgentDefinition` entries and routing by name. |

### Misc

| Example | What it shows |
|---|---|
| [`snapshot_compaction.rs`](https://github.com/lazhenyi/behest/blob/main/examples/snapshot_compaction.rs) | Resuming a run from a snapshot after a process crash. |
| [`token_estimation.rs`](https://github.com/lazhenyi/behest/blob/main/examples/token_estimation.rs) | The token-estimation heuristics. |

## How to run

```bash
git clone https://github.com/lazhenyi/behest
cd behest
cargo run --example provider_setup --features openai
```

All examples run on the default features unless their `Cargo.toml` entry shows a `--features` flag. Examples that touch network APIs (`real_request`, `run_streaming`, `event_subscription`) require the relevant provider or queue feature to be enabled.

## Reading order for new users

:::callout{type=tip}
1. **provider_setup** — the smallest possible end-to-end.
2. **tool_registry** — adds a tool.
3. **run_streaming** — sees the event stream.
4. **context_pipeline** — composes context with a function adapter.
5. **composable_runtime** — meets the new abstractions.
6. **hot_reload** — replaces a provider while a run is in flight.
:::
