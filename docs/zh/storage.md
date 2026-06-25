# 存储

behest 提供了可插拔的持久化层，支持多种存储后端，用于会话、嵌入、工件和执行记录。

## 存储 Traits

### SessionStore

持久化会话和消息历史：

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

持久化嵌入向量并支持最近邻搜索：

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

存储二进制工件（文件、图像、附件）：

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

持久化工具执行记录和 token 使用：

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

## 可用后端

### 内存（默认）

始终可用，无需特性标志：

```rust
use behest::prelude::*;

let session_store = MemorySessionStore::new();
let embedding_store = MemoryEmbeddingStore::new();
let artifact_store = MemoryArtifactStore::new();
let execution_store = MemoryExecutionStore::new();
```

### Redis

启用 `redis` 特性：

```toml
[dependencies]
behest = { version = "0.3", features = ["redis"] }
```

环境变量：

```bash
export BEHEST_STORES_REDIS_URL="redis://localhost:6379"
```

### SQL 数据库

启用 `sqlx-postgres`、`sqlx-mysql` 或 `sqlx-sqlite` 特性：

```toml
[dependencies]
behest = { version = "0.3", features = ["sqlx-postgres"] }
```

环境变量：

```bash
export BEHEST_STORES_SQL_URL="postgresql://user:pass@localhost/db"
```

### MongoDB

启用 `mongodb` 特性：

```toml
[dependencies]
behest = { version = "0.3", features = ["mongodb"] }
```

环境变量：

```bash
export BEHEST_STORES_MONGODB_URL="mongodb://localhost:27017"
export BEHEST_STORES_MONGODB_DATABASE="behest"
```

### SurrealDB

启用 `surrealdb` 特性：

```toml
[dependencies]
behest = { version = "0.3", features = ["surrealdb"] }
```

环境变量：

```bash
export BEHEST_STORES_SURREALDB_URL="ws://localhost:8000"
export BEHEST_STORES_SURREALDB_NAMESPACE="behest"
export BEHEST_STORES_SURREALDB_DATABASE="agent"
```

### Qdrant（嵌入）

启用 `qdrant` 特性：

```toml
[dependencies]
behest = { version = "0.3", features = ["qdrant"] }
```

环境变量：

```bash
export BEHEST_STORES_QDRANT_URL="http://localhost:6334"
export BEHEST_STORES_QDRANT_COLLECTION="embeddings"
```

### 对象存储（S3）

启用 `object_store` 特性：

```toml
[dependencies]
behest = { version = "0.3", features = ["object_store"] }
```

环境变量：

```bash
export BEHEST_STORES_S3_BUCKET="my-bucket"
export BEHEST_STORES_S3_REGION="us-east-1"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
```

## 配置

在 `behest.toml` 中配置存储后端：

```toml
[stores]
session_backend = "memory"
execution_backend = "memory"
embedding_backend = "memory"
artifact_backend = "memory"

# 或使用 Redis
[stores]
session_backend = "redis"
execution_backend = "redis"

# 或使用 PostgreSQL
[stores]
session_backend = "sql"
execution_backend = "sql"
```

## 数据类型

### Session

持久化的会话元数据：

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

持久化的消息交换：

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

## 另请参阅

- [配置](configuration.md) - 存储配置
- [特性标志](features.md) - 存储后端特性标志
- [RAG](rag.md) - 使用嵌入存储的 RAG
