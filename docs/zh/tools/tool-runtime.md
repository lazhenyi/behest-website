---
title: ToolRuntime
description: tool 执行的 schema 校验、per-tool 超时与并发分区。
group: tools
order: 5
summary: schema 校验、per-tool 超时、并发分区。
related:
  - tools/tool-trait
  - tools/tool-registry
  - runtime/turn-fsm
---

# `ToolRuntime`

> `ToolRegistry` 之上的执行层。

`ToolRuntime` 在原始 `ToolRegistry` 之上增加了 schema 校验、per-tool 超时、并发分区和执行记录。它是 Turn FSM 中 `ExecutingTools` 状态使用的**运行时级** tool 执行引擎。

完整源码在 `src/runtime/tool.rs`。

## API

```rust
impl ToolRuntime {
    pub fn new(registry: Arc<ToolRegistry>, config: ToolRuntimeConfig) -> Self;
    pub async fn execute_batch(
        &self, calls: &[ToolCall], session_id: Uuid, run_id: RunId,
    ) -> Result<Vec<ToolExecution>, RuntimeError>;
}

pub struct ToolRuntimeConfig {
    pub default_timeout: Duration,      // default 30s
    pub validate_schema: bool,           // default true
    pub record_execution: bool,          // default true
    pub max_concurrent: usize,           // default 16
}
```

## 并发分区

调用被分为两组：
1. **并发组** —— `is_concurrency_safe == true` 的调用 → 通过 `tokio::join!` 一起派发。
2. **排他组** —— `is_concurrency_safe == false` 的唯一 tool → 按 tool 名顺序派发。

## 超时

每个 tool 调用被包在 `tokio::time::timeout(tool_timeout, registry.execute(call))` 中。超时触发返回 `ToolError::Timeout`，同批中其它调用不受影响。

## 边界情况

- **禁用 schema 校验** —— `validate_schema: false` 跳过校验。
- **全部调用排他** —— 批处理顺序执行。
- **禁用执行记录** —— `record_execution: false` 跳过 `ExecutionStore` 写入。

## 另见

- **[Tool Trait](tool-trait.md)** —— 基础合约。
- **[ToolRegistry](tool-registry.md)** —— 原始注册表。
- **[Turn FSM](../runtime/turn-fsm.md)** —— `ExecutingTools` 状态。
