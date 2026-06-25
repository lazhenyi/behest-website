# Sessions

Sessions are the fundamental unit of conversation state in behest. They track message history, tool executions, and metadata for a conversation.

## Session Lifecycle

### Creating Sessions

Sessions are created automatically when starting a new run:

```rust
use behest::prelude::*;

#[tokio::main]
async fn main() -> Result<()> {
    let config = AgentConfigBuilder::default().build()?;
    let runtime = config.into_runtime().await?;

    // New session created automatically
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

### Loading Sessions

Continue an existing session:

```rust
use behest::prelude::*;

#[tokio::main]
async fn main() -> Result<()> {
    let config = AgentConfigBuilder::default().build()?;
    let runtime = config.into_runtime().await?;

    // Load existing session
    let request = RunRequest {
        session_id: Some(existing_session_id), // Existing session
        run_id: None,
        provider: ProviderId::new("openai"),
        model: ModelName::new("gpt-4"),
        input: "Continue our conversation".to_string(),
        metadata: serde_json::Value::Null,
        tool_choice: ToolChoice::Auto,
        client_request_id: None,
    };

    let response = runtime.run(request).await?;
    println!("Continued session: {}", response.session_id);

    Ok(())
}
```

### Deleting Sessions

Delete a session and all associated data:

```rust
use behest::prelude::*;

#[tokio::main]
async fn main() -> Result<()> {
    let store = MemorySessionStore::new();

    // Delete session (cascading delete)
    store.delete_session(&session_id).await?;

    Ok(())
}
```

## Session Structure

### Session Metadata

```rust
use behest::prelude::*;

pub struct Session {
    pub id: Uuid,
    pub title: String,
    pub model: ModelName,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub metadata: Value,
}
```

### Creating a Session

```rust
use behest::prelude::*;

let session = Session::new("My Chat", ModelName::new("gpt-4"))
    .with_metadata(serde_json::json!({
        "user_id": "user-123",
        "topic": "support"
    }));
```

## Message History

### MessageRecord

```rust
use behest::prelude::*;

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

### Message Roles

```rust
pub enum MessageRole {
    System,
    User,
    Assistant,
    Tool,
}
```

### Appending Messages

```rust
use behest::prelude::*;

let message = MessageRecord::new(
    session_id,
    MessageRole::User,
    vec![ContentPart::text("Hello!")],
);

let stored = store.append_message(message).await?;
```

### Listing Messages

```rust
use behest::prelude::*;

let messages = store.list_messages(&session_id).await?;

for msg in messages {
    println!("{}: {:?}", msg.role, msg.content);
}
```

## Session Statistics

Get aggregated statistics for a session:

```rust
use behest::prelude::*;

let stats = store.session_stats(&session_id).await?;

println!("Messages: {}", stats.message_count);
println!("Tool calls: {}", stats.tool_call_count);
println!("Total tokens: {}", stats.total_tokens);
println!("Avg tool duration: {}ms", stats.avg_tool_duration_ms);
```

### SessionStats Structure

```rust
pub struct SessionStats {
    pub session_id: Uuid,
    pub message_count: u64,
    pub tool_call_count: u64,
    pub tool_success_count: u64,
    pub tool_failure_count: u64,
    pub total_input_tokens: u64,
    pub total_output_tokens: u64,
    pub total_tokens: u64,
    pub avg_tool_duration_ms: u64,
}
```

## Session Gate

The session gate controls concurrent access to a session:

```rust
use behest::prelude::*;

#[tokio::main]
async fn main() -> Result<()> {
    let config = AgentConfigBuilder::default().build()?;
    let runtime = config.into_runtime().await?;

    // Acquire session guard
    let guard = runtime.session_gate().acquire(session_id).await?;

    // Session is now locked for this operation
    // ... perform operations ...

    // Guard is dropped, session is released
    Ok(())
}
```

## Pagination

Paginate through sessions and messages:

```rust
use behest::prelude::*;

// List sessions with pagination
let pagination = Pagination {
    limit: 10,
    offset: 0,
};

let sessions = store.list_sessions_paginated(pagination, SessionFilter::default()).await?;

// List messages with pagination
let message_pagination = Pagination {
    limit: 50,
    offset: 0,
};

let messages = store.list_messages_paginated(&session_id, message_pagination).await?;
```

## Session Filtering

Filter sessions by metadata or time range:

```rust
use behest::prelude::*;

let filter = SessionFilter {
    metadata_filter: Some(serde_json::json!({
        "user_id": "user-123"
    })),
    created_after: Some(Utc::now() - chrono::Duration::days(7)),
    created_before: None,
};

let sessions = store.list_sessions_paginated(Pagination::default(), filter).await?;
```

## Example: Session Manager

```rust
use behest::prelude::*;
use uuid::Uuid;

struct SessionManager {
    store: Box<dyn SessionStore>,
}

impl SessionManager {
    fn new(store: Box<dyn SessionStore>) -> Self {
        Self { store }
    }

    async fn create_session(&self, title: &str, model: &str) -> Result<Session> {
        let session = Session::new(title, ModelName::new(model));
        self.store.create_session(session).await
            .map_err(Error::Storage)
    }

    async fn get_session(&self, id: &Uuid) -> Result<Option<Session>> {
        self.store.get_session(id).await
            .map_err(Error::Storage)
    }

    async fn list_recent_sessions(&self, limit: u32) -> Result<Vec<Session>> {
        let pagination = Pagination { limit, offset: 0 };
        self.store.list_sessions_paginated(pagination, SessionFilter::default()).await
            .map_err(Error::Storage)
    }

    async fn add_message(&self, session_id: &Uuid, role: MessageRole, text: &str) -> Result<MessageRecord> {
        let message = MessageRecord::new(
            *session_id,
            role,
            vec![ContentPart::text(text)],
        );
        self.store.append_message(message).await
            .map_err(Error::Storage)
    }

    async fn get_history(&self, session_id: &Uuid) -> Result<Vec<MessageRecord>> {
        self.store.list_messages(session_id).await
            .map_err(Error::Storage)
    }

    async fn delete_session(&self, id: &Uuid) -> Result<()> {
        self.store.delete_session(id).await
            .map_err(Error::Storage)
    }
}
```

## Example: Session with Metadata

```rust
use behest::prelude::*;
use serde_json::json;

#[tokio::main]
async fn main() -> Result<()> {
    let store = MemorySessionStore::new();

    // Create session with metadata
    let session = Session::new("Support Chat", ModelName::new("gpt-4"))
        .with_metadata(json!({
            "user_id": "user-123",
            "ticket_id": "TICKET-456",
            "priority": "high",
            "tags": ["billing", "refund"]
        }));

    let created = store.create_session(session).await?;

    // Retrieve and use metadata
    let loaded = store.get_session(&created.id).await?.unwrap();
    let metadata = loaded.metadata;

    println!("User ID: {}", metadata["user_id"]);
    println!("Priority: {}", metadata["priority"]);

    Ok(())
}
```

## See Also

- [Storage](storage.md) - Storage backends
- [Getting Started](getting-started.md) - Basic usage
- [Configuration](configuration.md) - Session configuration
