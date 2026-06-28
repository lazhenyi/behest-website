---
title: ScopedToolRegistry
description: LIFO shadow-stack 注册表：turn → run → agent → base。
group: tools
order: 6
summary: LIFO shadow-stack：turn → run → agent → base。
related:
  - tools/tool-registry
  - tools/tool-runtime
---

# `ScopedToolRegistry`

> 每个作用域的 LIFO shadow-stack。

`ScopedToolRegistry` 允许一个 tool 只在特定作用域（turn、run、agent）内可见。它不是独立的注册表 —— 它是在基础 `ToolRegistry` 之上的**栈**；查找从栈顶向下走。在 **turn** 作用域注册的 tool 会遮蔽 **agent** 作用域的同名 tool。

完整源码在 `src/tool_scope.rs`。

## 作用域

| 作用域 | 生命周期 | 用例 |
|---|---|---|
| `Base` | 运行期 | 全局 tool 集合。 |
| `Agent` | Agent 定义 | 由 `AgentRegistry` 条目注册的 tool。 |
| `Run` | 一次 `RunRequest` | 调用方为本次 run 注入的 tool。 |
| `Turn` | 一次 Turn FSM 迭代 | 在 turn 中间动态生成的 tool。 |

## API

```rust
impl ScopedToolRegistry {
    pub fn new(base: Arc<ToolRegistry>) -> Self;
    pub fn register_turn(&self, name: &str, tool: Arc<dyn Tool>) -> Result<(), ToolError>;
    pub fn register_run(&self, name: &str, tool: Arc<dyn Tool>) -> Result<(), ToolError>;
    pub fn register_agent(&self, name: &str, tool: Arc<dyn Tool>) -> Result<(), ToolError>;
    pub fn get(&self, name: &str) -> Option<Arc<dyn Tool>>;
    pub fn list_specs(&self) -> Vec<ToolSpec>;
}
```

## 另见

- **[ToolRegistry](tool-registry.md)** —— 基础注册表。
- **[ToolRuntime](tool-runtime.md)** —— 使用本组件的运行时。
