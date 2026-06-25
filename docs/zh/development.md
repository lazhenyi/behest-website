# 开发

## 前提条件

- Rust 1.85+
- Cargo

## 构建

```bash
cargo build
```

## 测试

```bash
cargo test --all-features --locked
```

## 格式化

```bash
cargo fmt --all --check
```

## Lint

```bash
cargo clippy --all-targets --all-features --locked -- -D warnings
```

## 文档

```bash
RUSTDOCFLAGS="-D warnings" cargo doc --all-features --no-deps --locked
```

## 完整验证

运行完整的本地验证集：

```bash
cargo fmt --all --check && \
cargo check --all-targets --all-features --locked && \
cargo clippy --all-targets --all-features --locked -- -D warnings && \
cargo test --all-features --locked && \
RUSTDOCFLAGS="-D warnings" cargo doc --all-features --no-deps --locked
```

## 贡献

请参阅 [CONTRIBUTING.md](https://github.com/lazhenyi/behest/blob/main/CONTRIBUTING.md) 了解详情。

## 许可证

根据以下之一许可：

- Apache License, Version 2.0
- MIT license

由您选择。
