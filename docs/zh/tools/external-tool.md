---
title: ExternalTool
description: 仅声明 schema 的 tool 占位符，用于外部执行面。
group: tools
order: 3
summary: 仅声明 schema 的 tool 占位符，用于外部执行面。
related:
  - tools/tool-trait
  - tools/tool-registry
---

# `ExternalTool`

> 只有 schema 的 tool 占位符。

`ExternalTool` 声明一个 tool 的名称、描述和 JSON Schema，但不提供 `execute` 实现。它用于标记一个 tool 对模型"可用"，而实际执行发生在运行时之外——CLI、WebSocket handler 或外部服务中。

完整源码在 `src/tool.rs`。

## 为什么需要纯 schema 的 tool

有些 tool 无法在 Rust 进程内执行。`web_search` 可能由独立的搜索服务支撑；`deploy` 可能触发 CI 流水线。模型仍然需要看到 tool spec 才能发出正确的 `ToolCall`；运行时需要知道这个 tool 存在才能校验调用。`ExternalTool` 弥合了这个差距。

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

对 `ExternalTool` 调用 `execute` 返回 `ToolError::NotImplemented`。

## 完整示例

```rust
use serde_json::json;
use behest::tool::ExternalTool;

let search = ExternalTool::new(
    "web_search",
    "搜索网络获取最新信息。",
    json!({
        "type": "object",
        "properties": { "query": { "type": "string" } },
        "required": ["query"]
    }),
);
registry.register("web_search", Arc::new(search))?;

// 外部 handler 订阅：
invocation.on(|envelope, control| {
    if let EventKind::Tool(ToolStreamEvent::Call { call, .. }) = envelope.kind {
        if call.tool_name == "web_search" {
            let result = external_service.search(&call.arguments);
        }
    }
});
```

## 边界情况

- **没有外部 handler** —— 运行时返回 `ToolError::NotImplemented`，run 终止为 `Failed`。
- **多个 handler** —— 每个收到副本。用 `call_id` 去重。
- **Schema 校验** —— `ToolRuntime` 在派发前校验参数。

## 另见

- **[Tool Trait](tool-trait.md)** —— 基础合约。
- **[ToolRegistry](tool-registry.md)** —— 注册 tool。
- **[ToolRuntime](tool-runtime.md)** —— 执行层。
