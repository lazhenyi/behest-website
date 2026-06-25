# 工具

工具是 behest 中的显式运行时对象。每个工具暴露一个稳定的名称、一个人类可读的描述和一个 JSON Schema 参数契约。

## 定义工具

### FunctionTool

使用 `FunctionTool` 创建工具：

```rust
use behest::prelude::*;
use serde_json::{json, Value};

let tool = FunctionTool::new(
    "echo",
    "回显输入消息。",
    json!({
        "type": "object",
        "properties": {
            "message": { "type": "string" }
        },
        "required": ["message"]
    }),
    |args: Value| async move {
        Ok(args.get("message").cloned().unwrap_or(Value::Null))
    },
)
.read_only()
.concurrency_safe();
```

### 工具属性

工具可以有额外的属性：

- `.read_only()` - 标记工具为只读（无副作用）
- `.concurrency_safe()` - 标记工具为可安全并发执行

## 工具注册表

在 `ToolRegistry` 中注册工具：

```rust
use behest::prelude::*;

let registry = ToolRegistry::new();
registry.register(tool);
```

## 执行工具

执行提供商返回的工具调用：

```rust
use behest::prelude::*;
use serde_json::json;

let call = ToolCall::new("call_1", "echo", json!({ "message": "hello" }));
let output = registry.execute(&call).await?;
```

## ExternalTool

对于在运行时外部实现的工具，使用 `ExternalTool`：

```rust
use behest::prelude::*;
use serde_json::json;

let external_tool = ExternalTool::new(
    "web_search",
    "在网络上搜索信息。",
    json!({
        "type": "object",
        "properties": {
            "query": { "type": "string" }
        },
        "required": ["query"]
    }),
);
```

## 工具 Schema 生成

工具会自动从其定义生成 JSON Schema。此 schema 用于提供商理解工具期望的参数。

## 最佳实践

1. **使用描述性名称**：工具名称应该清晰且具有描述性
2. **提供详细描述**：帮助模型理解何时使用该工具
3. **定义必需字段**：在 schema 中使用 `"required"` 表示强制参数
4. **标记只读工具**：对无副作用的工具使用 `.read_only()`
5. **标记并发安全工具**：对可以并行运行的工具使用 `.concurrency_safe()`

## 示例：多工具设置

```rust
use behest::prelude::*;
use serde_json::{json, Value};

let calculator = FunctionTool::new(
    "calculate",
    "执行基本算术运算。",
    json!({
        "type": "object",
        "properties": {
            "expression": { "type": "string" }
        },
        "required": ["expression"]
    }),
    |args: Value| async move {
        let expr = args.get("expression")
            .and_then(|v| v.as_str())
            .unwrap_or("0");
        Ok(json!({ "result": format!("已计算: {}", expr) }))
    },
)
.read_only()
.concurrency_safe();

let logger = FunctionTool::new(
    "log",
    "将消息记录到控制台。",
    json!({
        "type": "object",
        "properties": {
            "message": { "type": "string" },
            "level": { 
                "type": "string",
                "enum": ["info", "warn", "error"]
            }
        },
        "required": ["message"]
    }),
    |args: Value| async move {
        let message = args.get("message")
            .and_then(|v| v.as_str())
            .unwrap_or("");
        println!("日志: {}", message);
        Ok(json!({ "logged": true }))
    },
);

let registry = ToolRegistry::new();
registry.register(calculator);
registry.register(logger);
```
