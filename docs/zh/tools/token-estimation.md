---
title: Token 估算
description: 用于预算规划的启发式 token 估算。
group: tools
order: 10
summary: 用于预算规划的 token 估算启发式。
related:
  - runtime/context-pipeline
  - runtime/compaction-service
---

# Token 估算

> 预算规划的启发式 token 估算。

`behest` 提供启发式 token 估算（字符数 ÷ 4）用于规划。它**不是** tokenizer —— 不产生精确计数。`ContextPipeline` 和 `CompactionService` 用它决定何时裁剪或压缩。

完整源码在 `src/token.rs`。

## API

```rust
pub fn estimate_tokens(text: &str) -> usize;
pub fn estimate_message_tokens(msg: &Message) -> usize;
pub fn estimate_records_tokens(records: &[MessageRecord]) -> usize;
```

## 启发式

`estimate_tokens` 把字符数除以 4，下限 1。这是英文文本的标准近似。对非英文文本误差更大；runtime 在与 token 预算比较时加 20% 安全余量来补偿。

## 另见

- **[ContextPipeline](../runtime/context-pipeline.md)** —— 用估算做裁剪。
- **[CompactionService](../runtime/compaction-service.md)** —— 用估算做溢出检测。
