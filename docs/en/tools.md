# Tools

Tools are explicit runtime objects in behest. Each tool exposes a stable name, a human-readable description, and a JSON Schema argument contract.

## Defining Tools

### FunctionTool

Create a tool using `FunctionTool`:

```rust
use behest::prelude::*;
use serde_json::{json, Value};

let tool = FunctionTool::new(
    "echo",
    "Echoes the input message.",
    json!({
        "type": "object",
        "properties": {
            "message": { "type": "string" }
        },
        "required": ["message"]
    }),
    |args: Value| async move {
        Ok(args.get("message").cloned().unwrap_or(Value::Null))
    },
)
.read_only()
.concurrency_safe();
```

### Tool Properties

Tools can have additional properties:

- `.read_only()` - Marks the tool as read-only (no side effects)
- `.concurrency_safe()` - Marks the tool as safe for concurrent execution

## Tool Registry

Register tools in a `ToolRegistry`:

```rust
use behest::prelude::*;

let registry = ToolRegistry::new();
registry.register(tool);
```

## Executing Tools

Execute tool calls returned by a provider:

```rust
use behest::prelude::*;
use serde_json::json;

let call = ToolCall::new("call_1", "echo", json!({ "message": "hello" }));
let output = registry.execute(&call).await?;
```

## External Tools

For tools that are implemented outside the runtime, use `ExternalTool`:

```rust
use behest::prelude::*;
use serde_json::json;

let external_tool = ExternalTool::new(
    "web_search",
    "Searches the web for information.",
    json!({
        "type": "object",
        "properties": {
            "query": { "type": "string" }
        },
        "required": ["query"]
    }),
);
```

## Tool Schema Generation

Tools automatically generate JSON Schema from their definitions. This schema is used by providers to understand what arguments a tool expects.

## Best Practices

1. **Use descriptive names**: Tool names should be clear and descriptive
2. **Provide detailed descriptions**: Help the model understand when to use the tool
3. **Define required fields**: Use `"required"` in the schema for mandatory arguments
4. **Mark read-only tools**: Use `.read_only()` for tools without side effects
5. **Mark concurrency-safe tools**: Use `.concurrency_safe()` for tools that can run in parallel

## Example: Multi-Tool Setup

```rust
use behest::prelude::*;
use serde_json::{json, Value};

let calculator = FunctionTool::new(
    "calculate",
    "Performs basic arithmetic operations.",
    json!({
        "type": "object",
        "properties": {
            "expression": { "type": "string" }
        },
        "required": ["expression"]
    }),
    |args: Value| async move {
        let expr = args.get("expression")
            .and_then(|v| v.as_str())
            .unwrap_or("0");
        // Simple evaluation for demonstration
        Ok(json!({ "result": expr }))
    },
)
.read_only()
.concurrency_safe();

let logger = FunctionTool::new(
    "log",
    "Logs a message to the console.",
    json!({
        "type": "object",
        "properties": {
            "message": { "type": "string" },
            "level": { 
                "type": "string",
                "enum": ["info", "warn", "error"]
            }
        },
        "required": ["message"]
    }),
    |args: Value| async move {
        let message = args.get("message")
            .and_then(|v| v.as_str())
            .unwrap_or("");
        println!("Log: {}", message);
        Ok(json!({ "logged": true }))
    },
);

let registry = ToolRegistry::new();
registry.register(calculator);
registry.register(logger);
```
