---
title: ExternalTool
description: Schema-only tool stub for external execution surfaces.
group: tools
order: 3
summary: Schema-only tool stub for external execution surfaces.
related:
  - tools/tool-trait
  - tools/tool-registry
---

# `ExternalTool`

> Schema-only tool placeholder.

`ExternalTool` declares a tool's name, description, and JSON Schema without providing an implementation. It is used to mark a tool as "available to the model" when the actual execution happens outside the runtime — in a CLI, a WebSocket handler, or an external service.

The full file is `src/tool.rs`.

## Why a schema-only tool

Some tools are not executable inside the Rust process. A `web_search` tool may be backed by a separate search service; a `deploy` tool may trigger a CI pipeline. The model still needs to see the tool spec so it can emit the correct `ToolCall`; the runtime needs to know the tool exists so it can validate the call. `ExternalTool` bridges this gap.

## API

```rust
pub struct ExternalTool {
    name: String,
    description: String,
    parameters_schema: Value,
}

impl ExternalTool {
    pub fn new(name: &str, description: &str, schema: Value) -> Self;
}

impl Tool for ExternalTool {
    async fn execute(&self, _arguments: Value) -> ToolResult<ToolOutput> {
        Err(ToolError::NotImplemented)
    }
}
```

Calling `execute` returns `ToolError::NotImplemented`. The runtime's `ExecutingTools` state catches this and emits a `ToolCall` event; the external handler picks it up from the `RuntimeInvocation` channel.

## Worked example

```rust
use serde_json::json;
use behest::tool::ExternalTool;

let search = ExternalTool::new(
    "web_search",
    "Search the web for recent information.",
    json!({
        "type": "object",
        "properties": { "query": { "type": "string" } },
        "required": ["query"]
    }),
);
registry.register("web_search", Arc::new(search))?;

// External handler subscribes:
invocation.on(|envelope, control| {
    if let EventKind::Tool(ToolStreamEvent::Call { call, .. }) = envelope.kind {
        if call.tool_name == "web_search" {
            let result = external_service.search(&call.arguments);
        }
    }
});
```

## Edge cases

- **No external handler** — runtime returns `ToolError::NotImplemented`, run terminates as `Failed`. Ensure a handler is subscribed before registering.
- **Multiple handlers** — each receives a copy. Use `call_id` for dedup.
- **Schema validation** — `ToolRuntime` validates before dispatching; the external handler receives validated JSON.

## See also

- **[Tool Trait](tool-trait.md)** — the base contract.
- **[ToolRegistry](tool-registry.md)** — registering the tool.
- **[ToolRuntime](tool-runtime.md)** — the execution layer.
