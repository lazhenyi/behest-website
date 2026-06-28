---
title: "Backend: SQLx"
description: SQLx PostgreSQL, MySQL, and SQLite session store backends.
group: storage
order: 10
summary: SQLx PostgreSQL, MySQL, SQLite store backends.
related:
  - storage/session-store
---

# Backend: SQLx

> SQLx PostgreSQL, MySQL, and SQLite session stores.

Features `sqlx-postgres`, `sqlx-mysql`, `sqlx-sqlite`. Each provides a `SessionStore` implementation backed by a relational database with migrations.

## Migration

Migrations live in `src/store/sql/migrations/{postgres,mysql,sqlite}/`. The schema includes:

- `sessions` — id, title, model, created_at, updated_at, metadata (JSONB/JSON/TEXT).
- `messages` — id, session_id, role, content (JSONB), tool_calls (JSONB), usage, compaction flags.
- `compaction_meta` — session_id, tail_start_id, summary_text.

Migrations run on first `init`. The store uses `sqlx::migrate!` to apply any pending migrations.

## Configuration

```toml
[store.session.postgres]
url = "postgres://user:pass@localhost/behest"
max_connections = 10
```

## When to use

- Production with strong durability guarantees.
- Existing PostgreSQL/MySQL infrastructure.
- Need for transactional session updates.

## See also

- **[SessionStore](session-store.md)** — the trait.
- **[Storage Overview](storage-overview.md)** — the full matrix.
