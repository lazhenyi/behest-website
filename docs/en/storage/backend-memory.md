---
title: "Backend: Memory"
description: The default in-process store backend for all five store traits.
group: storage
order: 8
summary: The default in-process store backend.
related:
  - storage/session-store
  - storage/embedding-store
  - storage/execution-store
  - storage/artifact-store
  - storage/run-store
---

# Backend: Memory

> The default in-process store backend.

The memory backend is the default for all five store traits. It stores everything in `HashMap`s behind `RwLock`s, with no persistence across restarts. It is used in tests and as the default for `Extensions::default()`.

## Implementations

| Type | Trait | Storage |
|---|---|---|
| `MemorySessionStore` | `SessionStore` | `HashMap<Uuid, Session>` + `Vec<MessageRecord>` |
| `MemoryEmbeddingStore` | `EmbeddingStore` | `Vec<EmbeddingRecord>` (brute-force search) |
| `MemoryExecutionStore` | `ExecutionStore` | `HashMap<Uuid, Vec<ToolExecution>>` |
| `MemoryArtifactStore` | `ArtifactStore` | `HashMap<Uuid, Artifact>` |
| `MemoryRunStore` | `RunStore` | `HashMap<RunId, RunRecord>` + `Vec<RunEventRecord>` |

## Characteristics

- **No persistence** — data is lost on restart.
- **No network** — no connection strings, no auth, no TLS.
- **Brute-force search** — `MemoryEmbeddingStore::search` computes cosine similarity against every stored vector. Fine for <10k vectors.
- **Single `Mutex` per store** — `MemoryRunStore` uses a single `Mutex` for atomic event append + projection update.

## When to use

- Tests and examples.
- Local development.
- Single-process deployments where persistence is handled externally (e.g. the caller serialises sessions).

## When not to use

- Multi-process deployments.
- Production with durability requirements.
- More than ~10k embedding vectors (use Qdrant).

## See also

- **[Storage Overview](storage-overview.md)** — the full matrix.
