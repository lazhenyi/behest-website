---
title: Token Estimation
description: Heuristic token estimation for budget planning.
group: tools
order: 10
summary: Token estimation heuristics for budget planning.
related:
  - runtime/context-pipeline
  - runtime/compaction-service
---

# Token Estimation

> Estimate token counts for budget planning.

`behest` provides heuristic token estimation (chars ÷ 4) for planning purposes. It is **not** a tokeniser — it does not produce exact counts. It is used by `ContextPipeline` and `CompactionService` to decide when to trim or compact.

The full file is `src/token.rs`.

## API

```rust
pub fn estimate_tokens(text: &str) -> usize;
pub fn estimate_message_tokens(msg: &Message) -> usize;
pub fn estimate_records_tokens(records: &[MessageRecord]) -> usize;
```

## Heuristic

`estimate_tokens` divides the character count by 4, clamped to a minimum of 1. This is a standard approximation for English text. For non-English text, the error is larger; the runtime compensates by adding a 20% safety margin when comparing against token budgets.

## See also

- **[ContextPipeline](../runtime/context-pipeline.md)** — uses estimation for trimming.
- **[CompactionService](../runtime/compaction-service.md)** — uses estimation for overflow detection.
