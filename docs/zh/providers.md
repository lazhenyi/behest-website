# 提供商适配器

具体的提供商适配器通过特性标志控制。

## 可用的提供商

| 特性 | 适配器 | 聊天 | 流式 | 嵌入 | 工具 |
|---|---|---:|---:|---:|---:|
| `openai` | `OpenAiChatAdapter`、`OpenAiEmbeddingAdapter` | 是 | 是 | 是 | 是 |
| `anthropic` | `AnthropicChatAdapter` | 是 | 是 | 否 | 是 |

## 启用适配器

```toml
[dependencies]
behest = { version = "0.3", features = ["openai", "anthropic"] }
```

## 实现自定义提供商

`behest` 不会将单一供应商 SDK 强制加入核心。为任何模型后端、网关、本地推理服务或内部提供商实现 `ChatProvider`。

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
        // 在此实现您的提供商逻辑
        todo!()
    }
}
```

流式提供商可以覆盖 `stream` 方法。

## 提供商能力

```rust
use behest::prelude::*;

// 声明提供商支持的能力
let capabilities = ProviderCapabilities::chat()
    .with_streaming()
    .with_tools()
    .with_embeddings();
```

## 提供商注册

在注册表中注册提供商：

```rust
use behest::prelude::*;

let registry = ProviderRegistry::new();

// 注册聊天提供商
registry.register_chat(my_chat_provider);

// 注册嵌入提供商
registry.register_embedding(my_embedding_provider);

// 通过注册表路由请求
let response = registry.complete(&provider_id, request).await?;
```
