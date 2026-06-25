# RAG（检索增强生成）

behest 提供了一个 RAG 上下文适配器，它从嵌入存储中检索语义相关的上下文，并将其注入到 agent 上下文流程中。

## 概述

RAG 适配器：

1. 使用 `EmbeddingProvider` 嵌入用户消息
2. 查询嵌入存储以获取 top-k 最近的文档
3. 将检索到的元数据格式化为系统消息
4. 将上下文注入到 agent 的消息历史中

## RagContextAdapter

```rust
use behest::prelude::*;

#[cfg(feature = "rag")]
pub struct RagContextAdapter {
    provider: Arc<dyn EmbeddingProvider>,
    store: Arc<dyn EmbeddingStore>,
    model: ModelName,
    limit: usize,
    template: String,
    metadata_field: String,
}
```

### 创建 RAG 适配器

```rust
use behest::prelude::*;
use std::sync::Arc;

#[cfg(feature = "rag")]
async fn create_rag_adapter() -> Result<RagContextAdapter> {
    // 创建嵌入提供商（例如 OpenAI）
    let embedding_provider = Arc::new(OpenAiEmbeddingAdapter::new(
        ProviderId::new("openai"),
        std::env::var("OPENAI_API_KEY")?,
    ));

    // 创建嵌入存储
    let embedding_store = Arc::new(MemoryEmbeddingStore::new());

    // 创建 RAG 适配器
    let adapter = RagContextAdapter::new(
        embedding_provider,
        embedding_store,
        ModelName::new("text-embedding-3-small"),
    )
    .with_limit(5)  // 检索前 5 个结果
    .with_template("使用以下上下文：\n\n{context}")
    .with_metadata_field("text");

    Ok(adapter)
}
```

### 配置选项

- `limit`: 检索到的最大片段数（默认：5）
- `template`: 带有 `{context}` 占位符的系统提示模板
- `metadata_field`: 从嵌入元数据中提取的字段（默认："text"）

## 设置 RAG

### 1. 启用特性

```toml
[dependencies]
behest = { version = "0.3", features = ["rag", "qdrant"] }
```

### 2. 配置嵌入存储

```toml
# behest.toml
[stores]
embedding_backend = "qdrant"

[stores.qdrant]
url = "http://localhost:6334"
collection = "embeddings"
```

### 3. 配置 RAG

```toml
# behest.toml
[rag]
enabled = true
model = "text-embedding-3-small"
limit = 5
template = "使用以下上下文来回答问题：\n\n{context}"
```

## 嵌入提供商

### OpenAI 嵌入

```rust
use behest::prelude::*;

#[cfg(feature = "openai")]
let provider = OpenAiEmbeddingAdapter::new(
    ProviderId::new("openai"),
    "your-api-key".to_string(),
);
```

### 自定义嵌入提供商

实现 `EmbeddingProvider` trait：

```rust
use behest::prelude::*;
use async_trait::async_trait;

struct MyEmbeddingProvider {
    id: ProviderId,
}

#[async_trait]
impl EmbeddingProvider for MyEmbeddingProvider {
    fn id(&self) -> ProviderId {
        self.id.clone()
    }

    async fn embed(&self, request: EmbeddingRequest) -> ProviderResult<EmbeddingResponse> {
        // 实现嵌入逻辑
        let embeddings = vec![vec![0.1, 0.2, 0.3]]; // 示例
        Ok(EmbeddingResponse {
            provider: self.id.clone(),
            model: request.model,
            embeddings,
            usage: None,
            raw: None,
        })
    }
}
```

## 最佳实践

1. **选择合适的嵌入模型**：选择平衡质量和成本的模型
2. **设置合理的限制**：3-5 个片段通常足够
3. **仔细格式化模板**：使模板清晰且具有指导性
4. **索引元数据**：与嵌入一起存储可搜索的元数据
5. **监控成本**：跟踪嵌入 API 调用和 token 使用
6. **批量嵌入**：批量插入多个嵌入以提高效率

## 另请参阅

- [存储](storage.md) - 嵌入存储后端
- [配置](configuration.md) - RAG 配置
- [提供商](providers.md) - 嵌入提供商
