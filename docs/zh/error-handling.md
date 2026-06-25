# 错误处理

`behest` 暴露类型化的错误类别，而不是字符串化的框架失败。这使得错误处理显式化，并帮助您适当地处理不同的错误场景。

## 错误类型

### ProviderError

来自模型提供商的错误：

```rust
use behest::prelude::*;

match result {
    Err(Error::Provider(e)) => match e {
        ProviderError::UnsupportedCapability(cap) => {
            eprintln!("提供商不支持: {}", cap);
        }
        ProviderError::Retryable(msg) => {
            eprintln!("临时错误，重试: {}", msg);
        }
        ProviderError::Transport(err) => {
            eprintln!("网络错误: {}", err);
        }
        ProviderError::InvalidResponse(msg) => {
            eprintln!("来自提供商的无效响应: {}", msg);
        }
        ProviderError::Adapter(msg) => {
            eprintln!("适配器特定错误: {}", msg);
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
        ToolError::NotFound(name) => {
            eprintln!("工具未找到: {}", name);
        }
        ToolError::InvalidArguments(msg) => {
            eprintln!("无效的工具参数: {}", msg);
        }
        ToolError::ExecutionFailed(msg) => {
            eprintln!("工具执行失败: {}", msg);
        }
        ToolError::Timeout(duration) => {
            eprintln!("工具超时，等待了 {:?}", duration);
        }
        ToolError::Unimplemented(name) => {
            eprintln!("外部工具未实现: {}", name);
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
        StorageError::NotFound(key) => {
            eprintln!("键未找到: {}", key);
        }
        StorageError::ConnectionFailed(msg) => {
            eprintln!("存储连接失败: {}", msg);
        }
        StorageError::Serialization(msg) => {
            eprintln!("序列化错误: {}", msg);
        }
        StorageError::Internal(msg) => {
            eprintln!("内部存储错误: {}", msg);
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
        ContextError::AdapterFailed(msg) => {
            eprintln!("上下文适配器失败: {}", msg);
        }
        ContextError::TokenLimitExceeded {
            limit,
            actual,
        } => {
            eprintln!(
                "上下文太长: {} 个 token（限制: {}）",
                actual, limit
            );
        }
    },
    // ... 处理其他错误
}
```

### RuntimeError

来自运行时的错误：

```rust
use behest::prelude::*;

match result {
    Err(Error::Runtime(e)) => match e {
        RuntimeError::SessionClosed => {
            eprintln!("会话已关闭");
        }
        RuntimeError::PolicyViolation(msg) => {
            eprintln!("策略违规: {}", msg);
        }
        RuntimeError::DoomLoopDetected => {
            eprintln!("检测到死循环");
        }
        RuntimeError::LimitExceeded(limit) => {
            eprintln!("超出限制: {}", limit);
        }
    },
    // ... 处理其他错误
}
```

## 顶级错误

顶级 `Error` 枚举包装所有错误类型：

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
        Error::Runtime(e) => { /* 处理运行时错误 */ }
        Error::Config(e) => { /* 处理配置错误 */ }
        Error::Internal(msg) => { /* 处理内部错误 */ }
    },
}
```

## Result 类型

使用 crate 级别的 `Result<T>` 类型以获得便利：

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
    let config = AgentConfig::builder()
        .with_file("behest.toml")?
        .build()?;

    let runtime = config.into_runtime().await?;

    let request = ChatRequest::new(ModelName::new("gpt-4"))
        .with_user_text("你好！");

    let response = runtime.complete(request).await?;
    Ok(response)
}
```

## 最佳实践

1. **处理特定错误**：尽可能匹配特定的错误变体
2. **提供上下文**：为错误添加上下文以获得更好的调试体验
3. **使用 `?` 操作符**：使用 `?` 传播错误以获得更简洁的代码
4. **记录错误**：为调试和监控记录错误
5. **重试瞬时错误**：对 `ProviderError::Retryable` 进行重试
6. **优雅降级**：在生产环境中优雅地处理错误

## 示例：完整错误处理

```rust
use behest::prelude::*;

async fn safe_complete(
    runtime: &AgentRuntime,
    request: ChatRequest,
) -> Result<ChatResponse> {
    let mut retries = 3;
    
    loop {
        match runtime.complete(request.clone()).await {
            Ok(response) => return Ok(response),
            Err(Error::Provider(ProviderError::Retryable(msg))) if retries > 0 => {
                eprintln!("错误后重试: {}", msg);
                retries -= 1;
                tokio::time::sleep(std::time::Duration::from_secs(1)).await;
            }
            Err(e) => return Err(e),
        }
    }
}
```

## 另请参阅

- [架构](architecture.md) - 运行时模型
- [提供商](providers.md) - 提供商配置
- [快速入门](getting-started.md) - 基本设置
