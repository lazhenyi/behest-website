---
title: ToolOutputConfig
description: Head+tail truncation for tool outputs, with disk spillover for large payloads.
group: tools
order: 7
summary: Head+tail truncation with disk spillover for large outputs.
related:
  - tools/tool-trait
  - tools/tool-runtime
---

# `ToolOutputConfig`

> Truncate large tool outputs so they don't exhaust the model's context window.

When a tool returns megabytes of output (e.g. a `web_search` that fetched a 500 KB page), the full text cannot be sent to the model. `ToolOutputConfig` truncates via head+tail sampling and optionally writes the full output to a file for later retrieval.

The full file is `src/tool_output.rs`.

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

## See also

- **[ToolRuntime](tool-runtime.md)** — applies truncation after tool execution.
