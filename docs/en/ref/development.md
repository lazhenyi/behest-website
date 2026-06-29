---
title: Development
description: Build, test, lint, and contribute to behest.
group: ref
order: 2
summary: Build, test, lint, and contribute.
related:
  - ref/api-reference
  - intro/overview
---

# Development

> Build, test, lint, and contribute.

## Prerequisites

- Rust 1.85+ (MSRV)
- `cargo` and `rustfmt`
- Optional: Docker (for integration tests)

## Build

```bash
cargo build --all-features
```

## Test

```bash
cargo test --all-features --locked
```

## Lint

```bash
cargo fmt --all --check
cargo clippy --all-targets --all-features --locked -- -D warnings
```

## Docs

```bash
RUSTDOCFLAGS="-D warnings" cargo doc --all-features --no-deps --locked
```

## Full quality gate

```bash
cargo fmt --all --check && \
cargo check --all-targets --all-features --locked && \
cargo clippy --all-targets --all-features --locked -- -D warnings && \
cargo test --all-features --locked && \
RUSTDOCFLAGS="-D warnings" cargo doc --all-features --no-deps --locked
```

## Repository

- **Source**: [github.com/lazhenyi/behest](https://github.com/lazhenyi/behest)
- **License**: MIT OR Apache-2.0
- **MSRV**: 1.85
- **Edition**: 2024

## See also

- **[API Reference](api-reference.md)** — the full type index.
- **[Overview](../intro/overview.md)** — the high-level picture.
