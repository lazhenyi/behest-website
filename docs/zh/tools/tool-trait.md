---
title: Tool Trait
description: " \"`Tool` 的基础合约：name、description、schema、execute。\""
group: tools
order: 1
summary: " `Tool` 的基础合约：name、description、schema、execute。"
related:
  - tools/function-tool
  - tools/tool-runtime
  - tools/tool-registry
---

# `Tool` Trait

> 任何可执行 tool 的基础合约。

每个可调用的 tool 实现 `Tool` trait。Tool 是一个自描述单元，有稳定的 name、人类可读的 description、参数的 JSON Schema，以及一个 `execute` 方法。

完整源码在 `src/tool.rs`。

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

`to_spec` 返回模型看到的 `ToolSpec`：

```rust
pub struct ToolSpec {
    pub name: String,
    pub description: String,
    pub parameters: serde_json::Value,  // JSON Schema
}
```

Spec 在 tool 可用时作为每次 chat 请求的一部分发送。

## 标记

- `is_read_only` —— true 表示 tool 不修改状态。只读 tool 有资格并发执行。
- `is_concurrency_safe` —— true 表示 tool 自身并发安全。false 意味着 tool 必须排他运行（整个 runtime 同时只能有一个实例在跑）。

## 另见

- **[FunctionTool](function-tool.md)** —— 基于闭包的实现。
- **[ToolRuntime](tool-runtime.md)** —— 执行 tool 的运行时。
