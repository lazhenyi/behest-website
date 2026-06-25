# API 参考

本文档提供了 behest 中主要类型和 traits 的快速参考。

## 核心 Traits

### ChatProvider

实现聊天模型提供商的 trait：

```rust
#[async_trait]
pub trait ChatProvider: Send + Sync {
    fn id(&self) -> ProviderId;
    fn capabilities(&self) -> ProviderCapabilities;
    async fn complete(&self, request: ChatRequest) -> ProviderResult<ChatResponse>;
    async fn stream(&self, request: ChatRequest) -> ProviderResult<ChatStream> {
        // 默认实现，回退到 complete()
    }
}
```

### EmbeddingProvider

实现嵌入提供商的 trait：

```rust
#[async_trait]
pub trait EmbeddingProvider: Send + Sync {
    fn id(&self) -> ProviderId;
    async fn embed(&self, request: EmbeddingRequest) -> ProviderResult<EmbeddingResponse>;
}
```

### Tool

实现工具的 trait：

```rust
#[async_trait]
pub trait Tool: Send + Sync {
    fn name(&self) -> &str;
    fn description(&self) -> &str;
    fn parameters_schema(&self) -> Value;
    fn is_read_only(&self) -> bool;
    fn is_concurrency_safe(&self) -> bool;
    async fn execute(&self, arguments: Value) -> ToolResult<ToolOutput>;
}
```

## 核心类型

### ChatRequest

聊天完成请求：

```rust
pub struct ChatRequest {
    pub model: ModelName,
    pub messages: Vec<Message>,
    pub tools: Option<Vec<ToolSpec>>,
    pub response_format: Option<ResponseFormat>,
    pub stream: bool,
    // ... 更多字段
}

impl ChatRequest {
    pub fn new(model: ModelName) -> Self;
    pub fn with_message(self, message: Message) -> Self;
    pub fn with_user_text(self, text: &str) -> Self;
    pub fn with_system_text(self, text: &str) -> Self;
    pub fn with_tool(self, tool: ToolSpec) -> Self;
}
```

### ChatResponse

聊天完成响应：

```rust
pub struct ChatResponse {
    pub provider: ProviderId,
    pub model: ModelName,
    pub message: Message,
    pub finish_reason: FinishReason,
    pub usage: Option<TokenUsage>,
    pub raw: Option<Value>,
}
```

### Message

聊天消息：

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

来自提供商的工具调用：

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

具体工具实现：

```rust
pub struct FunctionTool<F> {
    name: String,
    description: String,
    parameters_schema: Value,
    handler: F,
    read_only: bool,
    concurrency_safe: bool,
}

impl<F, Fut> FunctionTool<F>
where
    F: Fn(Value) -> Fut + Send + Sync + 'static,
    Fut: Future<Output = ToolResult<Value>> + Send + 'static,
{
    pub fn new(
        name: impl Into<String>,
        description: impl Into<String>,
        parameters_schema: Value,
        handler: F,
    ) -> Self;

    pub fn read_only(self) -> Self;
    pub fn concurrency_safe(self) -> Self;
}
```

### ToolRegistry

管理工具的注册表：

```rust
pub struct ToolRegistry {
    tools: HashMap<String, Box<dyn Tool>>,
}

impl ToolRegistry {
    pub fn new() -> Self;
    pub fn register(&self, tool: impl Tool + 'static);
    pub async fn execute(&self, call: &ToolCall) -> ToolResult<ToolOutput>;
    pub fn get(&self, name: &str) -> Option<&dyn Tool>;
    pub fn list(&self) -> Vec<String>;
    pub fn len(&self) -> usize;
    pub fn is_empty(&self) -> bool;
}
```

### ProviderRegistry

管理提供商的注册表：

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

执行 agent 循环的主运行时：

```rust
pub struct AgentRuntime {
    // 内部字段
}

impl AgentRuntime {
    pub async fn new(config: AgentConfig) -> Result<Self>;
    pub async fn run(&self, request: RunRequest) -> Result<RunResponse>;
    pub async fn complete(&self, request: ChatRequest) -> Result<ChatResponse>;
    pub fn subscribe(&self) -> broadcast::Receiver<AgentEvent>;
    pub fn policy(&self) -> &RuntimePolicy;
}
```

### AgentConfig

Agent 运行时的配置：

```rust
pub struct AgentConfig {
    // 内部字段
}

impl AgentConfig {
    pub fn builder() -> AgentConfigBuilder;
    pub async fn into_runtime(self) -> Result<AgentRuntime>;
    pub fn validate(&self) -> Result<()>;
}

pub struct AgentConfigBuilder {
    // 内部字段
}

impl AgentConfigBuilder {
    pub fn with_file(self, path: &str) -> Result<Self>;
    pub fn with_env(self, prefix: &str) -> Result<Self>;
    pub fn with_provider(self, name: impl Into<String>, config: ProviderConfig) -> Self;
    pub fn with_storage(self, config: StoreConfig) -> Self;
    pub fn with_runtime(self, config: RuntimeConfig) -> Self;
    pub fn build(self) -> Result<AgentConfig>;
}
```

## 枚举

### Role

消息角色：

```rust
pub enum Role {
    System,
    User,
    Assistant,
    Tool,
}
```

### FinishReason

完成生成的原因：

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

消息内容：

```rust
pub enum Content {
    Text(String),
    Parts(Vec<ContentPart>),
    None,
}
```

## Prelude

Prelude 模块重新导出常用类型：

```rust
use behest::prelude::*;

// 这导入了：
// - ChatProvider, EmbeddingProvider
// - ChatRequest, ChatResponse
// - Message, Role, Content
// - ToolCall, FunctionTool, ToolRegistry
// - ProviderRegistry, ProviderId
// - AgentRuntime, AgentConfig
// - Error, Result
// - ... 以及更多
```

## 另请参阅

- [快速入门](getting-started.md) - 基本用法
- [工具](tools.md) - 工具实现
- [提供商](providers.md) - 提供商实现
- [错误处理](error-handling.md) - 错误类型
