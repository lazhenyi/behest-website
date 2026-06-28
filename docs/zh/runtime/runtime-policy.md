---
title: RuntimePolicy
description: "`AgentRuntime` 的运维限制、预算与超时。"
group: runtime
order: 11
summary: 限制、预算、超时与准入控制。
related:
  - runtime/agent-runtime
  - runtime/turn-fsm
  - config/agent-config
---

# `RuntimePolicy`

> 限制运行时每个维度的单一结构。

`RuntimePolicy` 是 `AgentRuntime::new` 消费的运维配置。它持有限制、预算、超时、准入控制参数。构造后**不可变**；改变 policy 意味着构造一个新的 runtime。

完整源码在 `src/runtime/policy.rs`。

## 定义

```rust
pub struct RuntimePolicy {
    pub max_iterations: usize,            // default 16
    pub max_input_tokens: usize,          // default 128_000
    pub max_total_tokens: usize,          // default 256_000
    pub provider_timeout: Duration,       // default 60s
    pub tool_timeout: Duration,           // default 30s per tool
    pub session_gate: SessionGateConfig,
    pub input_admission: InputAdmissionConfig,
    pub router: RouterPolicy,
    pub event_buffer: usize,              // default 1024
}
```

## 默认值

| 字段 | 默认 | 效果 |
|---|---|---|
| `max_iterations` | 16 | Turn FSM 在每个 run 这么多次迭代后失败。 |
| `max_input_tokens` | 128_000 | `ContextPipeline` 拒绝更大的输入。 |
| `max_total_tokens` | 256_000 | 一次 run 的累计 token 预算。 |
| `provider_timeout` | 60 s | 单次模型调用的 wall-clock 上限。 |
| `tool_timeout` | 30 s | 单次 tool 执行的 wall-clock 上限。 |
| `event_buffer` | 1024 | `AgentEvent` 的 broadcast channel 缓冲区。 |

`SessionGateConfig`、`InputAdmissionConfig`、`RouterPolicy` 各自有默认实现。

## 构造

```rust
use std::time::Duration;
use behest::runtime::policy::RuntimePolicy;

let policy = RuntimePolicy {
    max_iterations: 32,
    max_total_tokens: 1_000_000,
    provider_timeout: Duration::from_secs(120),
    ..Default::default()
};
```

`..Default::default()` 模式是推荐惯用法；让你只覆盖关心的字段。

## 另见

- **[AgentRuntime](agent-runtime.md)** —— 消费者。
- **[Turn FSM](turn-fsm.md)** —— `CheckingPolicy` 状态读取 `max_iterations` 与 `max_total_tokens`。
- **[ModelRouter](model-router.md)** —— 读 `provider_timeout`。
- **[CompactionService](compaction-service.md)** —— 在 `max_input_tokens` 超出时触发。
