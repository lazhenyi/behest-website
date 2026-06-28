---
title: Tool Trait
description: " \"The base `Tool` contract: name, description, schema, execute.\""
group: tools
order: 1
summary: " The base `Tool` contract: name, description, schema, execute."
related:
  - tools/function-tool
  - tools/tool-runtime
  - tools/tool-registry
---

# `Tool` Trait

> The base contract for any executable tool.

Every callable tool implements the `Tool` trait. A tool is a self-describing unit with a stable name, a human-readable description, a JSON Schema for its arguments, and an `execute` method.

The full file is `src/tool.rs`.

## API

```rust
#[async_trait]
pub trait Tool: Send + Sync {
    fn name(&self) -> &str;
    fn description(&self) -> &str;
    fn parameters_schema(&self) -> serde_json::Value;
    async fn execute(&self, arguments: serde_json::Value) -> ToolResult<ToolOutput>;
    fn is_read_only(&self) -> bool { false }
    fn is_concurrency_safe(&self) -> bool { false }
    fn to_spec(&self) -> ToolSpec;
}
```

## Spec

`to_spec` returns the `ToolSpec` that the model sees:

```rust
pub struct ToolSpec {
    pub name: String,
    pub description: String,
    pub parameters: serde_json::Value,  // JSON Schema
}
```

The spec is sent as part of every chat request when tools are available.

## Markers

- `is_read_only` — true if the tool does not modify state. Read-only tools are eligible for parallel execution.
- `is_concurrency_safe` — true if the tool is safe to run concurrently with itself. False means the tool must run exclusively (one instance at a time across the whole runtime).

## See also

- **[FunctionTool](function-tool.md)** — the closure-backed impl.
- **[ToolRuntime](tool-runtime.md)** — the runtime that executes tools.
