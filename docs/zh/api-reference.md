# API 参考

本文档提供 behest 主要类型和 trait 的快速参考。

## 核心 Trait

### ChatProvider

实现聊天模型提供商的 trait：

```rust
#[async_trait]
pub trait ChatProvider: Send + Sync {
    fn id(&self) -> ProviderId;
    fn capabilities(&self) -> ProviderCapabilities;
    async fn complete(&self, request: ChatRequest) -> ProviderResult<ChatResponse>;
    async fn stream(&self, request: ChatRequest) -> ProviderResult<ChatStream> {
        // 默认实现：返回 ProviderError::Unsupported
    }
}
```

### EmbeddingProvider

实现嵌入提供商的 trait：

```rust
#[async_trait]
pub trait EmbeddingProvider: Send + Sync {
    fn id(&self) -> ProviderId;
    fn capabilities(&self) -> ProviderCapabilities;
    async fn embed(&self, request: EmbeddingRequest) -> ProviderResult<EmbeddingResponse>;
}
```

### Tool

实现可执行工具的 trait：

```rust
#[async_trait]
pub trait Tool: Send + Sync {
    fn name(&self) -> &str;
    fn description(&self) -> &str;
    fn parameters_schema(&self) -> Value;
    async fn execute(&self, arguments: Value) -> ToolResult<ToolOutput>;
    fn is_read_only(&self) -> bool { false }
    fn is_concurrency_safe(&self) -> bool { false }
    fn to_spec(&self) -> ToolSpec;
}
```

## 核心类型

### ChatRequest

聊天补全请求：

```rust
pub struct ChatRequest {
    pub model: ModelName,
    pub messages: Vec<Message>,
    pub tools: Vec<ToolSpec>,
    pub tool_choice: ToolChoice,
    pub response_format: Option<ResponseFormat>,
    pub temperature: Option<f32>,
    pub top_p: Option<f32>,
    pub max_output_tokens: Option<u32>,
    pub stop: Vec<String>,
    pub metadata: Value,
}

impl ChatRequest {
    pub fn new(model: ModelName) -> Self;
    pub fn with_message(self, message: Message) -> Self;
    pub fn with_user_text(self, text: impl Into<String>) -> Self;
    pub fn with_tool(self, tool: ToolSpec) -> Self;
}
```

### ChatResponse

聊天补全响应：

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

聊天消息（枚举，非结构体）：

```rust
#[non_exhaustive]
pub enum Message {
    System { content: Vec<ContentPart> },
    User { content: Vec<ContentPart> },
    Assistant { content: Vec<ContentPart>, tool_calls: Vec<ToolCall> },
    Tool { tool_call_id: String, name: String, content: Vec<ContentPart> },
}

impl Message {
    pub fn system_text(text: impl Into<String>) -> Self;
    pub fn user_text(text: impl Into<String>) -> Self;
    pub fn assistant_text(text: impl Into<String>) -> Self;
    pub fn tool_text(tool_call_id: impl Into<String>, name: impl Into<String>, text: impl Into<String>) -> Self;
}
```

### ContentPart

聊天消息中的单个内容片段：

```rust
#[non_exhaustive]
pub enum ContentPart {
    Text { text: String },
    Json { value: Value },
    ImageUrl { url: String, mime_type: Option<String> },
}

impl ContentPart {
    pub fn text(text: impl Into<String>) -> Self;
    pub fn json(value: Value) -> Self;
    pub fn image_url(url: impl Into<String>, mime_type: Option<String>) -> Self;
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

### ToolSpec

发送给提供商的工具定义：

```rust
pub struct ToolSpec {
    pub name: String,
    pub description: String,
    pub parameters: Value,
}

impl ToolSpec {
    pub fn new(name: &str, description: &str, parameters: Value) -> Self;
}
```

### ToolOutput

工具执行产生的输出：

```rust
pub struct ToolOutput {
    pub value: Value,
}

impl ToolOutput {
    pub fn new(value: Value) -> Self;
    pub fn text(text: impl Into<String>) -> Self;
    pub fn error(message: impl Into<String>) -> Self;
}
```

### FunctionTool

基于闭包的具体工具实现：

```rust
pub struct FunctionTool<F> { /* 字段 */ }

impl<F, Fut> FunctionTool<F>
where
    F: Fn(Value) -> Fut + Send + Sync + 'static,
    Fut: Future<Output = ToolResult<Value>> + Send + 'static,
{
    pub fn new(name: impl Into<String>, description: impl Into<String>, parameters_schema: Value, handler: F) -> Self;
    pub fn read_only(self) -> Self;
    pub fn concurrency_safe(self) -> Self;
}
```

### ExternalTool

外部工具系统的仅模式占位符（MCP、HTTP 工具服务器）。调用 `execute` 始终返回 `ToolError::NotImplemented`。

```rust
pub struct ExternalTool { /* 字段 */ }

impl ExternalTool {
    pub fn new(name: impl Into<String>, description: impl Into<String>, parameters_schema: Value) -> Self;
    pub fn with_endpoint(self, endpoint: impl Into<String>) -> Self;
    pub fn endpoint(&self) -> Option<&str>;
    pub fn read_only(self) -> Self;
    pub fn concurrency_safe(self) -> Self;
}
```

### ToolRegistry

工具注册表，使用内部可变性（`RwLock`）：

```rust
pub struct ToolRegistry { /* 字段 */ }

impl ToolRegistry {
    pub fn new() -> Self;
    pub fn register<T: Tool + 'static>(&self, tool: T) -> Option<Arc<dyn Tool>>;
    pub fn register_arc(&self, tool: Arc<dyn Tool>) -> Option<Arc<dyn Tool>>;
    pub fn unregister(&self, name: &str) -> Option<Arc<dyn Tool>>;
    pub fn get(&self, name: &str) -> Option<Arc<dyn Tool>>;
    pub fn names(&self) -> Vec<String>;
    pub fn len(&self) -> usize;
    pub fn is_empty(&self) -> bool;
    pub fn specs(&self) -> Vec<ToolSpec>;
    pub async fn execute(&self, call: &ToolCall) -> ToolResult<ToolOutput>;
    pub async fn execute_to_message(&self, call: &ToolCall) -> ToolResult<Message>;
}
```

### ScopedToolRegistry

LIFO 作用域工具注册表，具有影子栈语义。高层作用域中的工具会遮蔽低层作用域中同名工具：

```rust
pub struct ScopedToolRegistry { /* 字段 */ }

impl ScopedToolRegistry {
    pub fn new(base: ToolRegistry) -> Self;
    pub fn push_scope(&self) -> ScopeId;
    pub fn pop_scope(&self, id: ScopeId) -> bool;
    pub fn register_in_scope<T: Tool + 'static>(&self, scope: ScopeId, tool: T) -> Result<Option<Arc<dyn Tool>>, T>;
    pub fn get(&self, name: &str) -> Option<Arc<dyn Tool>>;
    pub fn specs(&self) -> Vec<ToolSpec>;
    pub fn scope_depth(&self) -> usize;
    pub fn base(&self) -> &ToolRegistry;
    pub fn base_mut(&mut self) -> &mut ToolRegistry;
    pub async fn execute(&self, call: &ToolCall) -> ToolResult<ToolOutput>;
    pub fn push_scope_guarded(self: &Arc<Self>) -> ScopeGuard;
}

pub struct ScopeGuard { /* 字段 */ }

impl ScopeGuard {
    pub fn id(&self) -> ScopeId;
    pub fn into_inner(self) -> Arc<ScopedToolRegistry>;
}
```

### ProviderRegistry

提供商注册表，使用 `&mut self` 进行注册：

```rust
pub struct ProviderRegistry { /* 字段 */ }

impl ProviderRegistry {
    pub fn new() -> Self;
    pub fn register_chat<P: ChatProvider + 'static>(&mut self, provider: P) -> Option<Arc<dyn ChatProvider>>;
    pub fn register_chat_arc(&mut self, provider: Arc<dyn ChatProvider>) -> Option<Arc<dyn ChatProvider>>;
    pub fn register_embedding<P: EmbeddingProvider + 'static>(&mut self, provider: P) -> Option<Arc<dyn EmbeddingProvider>>;
    pub fn register_embedding_arc(&mut self, provider: Arc<dyn EmbeddingProvider>) -> Option<Arc<dyn EmbeddingProvider>>;
    pub fn chat(&self, id: &ProviderId) -> Option<Arc<dyn ChatProvider>>;
    pub fn embedding(&self, id: &ProviderId) -> Option<Arc<dyn EmbeddingProvider>>;
    pub fn chat_ids(&self) -> impl Iterator<Item = &ProviderId>;
    pub fn embedding_ids(&self) -> impl Iterator<Item = &ProviderId>;
    pub async fn complete(&self, provider_id: &ProviderId, request: ChatRequest) -> ProviderResult<ChatResponse>;
    pub async fn stream(&self, provider_id: &ProviderId, request: ChatRequest) -> ProviderResult<ChatStream>;
    pub async fn embed(&self, provider_id: &ProviderId, request: EmbeddingRequest) -> ProviderResult<EmbeddingResponse>;
}
```

### AgentRuntime

执行 agent 循环的主运行时。通过显式依赖构造（而非从 config 构造）：

```rust
pub struct AgentRuntime { /* 字段 */ }

impl AgentRuntime {
    pub fn new(
        providers: ProviderRegistry,
        context: ContextPipeline,
        tools: ToolRuntime,
        store: Arc<RuntimeStore>,
        policy: RuntimePolicy,
    ) -> Self;

    pub fn with_background_jobs(self, pool: Arc<BackgroundJobPool>) -> Self;
    pub fn with_snapshot_store(self, snapshot_store: Arc<dyn SnapshotStore>) -> Self;
    pub fn session_gate(&self) -> &SessionGate;
    pub fn subscribe(&self) -> broadcast::Receiver<AgentEvent>;
    pub fn policy(&self) -> &RuntimePolicy;
    pub fn tools(&self) -> &ToolRuntime;
    pub fn providers(&self) -> &ProviderRegistry;
    pub fn context(&self) -> &ContextPipeline;
    pub fn store(&self) -> &Arc<RuntimeStore>;
    pub fn compaction(&self) -> &CompactionService;
    pub fn sessions(&self) -> &dyn SessionStore;
    pub fn executions(&self) -> &dyn ExecutionStore;
    pub fn runs(&self) -> &dyn RunStore;
    pub fn embeddings(&self) -> Option<&dyn EmbeddingStore>;
    pub fn artifacts(&self) -> Option<&dyn ArtifactStore>;

    pub async fn run(&self, request: RunRequest) -> RuntimeResult<RunOutput>;
    pub async fn resume(&self, run_id: RunId) -> RuntimeResult<RunOutput>;
}

pub struct RunOutput {
    pub run_id: RunId,
    pub session_id: Uuid,
    pub iterations: usize,
    pub finish_reason: FinishReason,
    pub total_usage: TokenUsage,
}
```

### AgentDefinition

具有权限和系统提示的命名 agent 定义：

```rust
pub struct AgentDefinition {
    pub name: String,
    pub description: String,
    pub mode: AgentMode,
    pub system_prompt: String,
    pub hidden: bool,
    pub permissions: Vec<PermissionRule>,
    pub model: Option<ModelName>,
    pub max_steps: Option<usize>,
}

impl AgentDefinition {
    pub fn primary(name: impl Into<String>, description: impl Into<String>, system_prompt: impl Into<String>) -> Self;
    pub fn subagent(name: impl Into<String>, description: impl Into<String>, system_prompt: impl Into<String>) -> Self;
    pub fn hidden(self) -> Self;
    pub fn with_permissions(self, permissions: Vec<PermissionRule>) -> Self;
    pub fn with_model(self, model: ModelName) -> Self;
    pub fn with_max_steps(self, steps: usize) -> Self;
}
```

### AgentRegistry

命名 agent 注册表：

```rust
pub struct AgentRegistry { /* 字段 */ }

impl AgentRegistry {
    pub fn new() -> Self;
    pub fn register(&mut self, agent: AgentDefinition);
    pub fn set_default(&mut self, name: impl Into<String>);
    pub fn get(&self, name: &str) -> Option<&AgentDefinition>;
    pub fn list(&self) -> Vec<&AgentDefinition>;
    pub fn list_selectable(&self) -> Vec<&AgentDefinition>;
    pub fn default_agent(&self) -> Option<&AgentDefinition>;
    pub fn is_empty(&self) -> bool;
    pub fn len(&self) -> usize;
}
```

### RuntimePolicy

具有限制、超时和压缩配置的执行策略：

```rust
pub struct RuntimePolicy {
    pub max_iterations: usize,          // 默认: 10
    pub max_tokens: Option<usize>,      // 默认: None（无限制）
    pub max_tool_concurrency: usize,    // 默认: 4
    pub tool_timeout: Duration,         // 默认: 30s
    pub provider_timeout: Duration,     // 默认: 60s
    pub continue_on_tool_failure: bool, // 默认: true
    pub retry_on_provider_error: bool,  // 默认: true
    pub max_retries: usize,             // 默认: 2
    pub compaction: CompactionConfig,
    pub tool_output: ToolOutputConfig,
    pub doom_loop: DoomLoopConfig,
    pub input_admission: InputAdmissionConfig,
    pub max_output_recovery_attempts: usize, // 默认: 3
}

impl RuntimePolicy {
    pub fn new() -> Self;
    pub fn with_max_iterations(self, max_iterations: usize) -> Self;
    pub fn with_max_tokens(self, max_tokens: usize) -> Self;
    pub fn with_max_tool_concurrency(self, max_tool_concurrency: usize) -> Self;
    pub fn with_tool_timeout(self, tool_timeout: Duration) -> Self;
    pub fn with_provider_timeout(self, provider_timeout: Duration) -> Self;
    pub fn with_compaction(self, compaction: CompactionConfig) -> Self;
    pub fn with_tool_output(self, config: ToolOutputConfig) -> Self;
    pub fn with_doom_loop(self, config: DoomLoopConfig) -> Self;
    pub fn with_input_admission(self, config: InputAdmissionConfig) -> Self;
    pub fn with_max_output_recovery_attempts(self, attempts: usize) -> Self;
}
```

### CompactionConfig

自动上下文压缩的压缩配置：

```rust
pub struct CompactionConfig {
    pub auto: bool,                        // 默认: true
    pub prune: bool,                       // 默认: false
    pub buffer_tokens: usize,              // 默认: 20_000
    pub keep_tokens: usize,                // 默认: 8_000
    pub tail_turns: usize,                 // 默认: 2
    pub model: Option<ModelName>,
    pub provider: Option<ProviderId>,
    pub circuit_breaker_threshold: u32,    // 默认: 3
}
```

## 运行时事件层

### AgentEvent

agent 运行时执行期间发出的事件：

```rust
pub enum AgentEvent {
    RunStarted(RunStarted),
    ContextBuilt(ContextBuilt),
    ModelStarted(ModelStarted),
    TextDelta(TextDelta),
    ToolCallStarted(ToolCallStarted),
    ToolCallDelta(ToolCallDelta),
    ToolCallCompleted(ToolCallCompleted),
    ToolExecutionStarted(ToolExecutionStarted),
    ToolExecutionFinished(ToolExecutionFinished),
    AssistantMessageCommitted(MessageCommitted),
    ToolMessageCommitted(MessageCommitted),
    UsageRecorded(UsageRecorded),
    RunCompleted(RunCompleted),
    RunFailed(RunFailed),
    RunCancelled(RunCancelled),
    DoomLoopDetected(DoomLoopDetected),
    CompactionCircuitOpened(CompactionCircuitOpened),
}
```

### RuntimeEventEnvelope

包装 `AgentEvent` 的传输无关信封，带有可重放元数据：

```rust
pub struct RuntimeEventEnvelope {
    pub event_id: RuntimeEventId,
    pub seq: u64,
    pub run_id: RunId,
    pub session_id: Option<Uuid>,
    pub event: AgentEvent,
    pub emitted_at: DateTime<Utc>,
}
```

### RuntimeEventStore

`RuntimeEventEnvelope` 的持久化存储：

```rust
#[async_trait]
pub trait RuntimeEventStore: Send + Sync {
    async fn append(&self, event: AgentEvent) -> Result<RuntimeEventEnvelope, RuntimeEventStoreError>;
    async fn list_after(
        &self,
        run_id: RunId,
        after_seq: Option<u64>,
        limit: usize,
    ) -> Result<Vec<RuntimeEventEnvelope>, RuntimeEventStoreError>;
}
```

实现：

- `MemoryRuntimeEventStore`（默认）— 单个 `Mutex<StoreState>`，`seq` 分配、会话传播和事件插入在每次 append 中是原子的。
- `RedisRuntimeEventStore`（feature `redis`）— Redis Streams XADD/XRANGE。
- `PostgresRuntimeEventStore`（feature `sqlx-postgres`）— `runtime_events` 表，JSONB 事件负载。
- `FailingRuntimeEventStore` — 始终失败，用于测试。

### RuntimeStreamAdapter

跨类型房间的信封尽力而为实时扇出：

```rust
#[async_trait]
pub trait RuntimeStreamAdapter: Send + Sync {
    async fn publish(
        &self,
        room: RuntimeRoom,
        envelope: RuntimeEventEnvelope,
    ) -> Result<(), RuntimeStreamError>;
    async fn subscribe(
        &self,
        room: RuntimeRoom,
    ) -> Result<BoxRuntimeEventStream, RuntimeStreamError>;
}

pub enum RuntimeRoom {
    Run(RunId),
    Session(Uuid),
    Provider(ProviderId),
}
```

实现：

- `MemoryRuntimeStreamAdapter`（默认）— 每个房间一个 `tokio::sync::broadcast`。
- `RedisRuntimeStreamAdapter`（feature `redis`）— Redis Pub/Sub。
- `NatsJetStreamStreamAdapter`（feature `nats`）— 每个房间一个 JetStream 流，带有临时拉取消费者。
- `FailingRuntimeStreamAdapter` — 始终失败，用于测试。

### RuntimeSubscriptionHub

将 `RuntimeEventStore` 与 `RuntimeStreamAdapter` 配对：

```rust
pub struct RuntimeSubscriptionHub { /* 字段 */ }

impl RuntimeSubscriptionHub {
    pub fn new(
        event_store: Arc<dyn RuntimeEventStore>,
        stream_adapter: Arc<dyn RuntimeStreamAdapter>,
    ) -> Self;

    pub async fn subscribe_run(
        &self,
        run_id: RunId,
        after_seq: Option<u64>,
        limit: usize,
    ) -> Result<RuntimeSubscription, RuntimeSubscriptionError>;
}

pub struct RuntimeSubscription {
    pub replay: Vec<RuntimeEventEnvelope>,
    pub live: BoxRuntimeEventStream,
}
```

### RuntimeEventBridge

将事件从 `AgentRuntime` 转发到存储和适配器：

```rust
pub struct RuntimeEventBridge { /* 字段 */ }

impl RuntimeEventBridge {
    pub fn new(
        runtime: Arc<AgentRuntime>,
        event_store: Arc<dyn RuntimeEventStore>,
        stream_adapter: Arc<dyn RuntimeStreamAdapter>,
    ) -> Self;

    pub fn spawn(self: Arc<Self>) -> RuntimeEventBridgeHandle;
}

pub struct RuntimeEventBridgeHandle { /* 字段 */ }

impl RuntimeEventBridgeHandle {
    pub fn abort(&self);
    pub fn is_finished(&self) -> bool;
    pub async fn join(self) -> Result<(), RuntimeEventBridgeError>;
}
```

### RuntimeInvocation

基于 `AgentRuntime` 的传输无关 `emit` / `on` 门面：

```rust
pub struct RuntimeInvocation { /* 字段 */ }

impl RuntimeInvocation {
    pub fn new(runtime: Arc<AgentRuntime>) -> Self;

    pub async fn emit<F, Fut>(&self, f: F) -> Result<RunOutput, InvocationError>
    where
        F: FnOnce(SessionContext, Control) -> Fut + Send,
        Fut: Future<Output = EmitRequest> + Send;

    pub async fn on<F, Fut>(
        &self,
        kind: EventKind,
        f: F,
    ) -> Result<InvocationHandle, InvocationError>
    where
        F: Fn(RuntimeEventEnvelope, Control) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = ()> + Send + 'static;
}

pub enum EventKind {
    Any,
    RunStarted,
    ContextBuilt,
    ModelStarted,
    TextDelta,
    ToolCallStarted,
    ToolCallDelta,
    ToolCallCompleted,
    ToolExecutionStarted,
    ToolExecutionFinished,
    AssistantMessageCommitted,
    ToolMessageCommitted,
    UsageRecorded,
    RunCompleted,
    RunFailed,
    RunCancelled,
    DoomLoopDetected,
    CompactionCircuitOpened,
    ChatStarted,
    ChatTextDelta,
    ChatToolCallStarted,
    ChatToolCallArgumentsDelta,
    ChatToolCallCompleted,
    ChatFinished,
}
```

## 枚举

### FinishReason

生成结束原因：

```rust
#[non_exhaustive]
pub enum FinishReason {
    Stop,
    ToolCalls,
    Length,
    ContentFilter,
    Error,
    Unknown(String),
}
```

### MessageRole

消息角色（在 store 中使用，不在 provider `Message` 中）：

```rust
pub enum MessageRole {
    System,
    User,
    Assistant,
    Tool,
}
```

### AgentMode

agent 的操作模式：

```rust
pub enum AgentMode {
    Primary,
    Subagent,
}
```

### PermissionEffect

权限规则的效果：

```rust
pub enum PermissionEffect {
    Allow,
    Deny,
    Ask,
}
```

## 错误类型

### Error（顶层）

```rust
#[non_exhaustive]
pub enum Error {
    Provider(ProviderError),
    Tool(ToolError),
    Context(ContextError),
    Storage(StorageError),
    Config(String),
}
```

### ProviderError

```rust
#[non_exhaustive]
pub enum ProviderError {
    Authentication { provider: ProviderId },
    BadRequest { provider: ProviderId, message: String },
    RateLimited { provider: ProviderId, retry_after: Option<Duration> },
    Timeout { provider: ProviderId },
    Overloaded { provider: ProviderId },
    Unsupported { provider: ProviderId, feature: String },
    Transport { provider: ProviderId, source: reqwest::Error },
    Decode { provider: ProviderId, message: String },
    Provider { provider: ProviderId, status: Option<u16>, message: String },
}
```

### ToolError

```rust
#[non_exhaustive]
pub enum ToolError {
    NotFound { name: String },
    Execution { name: String, message: String },
    InvalidArguments { name: String, message: String },
    NotImplemented { name: String },
}
```

### ContextError

```rust
#[non_exhaustive]
pub enum ContextError {
    AdapterFailed { adapter: String, message: String },
    InvalidInput { message: String },
    AdapterNotFound { adapter: String },
}
```

### StorageError

```rust
#[non_exhaustive]
pub enum StorageError {
    NotFound { id: String },
    ConnectionFailed { backend: String, message: String, source: Option<Box<dyn Error + Send + Sync>> },
    SerializationFailed { message: String, source: Option<Box<dyn Error + Send + Sync>> },
    BackendError { backend: String, message: String, source: Option<Box<dyn Error + Send + Sync>> },
    MigrationFailed { backend: String, message: String, source: Option<Box<dyn Error + Send + Sync>> },
    DataCorruption { field: String, message: String, source: Option<Box<dyn Error + Send + Sync>> },
}
```

## Token 估算

字符级 token 估算函数：

```rust
pub fn estimate_tokens(text: &str) -> usize;
pub fn estimate_content_part_tokens(part: &ContentPart) -> usize;
pub fn estimate_message_tokens(message: &Message) -> usize;
pub fn estimate_messages_tokens(messages: &[Message]) -> usize;
pub fn estimate_record_tokens(record: &MessageRecord) -> usize;
pub fn estimate_records_tokens(records: &[MessageRecord]) -> usize;
```

## 工具输出截断

```rust
pub struct ToolOutputConfig {
    pub max_lines: Option<usize>,    // 默认: Some(2000)
    pub max_bytes: Option<usize>,    // 默认: Some(51200)
    pub output_dir: Option<PathBuf>, // 默认: None
}

pub struct TruncationResult {
    pub text: String,
    pub was_truncated: bool,
    pub original_lines: usize,
    pub original_bytes: usize,
    pub saved_path: Option<PathBuf>,
}

pub fn truncate_output(output: &str, config: &ToolOutputConfig, identifier: Option<&str>) -> TruncationResult;
```

## Prelude

prelude 模块重新导出常用类型：

```rust
use behest::prelude::*;
```

这将导入：`ChatProvider`、`EmbeddingProvider`、`ChatRequest`、`ChatResponse`、`Message`、`ContentPart`、`ToolCall`、`ToolSpec`、`ToolOutput`、`FunctionTool`、`ExternalTool`、`ToolRegistry`、`ScopedToolRegistry`、`ProviderRegistry`、`ProviderId`、`ModelName`、`AgentRuntime`、`AgentDefinition`、`AgentRegistry`、`RuntimePolicy`、`CompactionConfig`、`Error`、`Result`、`ProviderError`、`ToolError`、`ContextError`、`StorageError` 等。

## 参见

- [快速开始](getting-started.md) - 基本用法
- [工具](tools.md) - 工具实现
- [提供商](providers.md) - 提供商实现
- [错误处理](error-handling.md) - 错误类型
- [事件](events.md) - 事件系统
