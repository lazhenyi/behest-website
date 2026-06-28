---
title: Custom Providers
description: 如何为内部模型、代理或本地推理服务实现 ChatProvider。
group: providers
order: 8
summary: 如何为内部/本地模型实现 ChatProvider。
related: []
---

# Custom Providers

> 为任意模型后端实现 `ChatProvider`。

## 最小实现

```rust
#[async_trait]
impl ChatProvider for MyProvider {
    fn id(&self) -> ProviderId { self.id.clone() }
    fn capabilities(&self) -> ProviderCapabilities { ProviderCapabilities::chat() }
    async fn complete(&self, request: ChatRequest) -> ProviderResult<ChatResponse> {
        Ok(ChatResponse { provider: self.id.clone(), model: request.model, message: Message::assistant_text("Hello"), finish_reason: FinishReason::Stop, usage: None, raw: None })
    }
}
```

## 添加流式

重写 `stream` 方法，使用 `futures::stream` 的 `map` 将每个 chunk 包装为 `ChatStreamEvent::TextDelta`。

## 注册

```rust
registry.register_chat(MyProvider { id: ProviderId::new("my-provider"), base_url: "...".into() });
```

## 作为 Component

要参与可组合运行时，把 provider 包装为 `Component`，实现 `init` / `start` / `stop` / `health`，并在 `FactoryRegistry` 中注册。

## 错误映射

```rust
fn map_status(status: u16) -> ProviderError {
    match status { 401 => Authentication, 429 => RateLimited, 400 => BadRequest, _ => Provider }
}
```

## 另见

- **[ChatProvider](chat-provider.md)** —— trait。
- **[Component Trait](../core/component-trait.md)** —— 包装为 Component。

