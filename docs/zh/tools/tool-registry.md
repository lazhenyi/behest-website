---
title: ToolRegistry
description: 全局 tool 注册表：注册、查找、列出 spec、执行。
group: tools
order: 4
summary: 全局 tool 注册表：注册、查找、列出 spec、执行。
related:
  - tools/tool-trait
  - tools/tool-runtime
  - tools/scoped-tool-registry
---

# `ToolRegistry`

> 全局 tool 池。

`ToolRegistry` 是所有已注册 tool 的扁平集合。Tool 以名称为 key；重复注册会被拒绝。注册表在运行时构建上下文和 tool 执行期间被并发读取。

完整源码在 `src/tool.rs`。

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

### 错误

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

## 注册

```rust
let registry = ToolRegistry::new();
let echo = FunctionTool::new("echo", "回显输入。", schema, |args| async move {
    Ok(args.get("message").cloned().unwrap_or(Value::Null))
});
registry.register("echo", Arc::new(echo))?;
// 同名第二次注册会失败
```

## Spec 生成

`list_specs()` 返回每个已注册 tool 的 `ToolSpec`，由 `ContextPipeline` 在构建 `ChatRequest` 时调用：

```rust
let specs = registry.list_specs();
let request = ChatRequest::new(model).with_tools(specs);
```

## 执行

`execute` 按名查找 tool，根据 JSON Schema 校验参数，再派发执行。找不到返回 `ToolError::NotFound`，参数不匹配返回 `ToolError::InvalidArguments`。

## 并发

注册表是 `Send + Sync`。底层 `HashMap` 在 `RwLock` 后面。`list_specs` 取读锁；`register` 取写锁。

## 边界情况

- **同名注册两次** —— `ToolError::AlreadyRegistered`。
- **空注册表** —— `list_specs` 返回 `vec![]`。

## 另见

- **[Tool Trait](tool-trait.md)** —— 基础合约。
- **[ToolRuntime](tool-runtime.md)** —— 执行层。
- **[ScopedToolRegistry](scoped-tool-registry.md)** —— LIFO shadow stack。
