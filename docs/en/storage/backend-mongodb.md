---
title: "Backend: MongoDB"
description: MongoDB session store backend.
group: storage
order: 11
summary: MongoDB session store backend.
related:
  - storage/session-store
---

# Backend: MongoDB

> MongoDB session store.

Feature `mongodb`. Provides a `SessionStore` implementation backed by MongoDB collections.

## Collections

- `sessions` — document per session with metadata.
- `messages` — embedded array or separate collection with `session_id` index.

## Configuration

```toml
[store.session.mongodb]
url = "mongodb://localhost:27017"
database = "behest"
```

## When to use

- Existing MongoDB infrastructure.
- Document-oriented session data with flexible schema.

## See also

- **[SessionStore](session-store.md)** — the trait.
