---
title: StreamAccumulator
description: Incrementally assembles streamed text and tool-call arguments into a complete `Message::Assistant`.
group: runtime
order: 12
summary: Incrementally assemble streamed text and tool calls.
related:
  - runtime/agent-runtime
  - providers/message-types
---

# `StreamAccumulator`

> Incrementally assemble a streamed model response into a `Message::Assistant`.

`StreamAccumulator` consumes the chunks of a `ChatStream` (provider-specific) and produces a complete `Message::Assistant` plus a list of `ToolCall`s when the stream ends. It runs inside the `CallingModel` state of the Turn FSM.

The full file is `src/runtime/accumulator.rs`.

## Why a dedicated accumulator

A `ChatStream` delivers chunks that are **not** independent — text deltas are concatenable, but tool-call arguments arrive as JSON fragments that must be merged. The accumulator handles the merge, validates the result, and surfaces errors early (e.g. malformed JSON in a tool-call argument).

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

## Merge rules

- `TextDelta(delta)` — append `delta` to the text buffer.
- `ToolCallStart { id, name }` — push a new `PartialToolCall` with empty args.
- `ToolCallArgumentDelta { id, delta }` — append `delta` to the matching `PartialToolCall.args`.
- `ToolCallEnd { id }` — mark the call as ready.
- `FinishReason(r)` — store; stream is done.
- `Usage(u)` — store; stream is done.

`finalize` runs after `FinishReason` is observed. It assembles the `Message::Assistant`, parses each `PartialToolCall.args` as JSON, and returns the full response.

## Edge cases

- **Stream ends without `FinishReason`** — `finalize` returns `AccumulatorError::Truncated`. The run loop logs the partial text and continues with what was accumulated.
- **Malformed tool-call JSON** — `finalize` returns `AccumulatorError::InvalidToolCallJson { call_id, message }`. The call is dropped; other calls in the same stream are kept.
- **Out-of-order chunks** — most providers are in-order, but the accumulator is defensive: `ToolCallArgumentDelta` for an unknown `id` is logged and dropped.
- **Empty stream** — `finalize` returns an empty `Message::Assistant` with `FinishReason::Stop`. This is normal for models that return only tool calls.

## See also

- **[AgentRuntime](agent-runtime.md)** — the consumer.
- **[Message Types](../../providers/message-types)** — the assembled `Message` shape.
