---
title: ToolOutputConfig
description: tool 输出的 head+tail 截断，大 payload 可溢出到磁盘。
group: tools
order: 7
summary: head+tail 截断，大输出溢出到磁盘。
related:
  - tools/tool-trait
  - tools/tool-runtime
---

# `ToolOutputConfig`

> 截断大的 tool 输出，防止撑满模型 context window。

完整源码在 `src/tool_output.rs`。

## API

```rust
pub struct ToolOutputConfig {
    pub max_chars: usize,              // default 32_000
    pub head_chars: usize,             // default 20_000
    pub tail_chars: usize,             // default 10_000
    pub truncation_message: String,    // default "(output truncated)"
    pub save_full_to_file: bool,       // default false
}

pub fn truncate_output(raw: &str, config: &ToolOutputConfig) -> TruncationResult;

pub struct TruncationResult {
    pub truncated: bool,
    pub output: String,      // head + truncation_message + tail
    pub saved_path: Option<PathBuf>,
}
```

## 另见

- **[ToolRuntime](tool-runtime.md)** —— tool 执行后应用截断。
