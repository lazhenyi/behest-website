# Error Handling

`behest` exposes typed error categories instead of stringly framework failures. This makes error handling explicit and helps you handle different error scenarios appropriately.

## Error Types

### ProviderError

Errors from model providers:

```rust
use behest::prelude::*;

match result {
    Err(Error::Provider(e)) => match e {
        ProviderError::UnsupportedCapability(cap) => {
            eprintln!("Provider doesn't support: {}", cap);
        }
        ProviderError::Retryable(msg) => {
            eprintln!("Temporary error, retry: {}", msg);
        }
        ProviderError::Transport(err) => {
            eprintln!("Network error: {}", err);
        }
        ProviderError::InvalidResponse(msg) => {
            eprintln!("Bad response from provider: {}", msg);
        }
        ProviderError::Adapter(msg) => {
            eprintln!("Adapter-specific error: {}", msg);
        }
    },
    // ... handle other errors
}
```

### ToolError

Errors from tool execution:

```rust
use behest::prelude::*;

match result {
    Err(Error::Tool(e)) => match e {
        ToolError::NotFound(name) => {
            eprintln!("Tool not found: {}", name);
        }
        ToolError::InvalidArguments(msg) => {
            eprintln!("Invalid tool arguments: {}", msg);
        }
        ToolError::ExecutionFailed(msg) => {
            eprintln!("Tool execution failed: {}", msg);
        }
        ToolError::Timeout(duration) => {
            eprintln!("Tool timed out after {:?}", duration);
        }
        ToolError::Unimplemented(name) => {
            eprintln!("External tool not implemented: {}", name);
        }
    },
    // ... handle other errors
}
```

### StorageError

Errors from storage operations:

```rust
use behest::prelude::*;

match result {
    Err(Error::Storage(e)) => match e {
        StorageError::NotFound(key) => {
            eprintln!("Key not found: {}", key);
        }
        StorageError::ConnectionFailed(msg) => {
            eprintln!("Storage connection failed: {}", msg);
        }
        StorageError::Serialization(msg) => {
            eprintln!("Serialization error: {}", msg);
        }
        StorageError::Internal(msg) => {
            eprintln!("Internal storage error: {}", msg);
        }
    },
    // ... handle other errors
}
```

### ContextError

Errors from context building:

```rust
use behest::prelude::*;

match result {
    Err(Error::Context(e)) => match e {
        ContextError::AdapterFailed(msg) => {
            eprintln!("Context adapter failed: {}", msg);
        }
        ContextError::TokenLimitExceeded {
            limit,
            actual,
        } => {
            eprintln!(
                "Context too long: {} tokens (limit: {})",
                actual, limit
            );
        }
    },
    // ... handle other errors
}
```

### RuntimeError

Errors from the runtime:

```rust
use behest::prelude::*;

match result {
    Err(Error::Runtime(e)) => match e {
        RuntimeError::SessionClosed => {
            eprintln!("Session is closed");
        }
        RuntimeError::PolicyViolation(msg) => {
            eprintln!("Policy violation: {}", msg);
        }
        RuntimeError::DoomLoopDetected => {
            eprintln!("Doom loop detected");
        }
        RuntimeError::LimitExceeded(limit) => {
            eprintln!("Limit exceeded: {}", limit);
        }
    },
    // ... handle other errors
}
```

## Top-Level Error

The top-level `Error` enum wraps all error types:

```rust
use behest::prelude::*;

match result {
    Ok(value) => {
        // Handle success
    }
    Err(e) => match e {
        Error::Provider(e) => { /* Handle provider error */ }
        Error::Tool(e) => { /* Handle tool error */ }
        Error::Storage(e) => { /* Handle storage error */ }
        Error::Context(e) => { /* Handle context error */ }
        Error::Runtime(e) => { /* Handle runtime error */ }
        Error::Config(e) => { /* Handle config error */ }
        Error::Internal(msg) => { /* Handle internal error */ }
    },
}
```

## Result Type

Use the crate-level `Result<T>` type for convenience:

```rust
use behest::prelude::*;

fn my_function() -> Result<String> {
    // Functions that can fail return Result<T>
    Ok("success".to_string())
}
```

## Error Propagation

Use `?` operator for error propagation:

```rust
use behest::prelude::*;

async fn process_request() -> Result<ChatResponse> {
    let config = AgentConfig::builder()
        .with_file("behest.toml")?
        .build()?;

    let runtime = config.into_runtime().await?;

    let request = ChatRequest::new(ModelName::new("gpt-4"))
        .with_user_text("Hello!");

    let response = runtime.complete(request).await?;
    Ok(response)
}
```

## Error Context

Add context to errors using `map_err`:

```rust
use behest::prelude::*;

let response = runtime.complete(request).await
    .map_err(|e| {
        eprintln!("Failed to complete request: {}", e);
        e
    })?;
```

## Best Practices

1. **Handle specific errors**: Match on specific error variants when possible
2. **Provide context**: Add context to errors for better debugging
3. **Use `?` operator**: Propagate errors with `?` for cleaner code
4. **Log errors**: Log errors for debugging and monitoring
5. **Retry on transient errors**: Retry on `ProviderError::Retryable`
6. **Graceful degradation**: Handle errors gracefully in production

## Example: Complete Error Handling

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
                eprintln!("Retrying after error: {}", msg);
                retries -= 1;
                tokio::time::sleep(std::time::Duration::from_secs(1)).await;
            }
            Err(e) => return Err(e),
        }
    }
}
```

## See Also

- [Architecture](architecture.md) - Runtime model
- [Providers](providers.md) - Provider configuration
- [Getting Started](getting-started.md) - Basic setup
