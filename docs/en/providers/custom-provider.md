---
title: Custom Providers
description: How to implement `ChatProvider` for an internal model, proxy, or local inference service.
group: providers
order: 8
summary: How to implement `ChatProvider` for an internal / local model.
related:
  - providers/chat-provider
  - providers/provider-registry
  - core/factory-registry
---

# Custom Providers

> Implement `ChatProvider` for any model backend.

`behest` does not force one vendor SDK into the core. Implement `ChatProvider` for any model backend — a local Ollama instance, an internal proxy, a HuggingFace TGI endpoint, or a proprietary inference service.

## The trait

```rust
#[async_trait]
pub trait ChatProvider: Send + Sync {
    fn id(&self) -> ProviderId;
    fn capabilities(&self) -> ProviderCapabilities;
    async fn complete(&self, request: ChatRequest) -> ProviderResult<ChatResponse>;
    async fn stream(&self, request: ChatRequest) -> ProviderResult<ChatStream> {
        Err(ProviderError::Unsupported { provider: self.id(), feature: "chat_stream".into() })
    }
}
```

## Minimal implementation

```rust
use async_trait::async_trait;
use behest::prelude::*;

struct MyProvider {
    id: ProviderId,
    base_url: String,
}

#[async_trait]
impl ChatProvider for MyProvider {
    fn id(&self) -> ProviderId {
        self.id.clone()
    }

    fn capabilities(&self) -> ProviderCapabilities {
        ProviderCapabilities::chat()  // chat only, no streaming, no tools
    }

    async fn complete(&self, request: ChatRequest) -> ProviderResult<ChatResponse> {
        // 1. Build the HTTP request body from `request`.
        // 2. POST to `self.base_url`.
        // 3. Parse the response body into `ChatResponse`.
        Ok(ChatResponse {
            provider: self.id.clone(),
            model: request.model,
            message: Message::assistant_text("Hello from MyProvider"),
            finish_reason: FinishReason::Stop,
            usage: None,
            raw: None,
        })
    }
}
```

## Adding streaming

Override `stream`:

```rust
async fn stream(&self, request: ChatRequest) -> ProviderResult<ChatStream> {
    let body = build_request_body(&request)?;
    let response = self.http.post(&self.base_url).json(&body).send().await?;
    let stream = response.bytes_stream().map(|chunk| {
        let bytes = chunk?;
        let text = String::from_utf8_lossy(&bytes).to_string();
        Ok(ChatStreamEvent::TextDelta { delta: text })
    });
    Ok(Box::pin(stream))
}
```

## Registering

```rust
let mut registry = ProviderRegistry::new();
registry.register_chat(MyProvider {
    id: ProviderId::new("my-provider"),
    base_url: "http://localhost:11434/v1".into(),
});
```

## As a `Component`

To participate in the composable runtime (`FactoryRegistry`, config-driven construction), wrap the provider in a `Component`:

```rust
#[derive(Debug, Deserialize, JsonSchema)]
struct MyProviderConfig {
    base_url: String,
    api_key: Option<String>,
}

struct MyProviderComponent {
    inner: Arc<dyn ChatProvider>,
}

#[async_trait]
impl Component for MyProviderComponent {
    const NAME: &'static str = "provider.mycompany.chat";
    type Config = MyProviderConfig;
    type Error = ComponentError;

    async fn init(cfg: &Self::Config, _ctx: &ComponentContext) -> Result<Self, Self::Error> {
        let provider = MyProvider {
            id: ProviderId::new("my-provider"),
            base_url: cfg.base_url.clone(),
        };
        Ok(Self { inner: Arc::new(provider) })
    }
}
```

Register the factory:

```rust
let reg = default_factory_registry()
    .register("provider.mycompany.chat", |cfg, ctx| {
        let c: MyProviderConfig = serde_json::from_value(cfg)?;
        let comp = MyProviderComponent::init(&c, &ctx)
            .map_err(|e| FactoryError::FactoryFailed("mycompany".into(), e.to_string()))?;
        Ok(Box::new(TypedAnyComponent::new(comp)))
    });
```

## Error mapping

Map HTTP errors to `ProviderError` using the standard variants:

```rust
fn map_status(status: u16, body: &str) -> ProviderError {
    match status {
        401 => ProviderError::Authentication { provider: id, message: body.into() },
        429 => ProviderError::RateLimited { provider: id, retry_after: None },
        400 => ProviderError::BadRequest { provider: id, message: body.into() },
        _ => ProviderError::Provider { provider: id, message: body.into() },
    }
}
```

The `is_retryable()` and `is_context_overflow()` methods on `ProviderError` control the router's behaviour.

## Testing

Use `wiremock` to mock the HTTP layer:

```rust
use wiremock::{Mock, MockServer, ResponseTemplate};

#[tokio::test]
async fn my_provider_returns_assistant_text() {
    let server = MockServer::start().await;
    Mock::given(method("POST"))
        .respond_with(ResponseTemplate::new(200).set_body_json(json!({...})));
    let provider = MyProvider::new(server.uri());
    let response = provider.complete(req).await.unwrap();
    assert_eq!(response.message, Message::assistant_text("expected"));
}
```

## See also

- **[ChatProvider](chat-provider.md)** — the trait.
- **[ProviderRegistry](provider-registry.md)** — registration.
- **[Component Trait](../core/component-trait.md)** — wrapping as a `Component`.
- **[FactoryRegistry](../core/factory-registry.md)** — registering the factory.
