# 会话

会话是 behest 中对话状态的基本单元。它们跟踪消息历史、工具执行和对话的元数据。

## 会话生命周期

### 创建会话

启动新运行时会自动创建会话：

```rust
use behest::prelude::*;

#[tokio::main]
async fn main() -> Result<()> {
    let config = AgentConfigBuilder::default().build()?;
    let runtime = config.into_runtime().await?;

    // 自动创建新会话
    let request = RunRequest {
        session_id: None, // 新会话
        run_id: None,
        provider: ProviderId::new("openai"),
        model: ModelName::new("gpt-4"),
        input: "你好！".to_string(),
        metadata: serde_json::Value::Null,
        tool_choice: ToolChoice::Auto,
        client_request_id: None,
    };

    let response = runtime.run(request).await?;
    println!("会话 ID: {}", response.session_id);

    Ok(())
}
```

### 加载会话

继续现有会话：

```rust
use behest::prelude::*;

#[tokio::main]
async fn main() -> Result<()> {
    let config = AgentConfigBuilder::default().build()?;
    let runtime = config.into_runtime().await?;

    // 加载现有会话
    let request = RunRequest {
        session_id: Some(existing_session_id), // 现有会话
        run_id: None,
        provider: ProviderId::new("openai"),
        model: ModelName::new("gpt-4"),
        input: "继续我们的对话".to_string(),
        metadata: serde_json::Value::Null,
        tool_choice: ToolChoice::Auto,
        client_request_id: None,
    };

    let response = runtime.run(request).await?;
    println!("继续会话: {}", response.session_id);

    Ok(())
}
```

### 删除会话

删除会话及所有关联数据：

```rust
use behest::prelude::*;

#[tokio::main]
async fn main() -> Result<()> {
    let store = MemorySessionStore::new();

    // 删除会话（级联删除）
    store.delete_session(&session_id).await?;

    Ok(())
}
```

## 会话结构

### 会话元数据

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

### 创建会话

```rust
use behest::prelude::*;

let session = Session::new("我的聊天", ModelName::new("gpt-4"))
    .with_metadata(serde_json::json!({
        "user_id": "user-123",
        "topic": "support"
    }));
```

## 消息历史

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

### 消息角色

```rust
pub enum MessageRole {
    System,    // 系统
    User,      // 用户
    Assistant, // 助手
    Tool,      // 工具
}
```

### 追加消息

```rust
use behest::prelude::*;

let message = MessageRecord::new(
    session_id,
    MessageRole::User,
    vec![ContentPart::text("你好！")],
);

let stored = store.append_message(message).await?;
```

### 列出消息

```rust
use behest::prelude::*;

let messages = store.list_messages(&session_id).await?;

for msg in messages {
    println!("{:?}: {:?}", msg.role, msg.content);
}
```

## 会话统计

获取会话的聚合统计信息：

```rust
use behest::prelude::*;

let stats = store.session_stats(&session_id).await?;

println!("消息数: {}", stats.message_count);
println!("工具调用数: {}", stats.tool_call_count);
println!("总 token 数: {}", stats.total_tokens);
println!("平均工具执行时间: {}ms", stats.avg_tool_duration_ms);
```

### SessionStats 结构

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

## 会话门控

会话门控控制对会话的并发访问：

```rust
use behest::prelude::*;

#[tokio::main]
async fn main() -> Result<()> {
    let config = AgentConfigBuilder::default().build()?;
    let runtime = config.into_runtime().await?;

    // 获取会话守卫
    let guard = runtime.session_gate().acquire(session_id).await?;

    // 会话现在已锁定用于此操作
    // ... 执行操作 ...

    // 守卫被丢弃，会话被释放
    Ok(())
}
```

## 分页

分页浏览会话和消息：

```rust
use behest::prelude::*;

// 使用分页列出会话
let pagination = Pagination {
    limit: 10,
    offset: 0,
};

let sessions = store.list_sessions_paginated(pagination, SessionFilter::default()).await?;

// 使用分页列出消息
let message_pagination = Pagination {
    limit: 50,
    offset: 0,
};

let messages = store.list_messages_paginated(&session_id, message_pagination).await?;
```

## 会话过滤

按元数据或时间范围过滤会话：

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

## 另请参阅

- [存储](storage.md) - 存储后端
- [快速入门](getting-started.md) - 基本用法
- [配置](configuration.md) - 会话配置
