---
title: ScopedToolRegistry
description: " \"LIFO shadow-stack registry: turn → run → agent → base.\""
group: tools
order: 6
summary: " LIFO shadow stack: turn → run → agent → base."
related:
  - tools/tool-registry
  - tools/tool-runtime
---

# `ScopedToolRegistry`

> LIFO shadow-stack for per-scope tool visibility.

`ScopedToolRegistry` allows a tool to be visible only within a specific scope (turn, run, agent). It is not a separate registry — it is a **stack** on top of the base `ToolRegistry`; lookups walk from the top of the stack down. A tool registered at the **turn** scope shadows the same-named tool at the **agent** scope.

The full file is `src/tool_scope.rs`.

## Scopes

| Scope | Lifetime | Use case |
|---|---|---|
| `Base` | Runtime lifetime | The global tool set. |
| `Agent` | Agent definition | Tools registered by an `AgentRegistry` entry. |
| `Run` | One `RunRequest` | Tools injected by the caller for this run. |
| `Turn` | One Turn FSM iteration | Tools generated mid-turn (e.g. dynamically). |

When multiple scopes register the same tool name, the **most recent** (top of stack) wins:

```
Turn scope: { "search" }
Run scope:  { "search", "math" }
Agent:      { "search", "math", "echo" }
Base:       { "echo", "time" }
```

A lookup for `"search"` returns the turn-scope one. A lookup for `"time"` falls through to the base registry.

## API

```rust
impl ScopedToolRegistry {
    pub fn new(base: Arc<ToolRegistry>) -> Self;
    pub fn register_turn(&self, name: &str, tool: Arc<dyn Tool>) -> Result<(), ToolError>;
    pub fn register_run(&self, name: &str, tool: Arc<dyn Tool>) -> Result<(), ToolError>;
    pub fn register_agent(&self, name: &str, tool: Arc<dyn Tool>) -> Result<(), ToolError>;
    pub fn get(&self, name: &str) -> Option<Arc<dyn Tool>>;
    pub fn list_specs(&self) -> Vec<ToolSpec>;
}
```

## See also

- **[ToolRegistry](tool-registry.md)** — the base registry.
- **[ToolRuntime](tool-runtime.md)** — the runtime that uses this.
