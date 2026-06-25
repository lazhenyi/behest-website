# behest

**Rust-native building blocks for production AI agent runtimes**

[![CI](https://github.com/lazhenyi/behest/actions/workflows/ci.yml/badge.svg)](https://github.com/lazhenyi/behest/actions/workflows/ci.yml)
[![License: MIT OR Apache-2.0](https://img.shields.io/badge/license-MIT%20OR%20Apache--2.0-blue.svg)](#license)

---

## What this is

`behest` provides provider-neutral contracts for chat, streaming, tool calling, embeddings, runtime execution, storage, queues, RAG, observability, and optional gRPC serving.

It is designed for systems that need explicit control over model providers, tool execution, persistence, and operational boundaries — instead of opaque "agent framework" magic.

> Status: early foundation crate. Public APIs are intentionally compact, strongly typed, and documented.

## Why behest

**behest** /bɪˈhest/ — *n.* a person's orders or command.

> At the **behest** of the user, the agent acts.

The core of an agent runtime is not "autonomous consciousness" but controlled delegation: the user issues an intent, and the system composes context, invokes models, executes tools, persists state, publishes events within explicit boundaries — auditable, recoverable, constrainable, and replaceable.

The name `behest` deliberately avoids inflated metaphors like "brain / cognition / intelligence". It only states an engineering fact:

> tool-calling, streaming, memory, queue, RAG, snapshot — all mechanisms exist because someone gave an order.

## Design goals

- **Rust-native first**: typed APIs, explicit errors, no hidden runtime assumptions.
- **Provider-neutral core**: OpenAI, Anthropic, local models, proxies, or internal providers can implement the same contracts.
- **Streaming-first runtime**: the agent loop is designed around streamed model events, with non-streaming fallback where appropriate.
- **Typed tool boundary**: tools are described by JSON Schema and executed through explicit registries.
- **Pluggable persistence**: memory by default, external stores behind feature flags.
- **Operational surface**: event publishing, snapshots, session gates, compaction, retry policy, and optional gRPC server.
- **Small public API**: foundation primitives over framework sprawl.

## Quick start

```toml
[dependencies]
behest = "0.3"
```

Create a provider-neutral chat request:

```rust
use behest::prelude::*;

let request = ChatRequest::new(ModelName::new("example-model"))
    .with_message(Message::system_text("You are concise."))
    .with_user_text("Summarize this project in one sentence.");
```

Register providers in a registry and route requests:

```rust
use behest::prelude::*;

let registry = ProviderRegistry::new();
let provider_id = ProviderId::new("my-provider");

// Register a ChatProvider implementation first.
// registry.register_chat(my_provider);

// Then route through the neutral registry.
// let response = registry.complete(&provider_id, request).await?;
```

## What's inside

| Area | Capability |
|---|---|
| Provider contracts | `ChatProvider`, `EmbeddingProvider`, request / response models, stream events, provider capabilities |
| Provider registry | In-memory routing for chat and embedding providers |
| Chat model types | messages, content parts, tool calls, response formats, token usage, finish reasons |
| Tool runtime | `Tool`, `FunctionTool`, `ExternalTool`, `ToolRegistry`, schema generation, execution dispatch |
| Agent runtime | context building, model calls, tool loop, session persistence, event emission |
| Runtime safety | session gate, runtime policy, input admission, doom-loop detection, tool output truncation |
| Storage | memory stores, Redis, SQLx, MongoDB, SurrealDB, object storage, Qdrant embeddings |
| Context and RAG | context adapters, static/function adapters, optional RAG adapter |
| Queues | optional event publishing through NATS or Redis Streams |
| Configuration | builder, file-based config, environment variable loading, secret indirection |
| Server | optional gRPC server binary behind `server` feature |
| Observability | tracing and optional OpenTelemetry integration |

## Documentation

- [Getting Started](getting-started.md) - Installation and basic usage
- [Providers](providers.md) - Provider adapters and custom implementations
- [Tools](tools.md) - Tool definition and execution
- [Sessions](sessions.md) - Session management and conversation state
- [Storage](storage.md) - Storage backends and persistence
- [Configuration](configuration.md) - Configuration options and layers
- [Error Handling](error-handling.md) - Typed error categories
- [Examples](examples.md) - Practical code examples
- [Architecture](architecture.md) - Runtime model and design
- [RAG](rag.md) - Retrieval-Augmented Generation
- [Events](events.md) - Event system and observability
- [Feature Flags](features.md) - Available feature flags
- [API Reference](api-reference.md) - Core types and traits
- [Development](development.md) - Development setup and contribution guide

## License

Licensed under either of:

- Apache License, Version 2.0
- MIT license

at your option.
