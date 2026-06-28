---
title: ToolRegistry
description: " \"The global tool registry: register, lookup, list specs, execute.\""
group: tools
order: 4
summary: " The global tool registry: register, lookup, list specs, execute."
related:
  - tools/tool-trait
  - tools/tool-runtime
  - tools/scoped-tool-registry
---

# `ToolRegistry`

> The global pool of tools.

`ToolRegistry` is the flat collection of all registered tools. Tools are keyed by name; duplicates are rejected. The registry is read concurrently during context construction (to build the `tools: Vec<ToolSpec>` field of a `ChatRequest`) and during tool execution (to dispatch a `ToolCall`).

The full file is `src/tool.rs`.

## API

```rust
impl ToolRegistry {
    pub fn new() -> Self;
    pub fn register<N: Into<String>>(&self, name: N, tool: Arc<dyn Tool>) -> Result<(), ToolError>;
    pub fn get(&self, name: &str) -> Option<Arc<dyn Tool>>;
    pub fn list_specs(&self) -> Vec<ToolSpec>;
    pub fn names(&self) -> Vec<String>;
    pub async fn execute(&self, call: &ToolCall) -> ToolResult<ToolOutput>;
}
```

### Errors

```rust
pub enum ToolError {
    AlreadyRegistered { name: String },
    NotFound { name: String },
    InvalidArguments { name: String, message: String },
    ExecutionFailed { name: String, source: String },
    Timeout { name: String, elapsed: Duration },
    NotImplemented { name: String },
}
```

## Registration

```rust
use std::sync::Arc;
use behest::tool::{ToolRegistry, FunctionTool};

let registry = ToolRegistry::new();
let echo = FunctionTool::new("echo", "Echoes input.", schema, |args| async move {
    Ok(args.get("message").cloned().unwrap_or(Value::Null))
});
registry.register("echo", Arc::new(echo))?;
// Second registration with same name fails:
assert!(registry.register("echo", Arc::new(another_echo)).is_err());
```

## Spec generation

`list_specs()` returns the `ToolSpec` for every registered tool. Called by `ContextPipeline` when building a `ChatRequest`:

```rust
let specs = registry.list_specs();
let request = ChatRequest::new(model).with_tools(specs);
```

## Execution

`execute` looks up the tool by name, validates arguments against the JSON Schema, and dispatches. Missing tool returns `ToolError::NotFound`. Invalid arguments return `ToolError::InvalidArguments`.

```rust
let call = ToolCall::new("call_1", "echo", json!({ "message": "hello" }));
let output = registry.execute(&call).await?;
```

## Concurrency

The registry is `Send + Sync`. Multiple runs can call `execute` concurrently; the underlying `HashMap` is behind a `RwLock`. `list_specs` takes a read lock; `register` takes a write lock.

## Edge cases

- **Same name twice** — `ToolError::AlreadyRegistered`.
- **Tool removed between spec gen and execution** — `ToolError::NotFound`. Run loop handles as failed tool call.
- **Empty registry** — `list_specs` returns `vec![]`. Model receives no tools.

## See also

- **[Tool Trait](tool-trait.md)** — the base contract.
- **[ToolRuntime](tool-runtime.md)** — the execution layer.
- **[ScopedToolRegistry](scoped-tool-registry.md)** — LIFO shadow stack.
