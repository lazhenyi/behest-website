---
title: FunctionTool
description: Closure-backed tool implementation with read-only and concurrency-safe markers.
group: tools
order: 2
summary: Closure-backed tool with read-only and concurrency-safe markers.
related:
  - tools/tool-trait
  - tools/tool-registry
---

# `FunctionTool<F>`

> A tool defined by a closure.

`FunctionTool` is the most common way to define a tool: pass a closure, get a `Tool` impl.

The full file is `src/tool.rs`.

## API

```rust
impl FunctionTool {
    pub fn new<F, Fut>(name: &str, description: &str, parameters: Value, f: F) -> Self
    where
        F: Fn(Value) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = ToolResult<ToolOutput>> + Send + 'static;
}

impl<F> FunctionTool<F> {
    pub fn read_only(self) -> Self;
    pub fn concurrency_safe(self) -> Self;
}
```

## Worked example

```rust
use serde_json::{json, Value};
use behest::tool::FunctionTool;

let echo = FunctionTool::new(
    "echo",
    "Echoes the input message.",
    json!({
        "type": "object",
        "properties": { "message": { "type": "string" } },
        "required": ["message"]
    }),
    |args: Value| async move {
        Ok(args.get("message").cloned().unwrap_or(Value::Null))
    },
)
.read_only()
.concurrency_safe();
```

## See also

- **[Tool Trait](tool-trait.md)** — the base contract.
- **[ToolRegistry](tool-registry.md)** — registering the tool.
