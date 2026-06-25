# Architecture

## Runtime Model

At the runtime layer, `AgentRuntime` orchestrates the full agent loop:

```text
RunRequest
  -> load or create session
  -> admit input
  -> build context
  -> call model provider
  -> stream / persist assistant output
  -> execute tool calls
  -> append tool results
  -> repeat until completion, limit, or error
  -> emit AgentEvent values
```

The runtime brings together:

- `ProviderRegistry`
- `ContextPipeline`
- `ToolRuntime`
- `RuntimeStore`
- `RuntimePolicy`
- `CompactionService`
- `SessionGate`
- optional event publisher
- optional snapshot store
- optional background job pool

## Error Model

`behest` exposes typed error categories instead of stringly framework failures:

- `ProviderError`
- `ToolError`
- `StorageError`
- `ContextError`
- `RuntimeError`
- top-level `Error`
- crate-level `Result<T>`

Provider errors distinguish unsupported capabilities, retryable failures, transport failures, invalid responses, and adapter-specific errors.

Tool errors distinguish missing tools, invalid arguments, execution failures, timeouts, and unimplemented external tools.

## Lint Policy

The crate is intentionally strict:

- `unsafe_code = "forbid"`
- `missing_docs = "deny"`
- `unreachable_pub = "deny"`
- `clippy::all = "deny"`
- `dbg_macro = "deny"`
- `expect_used = "deny"`
- `todo = "deny"`
- `unimplemented = "deny"`
- `unwrap_used = "deny"`

This project treats public API clarity and failure-path hygiene as part of the runtime contract.
