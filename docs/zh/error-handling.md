# 错误处理

`behest` 提供类型化的错误分类，而非字符串化的框架错误。这使得错误处理更加明确，并帮助你适当地处理不同的错误场景。

## 错误类型

### ProviderError

来自模型提供商的错误：

```rust
use behest::prelude::*;

match result {
    Err(Error::Provider(e)) => match e {
        ProviderError::Authentication { provider } => {
            eprintln!("提供商 {provider} 认证失败");
        }
        ProviderError::BadRequest { provider, message } => {
            eprintln!("提供商 {provider} 拒绝请求: {message}");
        }
        ProviderError::RateLimited { provider, retry_after } => {
            eprintln!("提供商 {provider} 限流，重试等待: {retry_after:?}");
        }
        ProviderError::Timeout { provider } => {
            eprintln!("提供商 {provider} 超时");
        }
        ProviderError::Overloaded { provider } => {
            eprintln!("提供商 {provider} 过载");
        }
        ProviderError::Unsupported { provider, feature } => {
            eprintln!("提供商 {provider} 不支持: {feature}");
        }
        ProviderError::Transport { provider, source } => {
            eprintln!("提供商 {provider} 传输错误: {source}");
        }
        ProviderError::Decode { provider, message } => {
            eprintln!("解码提供商 {provider} 响应失败: {message}");
        }
        ProviderError::Provider { provider, status, message } => {
            eprintln!("提供商 {provider} 错误 (状态: {status:?}): {message}");
        }
    },
    // ... 处理其他错误
}
```

### ToolError

来自工具执行的错误：

```rust
use behest::prelude::*;

match result {
    Err(Error::Tool(e)) => match e {
        ToolError::NotFound { name } => {
            eprintln!("工具未找到: {name}");
        }
        ToolError::InvalidArguments { name, message } => {
            eprintln!("工具 {name} 参数无效: {message}");
        }
        ToolError::Execution { name, message } => {
            eprintln!("工具 {name} 执行失败: {message}");
        }
        ToolError::NotImplemented { name } => {
            eprintln!("工具 {name} 未实现");
        }
    },
    // ... 处理其他错误
}
```

### StorageError

来自存储操作的错误：

```rust
use behest::prelude::*;

match result {
    Err(Error::Storage(e)) => match e {
        StorageError::NotFound { id } => {
            eprintln!("实体未找到: {id}");
        }
        StorageError::ConnectionFailed { backend, message, .. } => {
            eprintln!("存储连接失败 ({backend}): {message}");
        }
        StorageError::SerializationFailed { message, .. } => {
            eprintln!("序列化错误: {message}");
        }
        StorageError::BackendError { backend, message, .. } => {
            eprintln!("存储后端错误 ({backend}): {message}");
        }
        StorageError::MigrationFailed { backend, message, .. } => {
            eprintln!("存储迁移失败 ({backend}): {message}");
        }
        StorageError::DataCorruption { field, message, .. } => {
            eprintln!("数据损坏 ({field}): {message}");
        }
    },
    // ... 处理其他错误
}
```

### ContextError

来自上下文构建的错误：

```rust
use behest::prelude::*;

match result {
    Err(Error::Context(e)) => match e {
        ContextError::AdapterFailed { adapter, message } => {
            eprintln!("上下文适配器 {adapter} 失败: {message}");
        }
        ContextError::InvalidInput { message } => {
            eprintln!("无效的上下文输入: {message}");
        }
        ContextError::AdapterNotFound { adapter } => {
            eprintln!("上下文适配器 {adapter} 未找到");
        }
    },
    // ... 处理其他错误
}
```

### RuntimeError

来自运行时的错误。`RuntimeError` 定义在 `behest::runtime::error` 中，**不是**顶层 `Error` 枚举的变体：

```rust
use behest::runtime::RuntimeError;

match result {
    Err(RuntimeError::ProviderNotFound(name)) => {
        eprintln!("提供商未找到: {name}");
    }
    Err(RuntimeError::SessionBusy(id)) => {
        eprintln!("会话 {id} 正忙");
    }
    Err(RuntimeError::IterationLimitExceeded(max)) => {
        eprintln!("迭代限制 {max} 已超出");
    }
    Err(RuntimeError::InputRejected { input_id, reason }) => {
        eprintln!("输入 {input_id} 被拒绝: {reason}");
    }
    Err(RuntimeError::Storage(e)) => {
        eprintln!("存储错误: {e}");
    }
    // ... 处理其他变体
}
```

## 顶层 Error

顶层 `Error` 枚举包装了四个错误类别以及配置错误：

```rust
use behest::prelude::*;

match result {
    Ok(value) => {
        // 处理成功
    }
    Err(e) => match e {
        Error::Provider(e) => { /* 处理提供商错误 */ }
        Error::Tool(e) => { /* 处理工具错误 */ }
        Error::Storage(e) => { /* 处理存储错误 */ }
        Error::Context(e) => { /* 处理上下文错误 */ }
        Error::Config(msg) => { /* 处理配置错误 */ }
    },
}
```

注意：`RuntimeError` **不是**顶层 `Error` 的变体。它是 `AgentRuntime::run()` 使用的独立错误类型。

## Result 类型

使用 crate 级别的 `Result<T>` 类型以方便使用：

```rust
use behest::prelude::*;

fn my_function() -> Result<String> {
    // 可能失败的函数返回 Result<T>
    Ok("success".to_string())
}
```

## 错误传播

使用 `?` 操作符进行错误传播：

```rust
use behest::prelude::*;

async fn process_request() -> Result<ChatResponse> {
    let mut registry = ProviderRegistry::new();
    // ... 注册提供商 ...

    let request = ChatRequest::new(ModelName::new("gpt-4"))
        .with_user_text("Hello!");

    let response = registry.complete(&ProviderId::new("openai"), request).await?;
    Ok(response)
}
```

## 错误上下文

使用 `map_err` 为错误添加上下文：

```rust
use behest::prelude::*;

let response = registry.complete(&provider_id, request).await
    .map_err(|e| {
        eprintln!("请求完成失败: {}", e);
        e
    })?;
```

## 可重试错误

`ProviderError` 有 `is_retryable()` 方法用于检查重试是否可能成功：

```rust
if e.is_retryable() {
    // 使用退避策略重试
}
```

可重试变体：`RateLimited`、`Timeout`、`Overloaded`、`Transport`。

## 上下文溢出检测

`ProviderError` 有 `is_context_overflow()` 方法，用于检测请求是否超出了模型的上下文窗口：

```rust
if e.is_context_overflow() {
    // 触发压缩并重试
}
```

## 最佳实践

1. **处理特定错误**：尽可能匹配特定的错误变体
2. **提供上下文**：为错误添加上下文以便更好地调试
3. **使用 `?` 操作符**：使用 `?` 传播错误使代码更简洁
4. **记录错误**：记录错误以便调试和监控
5. **在瞬态错误时重试**：使用 `is_retryable()` 决定是否重试
6. **优雅降级**：在生产环境中优雅地处理错误

## 示例：完整的错误处理

```rust
use behest::prelude::*;

async fn safe_complete(
    registry: &ProviderRegistry,
    provider_id: &ProviderId,
    request: ChatRequest,
) -> Result<ChatResponse> {
    let mut retries = 3;

    loop {
        match registry.complete(provider_id, request.clone()).await {
            Ok(response) => return Ok(response),
            Err(Error::Provider(e)) if e.is_retryable() && retries > 0 => {
                eprintln!("重试中，错误: {e}");
                retries -= 1;
                tokio::time::sleep(std::time::Duration::from_secs(1)).await;
            }
            Err(e) => return Err(e),
        }
    }
}
```

## 参见

- [架构](architecture.md) - 运行时模型
- [提供商](providers.md) - 提供商配置
- [快速开始](getting-started.md) - 基本设置
