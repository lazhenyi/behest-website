---
title: "Backend: Object"
description: Object storage backend (AWS S3 compatible) for binary artifacts.
group: storage
order: 14
summary: Object storage backend (AWS S3 compatible) for artifacts.
related:
  - storage/artifact-store
---

# Backend: Object

> Object storage for binary artifacts.

Feature `object_store`. Provides `DiskArtifactStore` and `S3ArtifactStore` implementations of `ArtifactStore`.

## Implementations

| Type | Storage | Configuration |
|---|---|---|
| `DiskArtifactStore` | Local filesystem | `root_dir` path |
| `S3ArtifactStore` | S3-compatible object store | `bucket`, `region`, `endpoint` |

## Configuration

```toml
[store.artifact.s3]
bucket = "behest-artifacts"
region = "us-east-1"
```

```toml
[store.artifact.disk]
root_dir = "/var/lib/behest/artifacts"
```

## When to use

- Artifact payloads larger than a few MB (memory store copies everything).
- Shared artifact storage across multiple runtime instances.
- Existing S3-compatible infrastructure.

## See also

- **[ArtifactStore](artifact-store.md)** — the trait.
