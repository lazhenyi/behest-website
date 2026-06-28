---
title: Development
description: 构建、测试、lint 与贡献指南。
group: ref
order: 2
summary: 构建、测试、lint 与贡献。
related: []
---

# Development

> 构建、测试、lint 与贡献。

## 先决条件

Rust 1.85+ (MSRV)

## 构建

```bash
cargo build --all-features
```

## 测试

```bash
cargo test --all-features --locked
```

## Lint

```bash
cargo fmt --all --check
cargo clippy --all-targets --all-features --locked -- -D warnings
```

## 完整质量门禁

```bash
cargo fmt --all --check && cargo clippy --all-targets --all-features --locked -- -D warnings && cargo test --all-features --locked
```

## 另见

- **[API Reference](api-reference.md)** —— 完整类型索引。

