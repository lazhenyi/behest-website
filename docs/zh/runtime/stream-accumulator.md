---
title: StreamAccumulator
description: 增量拼接流式文本与 tool call 参数，形成完整的 `Message::Assistant`。
group: runtime
order: 12
summary: 增量拼接流式文本与 tool call。
related:
  - runtime/agent-runtime
  - providers/message-types
---

# `StreamAccumulator`

> 把流式模型响应增量拼装成 `Message::Assistant`。

`StreamAccumulator` 消费一个 `ChatStream`（provider-specific）的各个 chunk，并在流结束时产出一个完整的 `Message::Assistant` 加 `ToolCall` 列表。它运行在 Turn FSM 的 `CallingModel` 状态内。

完整源码在 `src/runtime/accumulator.rs`。

## 为什么需要专用 accumulator

`ChatStream` 交付的 chunk **不是**独立的 —— 文本 delta 可以拼接，但 tool call 的参数是以 JSON 片段形式到达的，需要合并。accumulator 处理合并、校验结果、提前暴露错误（例如 tool call 参数中的畸形 JSON）。

## API

```rust
pub struct StreamAccumulator {
    text: String,
    tool_calls: Vec<PartialToolCall>,
    finish_reason: Option<FinishReason>,
    usage: Option<TokenUsage>,
}

impl StreamAccumulator {
    pub fn new() -> Self;
    pub fn observe(&mut self, chunk: ChatStreamEvent) -> Result<(), AccumulatorError>;
    pub fn finalize(self) -> Result<AccumulatedResponse, AccumulatorError>;
}

pub struct AccumulatedResponse {
    pub message: Message,
    pub tool_calls: Vec<ToolCall>,
    pub finish_reason: FinishReason,
    pub usage: Option<TokenUsage>,
}
```

## 合并规则

- `TextDelta(delta)` —— 把 `delta` 追加到文本缓冲区。
- `ToolCallStart { id, name }` —— 推入一个新的 `PartialToolCall`，args 为空。
- `ToolCallArgumentDelta { id, delta }` —— 把 `delta` 追加到匹配的 `PartialToolCall.args`。
- `ToolCallEnd { id }` —— 把该 call 标记为就绪。
- `FinishReason(r)` —— 存储；流结束。
- `Usage(u)` —— 存储；流结束。

`finalize` 在观察到 `FinishReason` 后运行。它组装 `Message::Assistant`，把每个 `PartialToolCall.args` 解析为 JSON，返回完整响应。

## 边界情况

- **流在没有 `FinishReason` 的情况下结束** —— `finalize` 返回 `AccumulatorError::Truncated`。Run 循环记录部分文本，用已累积的内容继续。
- **Tool call JSON 畸形** —— `finalize` 返回 `AccumulatorError::InvalidToolCallJson { call_id, message }`。该 call 被丢弃；同流中的其它 call 保留。
- **乱序 chunk** —— 大多数 provider 是有序的，但 accumulator 是防御性的：未知 `id` 的 `ToolCallArgumentDelta` 被记录并丢弃。
- **空流** —— `finalize` 返回空的 `Message::Assistant`，`FinishReason::Stop`。对只返回 tool call 的模型是正常的。

## 另见

- **[AgentRuntime](agent-runtime.md)** —— 消费者。
- **[Message Types](../../providers/message-types)** —— 拼装出的 `Message` 形状。
