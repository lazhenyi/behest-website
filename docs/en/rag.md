# RAG (Retrieval-Augmented Generation)

behest provides a RAG context adapter that retrieves semantically relevant context from an embedding store and injects it into the agent context flow.

## Overview

The RAG adapter:

1. Embeds the user message using an `EmbeddingProvider`
2. Queries the embedding store for the top-k nearest documents
3. Formats retrieved metadata into a system message
4. Injects the context into the agent's message history

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

### Creating a RAG Adapter

```rust
use behest::prelude::*;
use std::sync::Arc;

#[cfg(feature = "rag")]
async fn create_rag_adapter() -> Result<RagContextAdapter> {
    // Create embedding provider (e.g., OpenAI)
    let embedding_provider = Arc::new(OpenAiEmbeddingAdapter::new(
        ProviderId::new("openai"),
        std::env::var("OPENAI_API_KEY")?,
    ));

    // Create embedding store
    let embedding_store = Arc::new(MemoryEmbeddingStore::new());

    // Create RAG adapter
    let adapter = RagContextAdapter::new(
        embedding_provider,
        embedding_store,
        ModelName::new("text-embedding-3-small"),
    )
    .with_limit(5)  // Retrieve top 5 results
    .with_template("Use the following context:\n\n{context}")
    .with_metadata_field("text");

    Ok(adapter)
}
```

### Configuration Options

- `limit`: Maximum number of retrieved snippets (default: 5)
- `template`: System-prompt template with `{context}` placeholder
- `metadata_field`: Field to extract from embedding metadata (default: "text")

## Setting Up RAG

### 1. Enable Features

```toml
[dependencies]
behest = { version = "0.3", features = ["rag", "qdrant"] }
```

### 2. Configure Embedding Store

```toml
# behest.toml
[stores]
embedding_backend = "qdrant"

[stores.qdrant]
url = "http://localhost:6334"
collection = "embeddings"
```

### 3. Configure RAG

```toml
# behest.toml
[rag]
enabled = true
model = "text-embedding-3-small"
limit = 5
template = "Use the following context to inform your response:\n\n{context}"
```

## Example: Complete RAG Setup

```rust
use behest::prelude::*;
use std::sync::Arc;

#[tokio::main]
async fn main() -> Result<()> {
    // Load configuration
    let config = AgentConfig::builder()
        .with_file("behest.toml")?
        .with_env("BEHEST")?
        .build()?;

    // Create runtime
    let runtime = config.into_runtime().await?;

    // Create context pipeline with RAG
    let mut context_pipeline = ContextPipeline::new();

    // Add RAG adapter
    #[cfg(feature = "rag")]
    {
        let rag_adapter = create_rag_adapter().await?;
        context_pipeline.register(Arc::new(rag_adapter));
    }

    // Use runtime with RAG context
    let request = RunRequest {
        session_id: None,
        run_id: None,
        provider: ProviderId::new("openai"),
        model: ModelName::new("gpt-4"),
        input: "What is the capital of France?".to_string(),
        metadata: serde_json::Value::Null,
        tool_choice: ToolChoice::Auto,
        client_request_id: None,
    };

    let response = runtime.run(request).await?;
    println!("Response: {}", response.output);

    Ok(())
}
```

## Example: Manual RAG Usage

```rust
use behest::prelude::*;
use behest::context::{ContextAdapter, ContextFactory, ContextInput};
use std::sync::Arc;

#[tokio::main]
async fn main() -> Result<()> {
    // Create components
    let embedding_provider = Arc::new(OpenAiEmbeddingAdapter::new(
        ProviderId::new("openai"),
        std::env::var("OPENAI_API_KEY")?,
    ));

    let embedding_store = Arc::new(MemoryEmbeddingStore::new());

    // Insert some embeddings
    let record = EmbeddingRecord::new(
        "text-embedding-3-small",
        vec![0.1, 0.2, 0.3], // Example vector
    )
    .with_metadata(serde_json::json!({
        "text": "Paris is the capital of France."
    }));

    embedding_store.upsert(record).await?;

    // Create RAG adapter
    let rag_adapter = RagContextAdapter::new(
        embedding_provider,
        embedding_store,
        ModelName::new("text-embedding-3-small"),
    )
    .with_limit(3);

    // Use in context factory
    let mut factory = ContextFactory::new();
    factory.register(Arc::new(rag_adapter));

    let input = ContextInput::new()
        .with_user_message("What is the capital of France?");

    let output = factory.build(&input).await?;

    println!("Context messages: {}", output.messages().len());
    for msg in output.messages() {
        println!("  - {:?}", msg);
    }

    Ok(())
}
```

## Embedding Providers

### OpenAI Embeddings

```rust
use behest::prelude::*;

#[cfg(feature = "openai")]
let provider = OpenAiEmbeddingAdapter::new(
    ProviderId::new("openai"),
    "your-api-key".to_string(),
);
```

### Custom Embedding Provider

Implement the `EmbeddingProvider` trait:

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
        // Implement embedding logic
        let embeddings = vec![vec![0.1, 0.2, 0.3]]; // Example
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

## Embedding Stores

### In-Memory Store

```rust
use behest::prelude::*;

let store = MemoryEmbeddingStore::new();
```

### Qdrant Store

```rust
use behest::prelude::*;

#[cfg(feature = "qdrant")]
let store = QdrantEmbeddingStore::new(
    "http://localhost:6334",
    "embeddings",
).await?;
```

### PostgreSQL with pgvector

```rust
use behest::prelude::*;

#[cfg(feature = "sqlx-postgres")]
let store = SqlEmbeddingStore::new(
    "postgresql://user:pass@localhost/db",
).await?;
```

## Best Practices

1. **Choose appropriate embedding model**: Select a model that balances quality and cost
2. **Set reasonable limits**: 3-5 snippets is usually sufficient
3. **Format templates carefully**: Make the template clear and instructive
4. **Index metadata**: Store searchable metadata with embeddings
5. **Monitor costs**: Track embedding API calls and token usage
6. **Batch embeddings**: Insert multiple embeddings in batches for efficiency

## See Also

- [Storage](storage.md) - Embedding store backends
- [Configuration](configuration.md) - RAG configuration
- [Providers](providers.md) - Embedding providers
