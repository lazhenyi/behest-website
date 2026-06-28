---
title: DoomLoopDetector
description: 检测重复与循环的 tool call，终止失控的 run。
group: runtime
order: 9
summary: tool call 的重复与循环检测。
related:
  - runtime/agent-runtime
  - runtime/turn-fsm
  - tools/tool-runtime
---

# `DoomLoopDetector`

> 检测 agent 反复无进展地调用同一 tool。

"doom loop" 是一种 tool call 模式，模型持续重复但没有实际变化 —— 同样的参数，或循环回到起点的参数循环。检测器抛出错误，FSM 以 `RunStatus::Failed { reason: DoomLoop }` 终止 run。

完整源码在 `src/runtime/doom_loop.rs`。

## 检测规则

1. **完全重复** —— 同一 `(tool_name, arguments_json, session_id)` 三元组连续出现 `max_consecutive_duplicates` 次（默认 3）。
2. **循环** —— 同一组 `(tool_name, args)` 指纹以 2..=`max_cycle_length`（默认 4）的循环排列出现。
3. **无进展** —— 同一 tool 被连续调用超过 `max_consecutive_same_tool` 次（默认 5），期间没有别的 tool。

任何规则触发都足以终止 run。检测器的状态是 per-session，每个 turn 开始时重置。

## API

```rust
pub struct DoomLoopDetector {
    config: DoomLoopConfig,
    state: Mutex<HashMap<Uuid, DoomLoopState>>,
}

pub struct DoomLoopConfig {
    pub max_consecutive_duplicates: usize,    // default 3
    pub max_cycle_length: usize,              // default 4
    pub max_consecutive_same_tool: usize,    // default 5
}

impl DoomLoopDetector {
    pub fn new(config: DoomLoopConfig) -> Self;
    pub fn observe(&self, session_id: Uuid, call: &ToolCall) -> Result<(), DoomLoopType>;
    pub fn reset(&self, session_id: Uuid);
}

pub enum DoomLoopType {
    Duplicate { count: usize, fingerprint: ToolCallFingerprint },
    Cycle { length: usize, fingerprints: Vec<ToolCallFingerprint> },
    NoProgress { tool: String, count: usize },
}
```

## 与其它组件的关系

- **[AgentRuntime](agent-runtime.md)** —— 在每个 tool call 之后观察检测器。
- **[Turn FSM](turn-fsm.md)** —— `ExecutingTools` 步骤是 doom loop 出现的地方。
- **[ToolRuntime](../../tools/tool-runtime)** —— 执行器。

## 另见

- **[AgentRuntime](agent-runtime.md)** —— 消费者。
- **[ToolRuntime](../../tools/tool-runtime)** —— 执行器。
