# Storage

behest provides a pluggable persistence layer with multiple storage backends for sessions, embeddings, artifacts, and execution records.

## Storage Traits

### SessionStore

Persists conversation sessions and message history:

```rust
use behest::prelude::*;

#[async_trait]
pub trait SessionStore: Send + Sync {
    async fn create_session(&self, session: Session) -> StoreResult<Session>;
    async fn list_sessions(&self) -> StoreResult<Vec<Session>>;
    async fn get_session(&self, id: &Uuid) -> StoreResult<Option<Session>>;
    async fn delete_session(&self, id: &Uuid) -> StoreResult<()>;
    async fn update_session(&self, id: &Uuid, title: &str, model: Option<&ModelName>) -> StoreResult<Session>;
    async fn append_message(&self, message: MessageRecord) -> StoreResult<MessageRecord>;
    async fn list_messages(&self, session_id: &Uuid) -> StoreResult<Vec<MessageRecord>>;
    async fn update_usage(&self, message_id: &Uuid, usage: TokenUsage) -> StoreResult<()>;
    async fn health_check(&self) -> StoreResult<()>;
}
```

### EmbeddingStore

Persists embedding vectors with nearest-neighbor search:

```rust
use behest::prelude::*;

#[async_trait]
pub trait EmbeddingStore: Send + Sync {
    async fn upsert(&self, record: EmbeddingRecord) -> StoreResult<EmbeddingRecord>;
    async fn search(&self, query: &[f32], limit: usize) -> StoreResult<Vec<ScoredEmbedding>>;
    async fn delete(&self, id: &Uuid) -> StoreResult<()>;
    async fn delete_by_session(&self, session_id: &Uuid) -> StoreResult<u64>;
}
```

### ArtifactStore

Stores binary artifacts (files, images, attachments):

```rust
use behest::prelude::*;

#[async_trait]
pub trait ArtifactStore: Send + Sync {
    async fn put(&self, artifact: Artifact) -> StoreResult<Artifact>;
    async fn get(&self, id: &Uuid) -> StoreResult<Option<Artifact>>;
    async fn delete(&self, id: &Uuid) -> StoreResult<()>;
    async fn list_by_session(&self, session_id: &Uuid) -> StoreResult<Vec<Artifact>>;
    async fn delete_by_session(&self, session_id: &Uuid) -> StoreResult<u64>;
}
```

### ExecutionStore

Persists tool execution records and token usage:

```rust
use behest::prelude::*;

#[async_trait]
pub trait ExecutionStore: Send + Sync {
    async fn record_execution(&self, execution: ToolExecution) -> StoreResult<ToolExecution>;
    async fn list_executions(&self, session_id: &Uuid) -> StoreResult<Vec<ToolExecution>>;
    async fn list_executions_by_message(&self, message_id: &Uuid) -> StoreResult<Vec<ToolExecution>>;
    async fn record_usage(&self, record: UsageRecord) -> StoreResult<UsageRecord>;
    async fn list_usage(&self, session_id: &Uuid) -> StoreResult<Vec<UsageRecord>>;
    async fn session_stats(&self, session_id: &Uuid) -> StoreResult<SessionStats>;
    async fn delete_by_session(&self, session_id: &Uuid) -> StoreResult<u64>;
}
```

## Available Backends

### In-Memory (Default)

Always available, no feature flags required:

```rust
use behest::prelude::*;

let session_store = MemorySessionStore::new();
let embedding_store = MemoryEmbeddingStore::new();
let artifact_store = MemoryArtifactStore::new();
let execution_store = MemoryExecutionStore::new();
```

### Redis

Enable with `redis` feature:

```toml
[dependencies]
behest = { version = "0.3", features = ["redis"] }
```

```rust
use behest::prelude::*;

// Configure Redis connection
let config = AgentConfig::builder()
    .with_env("BEHEST")?
    .build()?;
```

Environment variables:

```bash
export BEHEST_STORES_REDIS_URL="redis://localhost:6379"
```

### SQL Databases

Enable with `sqlx-postgres`, `sqlx-mysql`, or `sqlx-sqlite` features:

```toml
[dependencies]
behest = { version = "0.3", features = ["sqlx-postgres"] }
```

```rust
use behest::prelude::*;

// Configure PostgreSQL connection
let config = AgentConfig::builder()
    .with_env("BEHEST")?
    .build()?;
```

Environment variables:

```bash
export BEHEST_STORES_SQL_URL="postgresql://user:pass@localhost/db"
```

### MongoDB

Enable with `mongodb` feature:

```toml
[dependencies]
behest = { version = "0.3", features = ["mongodb"] }
```

```rust
use behest::prelude::*;

// Configure MongoDB connection
let config = AgentConfig::builder()
    .with_env("BEHEST")?
    .build()?;
```

Environment variables:

```bash
export BEHEST_STORES_MONGODB_URL="mongodb://localhost:27017"
export BEHEST_STORES_MONGODB_DATABASE="behest"
```

### SurrealDB

Enable with `surrealdb` feature:

```toml
[dependencies]
behest = { version = "0.3", features = ["surrealdb"] }
```

```rust
use behest::prelude::*;

// Configure SurrealDB connection
let config = AgentConfig::builder()
    .with_env("BEHEST")?
    .build()?;
```

Environment variables:

```bash
export BEHEST_STORES_SURREALDB_URL="ws://localhost:8000"
export BEHEST_STORES_SURREALDB_NAMESPACE="behest"
export BEHEST_STORES_SURREALDB_DATABASE="agent"
```

### Qdrant (Embeddings)

Enable with `qdrant` feature:

```toml
[dependencies]
behest = { version = "0.3", features = ["qdrant"] }
```

```rust
use behest::prelude::*;

// Configure Qdrant connection
let config = AgentConfig::builder()
    .with_env("BEHEST")?
    .build()?;
```

Environment variables:

```bash
export BEHEST_STORES_QDRANT_URL="http://localhost:6334"
export BEHEST_STORES_QDRANT_COLLECTION="embeddings"
```

### Object Storage (S3)

Enable with `object_store` feature:

```toml
[dependencies]
behest = { version = "0.3", features = ["object_store"] }
```

```rust
use behest::prelude::*;

// Configure S3-compatible storage
let config = AgentConfig::builder()
    .with_env("BEHEST")?
    .build()?;
```

Environment variables:

```bash
export BEHEST_STORES_S3_BUCKET="my-bucket"
export BEHEST_STORES_S3_REGION="us-east-1"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
```

## Configuration

Configure storage backends in `behest.toml`:

```toml
[stores]
session_backend = "memory"
execution_backend = "memory"
embedding_backend = "memory"
artifact_backend = "memory"

# Or use Redis
[stores]
session_backend = "redis"
execution_backend = "redis"

# Or use PostgreSQL
[stores]
session_backend = "sql"
execution_backend = "sql"
```

## Data Types

### Session

Persisted conversation session metadata:

```rust
pub struct Session {
    pub id: Uuid,
    pub title: String,
    pub model: ModelName,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub metadata: Value,
}
```

### MessageRecord

Persisted message exchange:

```rust
pub struct MessageRecord {
    pub id: Uuid,
    pub session_id: Uuid,
    pub role: MessageRole,
    pub content: Vec<ContentPart>,
    pub tool_calls: Vec<ToolCall>,
    pub tool_call_id: Option<String>,
    pub tool_name: Option<String>,
    pub usage: Option<TokenUsage>,
    pub created_at: DateTime<Utc>,
    pub is_compaction: bool,
    pub is_summary: bool,
    pub compaction_meta: Option<CompactionMeta>,
}
```

### EmbeddingRecord

Embedding vector with metadata:

```rust
pub struct EmbeddingRecord {
    pub id: Uuid,
    pub session_id: Option<Uuid>,
    pub model: String,
    pub vector: Vec<f32>,
    pub metadata: Value,
    pub created_at: DateTime<Utc>,
}
```

### Artifact

Binary artifact (file, image, attachment):

```rust
pub struct Artifact {
    pub id: Uuid,
    pub session_id: Option<Uuid>,
    pub name: String,
    pub content_type: String,
    pub data: Vec<u8>,
    pub metadata: Value,
    pub created_at: DateTime<Utc>,
}
```

### ToolExecution

Tool execution record:

```rust
pub struct ToolExecution {
    pub id: Uuid,
    pub session_id: Uuid,
    pub message_id: Uuid,
    pub call_id: String,
    pub tool_name: String,
    pub arguments: Value,
    pub result: Option<Value>,
    pub status: ToolExecutionStatus,
    pub error: Option<String>,
    pub duration: Duration,
    pub created_at: DateTime<Utc>,
}
```

### UsageRecord

Token usage record:

```rust
pub struct UsageRecord {
    pub id: Uuid,
    pub session_id: Uuid,
    pub message_id: Uuid,
    pub provider: String,
    pub model: String,
    pub input_tokens: u64,
    pub output_tokens: u64,
    pub total_tokens: u64,
    pub created_at: DateTime<Utc>,
}
```

## Example: Complete Storage Setup

```rust
use behest::prelude::*;

#[tokio::main]
async fn main() -> Result<()> {
    // Load configuration
    let config = AgentConfig::builder()
        .with_file("behest.toml")?
        .with_env("BEHEST")?
        .build()?;

    // Create runtime with configured storage
    let runtime = config.into_runtime().await?;

    // Use runtime - storage is handled automatically
    let request = RunRequest {
        session_id: None, // New session
        run_id: None,
        provider: ProviderId::new("openai"),
        model: ModelName::new("gpt-4"),
        input: "Hello!".to_string(),
        metadata: serde_json::Value::Null,
        tool_choice: ToolChoice::Auto,
        client_request_id: None,
    };

    let response = runtime.run(request).await?;
    println!("Session ID: {}", response.session_id);

    Ok(())
}
```

## See Also

- [Configuration](configuration.md) - Storage configuration
- [Features](features.md) - Feature flags for storage backends
- [RAG](rag.md) - RAG with embedding stores
