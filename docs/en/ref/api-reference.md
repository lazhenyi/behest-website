---
title: API Reference
description: Index of every public type, trait, and function in behest.
group: ref
order: 1
summary: Index of every public type, trait, and function.
related:
  - ref/development
  - intro/overview
---

# API Reference

> Index of every public type, trait, and function.

This page is a quick-reference index. Each entry links to its full documentation page.

## Core traits

| Trait | Page |
|---|---|
| `ChatProvider` | [ChatProvider](../providers/chat-provider.md) |
| `EmbeddingProvider` | [EmbeddingProvider](../providers/embedding-provider.md) |
| `Tool` | [Tool Trait](../tools/tool-trait.md) |
| `Component` | [Component Trait](../core/component-trait.md) |
| `ContextAdapter` | [ContextAdapter](../tools/context-adapter.md) |
| `SessionStore` | [SessionStore](../storage/session-store.md) |
| `EmbeddingStore` | [EmbeddingStore](../storage/embedding-store.md) |
| `ExecutionStore` | [ExecutionStore](../storage/execution-store.md) |
| `ArtifactStore` | [ArtifactStore](../storage/artifact-store.md) |
| `RunStore` | [RunStore](../storage/run-store.md) |
| `RuntimeEventStore` | [RuntimeEventStore](../events/runtime-event-store.md) |
| `RuntimeStreamAdapter` | [RuntimeStreamAdapter](../events/runtime-stream-adapter.md) |
| `SessionDataStore` | [SessionDataStore](../events/session-data-store.md) |
| `SnapshotStore` | [SnapshotStore](../runtime/snapshot-store.md) |
| `EventPublisher` | [Queue Publishers](../config/queue-publishers.md) |

## Core types

| Type | Page |
|---|---|
| `ExtensionPoint<T>` | [ExtensionPoint](../core/extension-point.md) |
| `Extensions` | [Extensions Facade](../core/extensions-facade.md) |
| `ComponentRegistry` | [ComponentRegistry](../core/component-registry.md) |
| `FactoryRegistry` | [FactoryRegistry](../core/factory-registry.md) |
| `AgentRuntime` | [AgentRuntime](../runtime/agent-runtime.md) |
| `ModelRouter` | [ModelRouter](../runtime/model-router.md) |
| `ContextPipeline` | [ContextPipeline](../runtime/context-pipeline.md) |
| `CompactionService` | [CompactionService](../runtime/compaction-service.md) |
| `InputAdmission` | [InputAdmission](../runtime/input-admission.md) |
| `SessionGate` | [SessionGate](../runtime/session-gate.md) |
| `DoomLoopDetector` | [DoomLoopDetector](../runtime/doom-loop-detector.md) |
| `BackgroundJobPool` | [BackgroundJobPool](../runtime/background-job-pool.md) |
| `RuntimeInvocation` | [RuntimeInvocation](../events/runtime-invocation.md) |
| `RuntimeSubscriptionHub` | [RuntimeSubscriptionHub](../events/runtime-subscription-hub.md) |
| `RuntimeEventBridge` | [RuntimeEventBridge](../events/runtime-event-bridge.md) |
| `StreamAccumulator` | [StreamAccumulator](../runtime/stream-accumulator.md) |
| `RunState` | [RunState](../runtime/run-state.md) |
| `RuntimePolicy` | [RuntimePolicy](../runtime/runtime-policy.md) |
| `RuntimeStore` | [RuntimeStore](../storage/runtime-store.md) |
| `ProviderRegistry` | [ProviderRegistry](../providers/provider-registry.md) |
| `ToolRegistry` | [ToolRegistry](../tools/tool-registry.md) |
| `ToolRuntime` | [ToolRuntime](../tools/tool-runtime.md) |
| `ScopedToolRegistry` | [ScopedToolRegistry](../tools/scoped-tool-registry.md) |
| `AgentConfig` | [AgentConfig](../config/agent-config.md) |
| `ReplaceToken` | [Drain-aware Replace](../core/drain-aware-replace.md) |

## Data types

| Type | Page |
|---|---|
| `Message` | [Message Types](../providers/message-types.md) |
| `ContentPart` | [Message Types](../providers/message-types.md) |
| `ToolCall` | [Message Types](../providers/message-types.md) |
| `ToolSpec` | [Message Types](../providers/message-types.md) |
| `FinishReason` | [Message Types](../providers/message-types.md) |
| `TokenUsage` | [Message Types](../providers/message-types.md) |
| `AgentEvent` | [AgentEvent](../events/agent-event.md) |
| `RunRequest` | [AgentRuntime](../runtime/agent-runtime.md) |
| `RunOutput` | [AgentRuntime](../runtime/agent-runtime.md) |
| `Snapshot` | [SnapshotStore](../runtime/snapshot-store.md) |
| `Session` | [SessionStore](../storage/session-store.md) |
| `MessageRecord` | [SessionStore](../storage/session-store.md) |
| `CompactionMeta` | [SessionStore](../storage/session-store.md) |
| `ToolExecution` | [ExecutionStore](../storage/execution-store.md) |
| `UsageRecord` | [ExecutionStore](../storage/execution-store.md) |
| `SessionStats` | [ExecutionStore](../storage/execution-store.md) |
| `Artifact` | [ArtifactStore](../storage/artifact-store.md) |
| `EmbeddingRecord` | [EmbeddingStore](../storage/embedding-store.md) |
| `ProviderConfig` | [ProviderConfig](../providers/provider-config.md) |
| `ProviderHttpConfig` | [ProviderConfig](../providers/provider-config.md) |

## See also

- **[Overview](../intro/overview.md)** — the high-level picture.
- **[Development](development.md)** — build, test, contribute.
