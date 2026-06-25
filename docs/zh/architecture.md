# 架构

## 运行时模型

在运行时层，`AgentRuntime` 编排完整的 agent 循环：

```text
RunRequest
  -> 加载或创建会话
  -> 准入输入
  -> 构建上下文
  -> 调用模型提供商
  -> 流式/持久化助手输出
  -> 执行工具调用
  -> 追加工具结果
  -> 重复直到完成、限制或错误
  -> 发射 AgentEvent 值
```

运行时将以下组件整合在一起：

- `ProviderRegistry`
- `ContextPipeline`
- `ToolRuntime`
- `RuntimeStore`
- `RuntimePolicy`
- `CompactionService`
- `SessionGate`
- 可选事件发布器
- 可选快照存储
- 可选后台任务池

## 错误模型

`behest` 暴露类型化的错误类别，而不是字符串化的框架失败：

- `ProviderError`
- `ToolError`
- `StorageError`
- `ContextError`
- `RuntimeError`
- 顶级 `Error`
- crate 级别 `Result<T>`

提供商错误区分不支持的能力、可重试失败、传输失败、无效响应和适配器特定错误。

工具错误区分缺失工具、无效参数、执行失败、超时和未实现的外部工具。

## Lint 策略

crate 有意保持严格：

- `unsafe_code = "forbid"`
- `missing_docs = "deny"`
- `unreachable_pub = "deny"`
- `clippy::all = "deny"`
- `dbg_macro = "deny"`
- `expect_used = "deny"`
- `todo = "deny"`
- `unimplemented = "deny"`
- `unwrap_used = "deny"`

该项目将公共 API 清晰度和失败路径卫生视为运行时契约的一部分。

## 设计原则

### 类型安全优先

所有公共 API 都使用强类型，避免字符串化配置或动态分发（除非必要）。

### 显式错误

错误类型明确区分不同的失败模式，使调用者能够适当响应。

### 可组合性

组件通过 trait 抽象，允许替换和扩展，而无需修改核心逻辑。

### 最小公共表面

公共 API 有意保持紧凑，隐藏实现细节，同时提供足够的灵活性。

## 另请参阅

- [提供商](providers.md) - 提供商实现
- [工具](tools.md) - 工具运行时
- [事件](events.md) - 事件系统
