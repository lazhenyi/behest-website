# API Reference

This document provides a quick reference to the main types and traits in behest.

## Core Traits

### ChatProvider

Trait for implementing chat model providers:

```rust
#[async_trait]
pub trait ChatProvider: Send + Sync {
    fn id(&self) -> ProviderId;
    fn capabilities(&self) -> ProviderCapabilities;
    async fn complete(&self, request: ChatRequest) -> ProviderResult<ChatResponse>;
    async fn stream(&self, request: ChatRequest) -> ProviderResult<ChatStream> {
        // Default implementation that falls back to complete()
    }
}
```

### EmbeddingProvider

Trait for implementing embedding providers:

```rust
#[async_trait]
pub trait EmbeddingProvider: Send + Sync {
    fn id(&self) -> ProviderId;
    async fn embed(&self, request: EmbeddingRequest) -> ProviderResult<EmbeddingResponse>;
}
```

### Tool

Trait for implementing tools:

```rust
#[async_trait]
pub trait Tool: Send + Sync {
    fn name(&self) -> &str;
    fn description(&self) -> &str;
    fn parameters(&self) -> &Value;
    fn read_only(&self) -> bool;
    fn concurrency_safe(&self) -> bool;
    async fn execute(&self, args: Value) -> ToolResult<Value>;
}
```

## Core Types

### ChatRequest

Request for chat completion:

```rust
pub struct ChatRequest {
    pub model: ModelName,
    pub messages: Vec<Message>,
    pub tools: Option<Vec<ToolDefinition>>,
    pub response_format: Option<ResponseFormat>,
    pub stream: bool,
    // ... more fields
}

impl ChatRequest {
    pub fn new(model: ModelName) -> Self;
    pub fn with_message(self, message: Message) -> Self;
    pub fn with_user_text(self, text: &str) -> Self;
    pub fn with_system_text(self, text: &str) -> Self;
    pub fn with_tool(self, tool: ToolDefinition) -> Self;
}
```

### ChatResponse

Response from chat completion:

```rust
pub struct ChatResponse {
    pub provider: ProviderId,
    pub model: ModelName,
    pub message: Message,
    pub finish_reason: FinishReason,
    pub usage: Option<Usage>,
    pub raw: Option<Value>,
}
```

### Message

Chat message:

```rust
pub struct Message {
    pub role: Role,
    pub content: Content,
    pub tool_calls: Option<Vec<ToolCall>>,
    pub tool_call_id: Option<String>,
}

impl Message {
    pub fn system_text(text: &str) -> Self;
    pub fn user_text(text: &str) -> Self;
    pub fn assistant_text(text: &str) -> Self;
    pub fn tool_result(call_id: &str, result: Value) -> Self;
}
```

### ToolCall

Tool call from provider:

```rust
pub struct ToolCall {
    pub id: String,
    pub name: String,
    pub arguments: Value,
}

impl ToolCall {
    pub fn new(id: &str, name: &str, arguments: Value) -> Self;
}
```

### FunctionTool

Concrete tool implementation:

```rust
pub struct FunctionTool {
    name: String,
    description: String,
    parameters: Value,
    handler: Box<dyn Fn(Value) -> BoxFuture<'static, ToolResult<Value>> + Send + Sync>,
    read_only: bool,
    concurrency_safe: bool,
}

impl FunctionTool {
    pub fn new<F, Fut>(
        name: &str,
        description: &str,
        parameters: Value,
        handler: F,
    ) -> Self
    where
        F: Fn(Value) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = ToolResult<Value>> + Send + 'static;

    pub fn read_only(self) -> Self;
    pub fn concurrency_safe(self) -> Self;
}
```

### ToolRegistry

Registry for managing tools:

```rust
pub struct ToolRegistry {
    tools: HashMap<String, Box<dyn Tool>>,
}

impl ToolRegistry {
    pub fn new() -> Self;
    pub fn register(&self, tool: impl Tool + 'static);
    pub async fn execute(&self, call: &ToolCall) -> ToolResult<Value>;
    pub fn get(&self, name: &str) -> Option<&dyn Tool>;
    pub fn list(&self) -> Vec<&str>;
}
```

### ProviderRegistry

Registry for managing providers:

```rust
pub struct ProviderRegistry {
    chat_providers: HashMap<ProviderId, Box<dyn ChatProvider>>,
    embedding_providers: HashMap<ProviderId, Box<dyn EmbeddingProvider>>,
}

impl ProviderRegistry {
    pub fn new() -> Self;
    pub fn register_chat(&self, provider: impl ChatProvider + 'static);
    pub fn register_embedding(&self, provider: impl EmbeddingProvider + 'static);
    pub async fn complete(
        &self,
        provider_id: &ProviderId,
        request: ChatRequest,
    ) -> ProviderResult<ChatResponse>;
}
```

### AgentRuntime

Main runtime for executing agent loops:

```rust
pub struct AgentRuntime {
    // Internal fields
}

impl AgentRuntime {
    pub async fn new(config: AgentConfig) -> Result<Self>;
    pub async fn run(&self, request: RunRequest) -> Result<RunResponse>;
    pub async fn complete(&self, request: ChatRequest) -> Result<ChatResponse>;
}
```

### AgentConfig

Configuration for the agent runtime:

```rust
pub struct AgentConfig {
    // Internal fields
}

impl AgentConfig {
    pub fn builder() -> AgentConfigBuilder;
    pub async fn into_runtime(self) -> Result<AgentRuntime>;
}

pub struct AgentConfigBuilder {
    // Internal fields
}

impl AgentConfigBuilder {
    pub fn with_file(self, path: &str) -> Result<Self>;
    pub fn with_env(self, prefix: &str) -> Result<Self>;
    pub fn with_provider(self, name: &str, config: ProviderConfig) -> Self;
    pub fn with_storage(self, config: StorageConfig) -> Self;
    pub fn with_runtime(self, config: RuntimeConfig) -> Self;
    pub fn build(self) -> Result<AgentConfig>;
}
```

## Enums

### Role

Message role:

```rust
pub enum Role {
    System,
    User,
    Assistant,
    Tool,
}
```

### FinishReason

Reason for finishing generation:

```rust
pub enum FinishReason {
    Stop,
    Length,
    ToolCalls,
    ContentFilter,
    Other(String),
}
```

### Content

Message content:

```rust
pub enum Content {
    Text(String),
    Parts(Vec<ContentPart>),
    None,
}
```

## Prelude

The prelude module re-exports commonly used types:

```rust
use behest::prelude::*;

// This imports:
// - ChatProvider, EmbeddingProvider
// - ChatRequest, ChatResponse
// - Message, Role, Content
// - ToolCall, FunctionTool, ToolRegistry
// - ProviderRegistry, ProviderId
// - AgentRuntime, AgentConfig
// - Error, Result
// - ... and more
```

## See Also

- [Getting Started](getting-started.md) - Basic usage
- [Tools](tools.md) - Tool implementation
- [Providers](providers.md) - Provider implementation
- [Error Handling](error-handling.md) - Error types
