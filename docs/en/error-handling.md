# Error Handling

`behest` exposes typed error categories instead of stringly framework failures. This makes error handling explicit and helps you handle different error scenarios appropriately.

## Error Types

### ProviderError

Errors from model providers:

```rust
use behest::prelude::*;

match result {
    Err(Error::Provider(e)) => match e {
        ProviderError::Authentication { provider } => {
            eprintln!("Auth failed for provider: {provider}");
        }
        ProviderError::BadRequest { provider, message } => {
            eprintln!("Provider {provider} rejected request: {message}");
        }
        ProviderError::RateLimited { provider, retry_after } => {
            eprintln!("Provider {provider} rate limited, retry after: {retry_after:?}");
        }
        ProviderError::Timeout { provider } => {
            eprintln!("Provider {provider} timed out");
        }
        ProviderError::Overloaded { provider } => {
            eprintln!("Provider {provider} is overloaded");
        }
        ProviderError::Unsupported { provider, feature } => {
            eprintln!("Provider {provider} does not support: {feature}");
        }
        ProviderError::Transport { provider, source } => {
            eprintln!("Transport error for {provider}: {source}");
        }
        ProviderError::Decode { provider, message } => {
            eprintln!("Failed to decode response from {provider}: {message}");
        }
        ProviderError::Provider { provider, status, message } => {
            eprintln!("Provider {provider} error (status: {status:?}): {message}");
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
        ToolError::NotFound { name } => {
            eprintln!("Tool not found: {name}");
        }
        ToolError::InvalidArguments { name, message } => {
            eprintln!("Tool {name} received invalid arguments: {message}");
        }
        ToolError::Execution { name, message } => {
            eprintln!("Tool {name} execution failed: {message}");
        }
        ToolError::NotImplemented { name } => {
            eprintln!("Tool {name} is not implemented");
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
        StorageError::NotFound { id } => {
            eprintln!("Entity not found: {id}");
        }
        StorageError::ConnectionFailed { backend, message, .. } => {
            eprintln!("Storage connection failed ({backend}): {message}");
        }
        StorageError::SerializationFailed { message, .. } => {
            eprintln!("Serialization error: {message}");
        }
        StorageError::BackendError { backend, message, .. } => {
            eprintln!("Storage backend error ({backend}): {message}");
        }
        StorageError::MigrationFailed { backend, message, .. } => {
            eprintln!("Storage migration failed ({backend}): {message}");
        }
        StorageError::DataCorruption { field, message, .. } => {
            eprintln!("Data corruption in {field}: {message}");
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
        ContextError::AdapterFailed { adapter, message } => {
            eprintln!("Context adapter {adapter} failed: {message}");
        }
        ContextError::InvalidInput { message } => {
            eprintln!("Invalid context input: {message}");
        }
        ContextError::AdapterNotFound { adapter } => {
            eprintln!("Context adapter {adapter} not found");
        }
    },
    // ... handle other errors
}
```

### RuntimeError

Errors from the runtime. `RuntimeError` is defined in `behest::runtime::error` and is NOT a variant of the top-level `Error` enum:

```rust
use behest::runtime::RuntimeError;

match result {
    Err(RuntimeError::ProviderNotFound(name)) => {
        eprintln!("Provider not found: {name}");
    }
    Err(RuntimeError::SessionBusy(id)) => {
        eprintln!("Session {id} is busy");
    }
    Err(RuntimeError::IterationLimitExceeded(max)) => {
        eprintln!("Iteration limit {max} exceeded");
    }
    Err(RuntimeError::InputRejected { input_id, reason }) => {
        eprintln!("Input {input_id} rejected: {reason}");
    }
    Err(RuntimeError::Storage(e)) => {
        eprintln!("Storage error: {e}");
    }
    // ... handle other variants
}
```

## Top-Level Error

The top-level `Error` enum wraps four error categories plus config errors:

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
        Error::Config(msg) => { /* Handle config error */ }
    },
}
```

Note: `RuntimeError` is NOT a variant of the top-level `Error`. It is a separate error type used by `AgentRuntime::run()`.

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
    let mut registry = ProviderRegistry::new();
    // ... register providers ...

    let request = ChatRequest::new(ModelName::new("gpt-4"))
        .with_user_text("Hello!");

    let response = registry.complete(&ProviderId::new("openai"), request).await?;
    Ok(response)
}
```

## Error Context

Add context to errors using `map_err`:

```rust
use behest::prelude::*;

let response = registry.complete(&provider_id, request).await
    .map_err(|e| {
        eprintln!("Failed to complete request: {}", e);
        e
    })?;
```

## Retryable Errors

`ProviderError` has an `is_retryable()` method for checking if a retry might succeed:

```rust
if e.is_retryable() {
    // Retry with backoff
}
```

Retryable variants: `RateLimited`, `Timeout`, `Overloaded`, `Transport`.

## Context Overflow Detection

`ProviderError` has an `is_context_overflow()` method that detects when the request exceeded the model's context window:

```rust
if e.is_context_overflow() {
    // Trigger compaction and retry
}
```

## Best Practices

1. **Handle specific errors**: Match on specific error variants when possible
2. **Provide context**: Add context to errors for better debugging
3. **Use `?` operator**: Propagate errors with `?` for cleaner code
4. **Log errors**: Log errors for debugging and monitoring
5. **Retry on transient errors**: Use `is_retryable()` to decide retry
6. **Graceful degradation**: Handle errors gracefully in production

## Example: Complete Error Handling

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
                eprintln!("Retrying after error: {e}");
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
