# Provider Adapters

Concrete provider adapters are feature-gated.

## Available Providers

| Feature | Adapter | Chat | Stream | Embeddings | Tools |
|---|---|---:|---:|---:|---:|
| `openai` | `OpenAiChatAdapter`, `OpenAiEmbeddingAdapter` | yes | yes | yes | yes |
| `anthropic` | `AnthropicChatAdapter` | yes | yes | no | yes |

## Enable Adapters

```toml
[dependencies]
behest = { version = "0.3", features = ["openai", "anthropic"] }
```

## Implementing Custom Providers

`behest` does not force one vendor SDK into the core. Implement `ChatProvider` for any model backend, gateway, local inference service, or internal provider.

```rust
use async_trait::async_trait;
use behest::prelude::*;

struct MyProvider {
    id: ProviderId,
}

#[async_trait]
impl ChatProvider for MyProvider {
    fn id(&self) -> ProviderId {
        self.id.clone()
    }

    fn capabilities(&self) -> ProviderCapabilities {
        ProviderCapabilities::chat()
    }

    async fn complete(&self, request: ChatRequest) -> ProviderResult<ChatResponse> {
        // Implement your provider logic here
        todo!()
    }
}
```

Streaming providers can override `stream`.
