---
title: "Backend: SurrealDB"
description: SurrealDB session store backend.
group: storage
order: 12
summary: SurrealDB session store backend.
related:
  - storage/session-store
---

# Backend: SurrealDB

> SurrealDB session store.

Feature `surrealdb`. Provides a `SessionStore` implementation backed by SurrealDB tables.

## Configuration

```toml
[store.session.surrealdb]
url = "ws://localhost:8000"
namespace = "behest"
database = "production"
```

## When to use

- Multi-model workloads (graph + document queries on sessions).
- Existing SurrealDB infrastructure.

## See also

- **[SessionStore](session-store.md)** — the trait.
