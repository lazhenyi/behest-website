---
title: FunctionTool
description: 基于闭包的 tool 实现，附带 read-only 与 concurrency-safe 标记。
group: tools
order: 2
summary: 基于闭包的 tool，附带 read-only 与 concurrency-safe 标记。
related:
  - tools/tool-trait
  - tools/tool-registry
---

# `FunctionTool<F>`

> 由闭包定义的 tool。

`FunctionTool` 是定义 tool 最常见的方式：传一个闭包，得到一个 `Tool` 实现。

完整源码在 `src/tool.rs`。

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

## 完整示例

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

## 另见

- **[Tool Trait](tool-trait.md)** —— 基础合约。
- **[ToolRegistry](tool-registry.md)** —— 注册 tool。
