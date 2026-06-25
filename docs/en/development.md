# Development

## Prerequisites

- Rust 1.85+
- Cargo

## Building

```bash
cargo build
```

## Testing

```bash
cargo test --all-features --locked
```

## Formatting

```bash
cargo fmt --all --check
```

## Linting

```bash
cargo clippy --all-targets --all-features --locked -- -D warnings
```

## Documentation

```bash
RUSTDOCFLAGS="-D warnings" cargo doc --all-features --no-deps --locked
```

## Complete Verification

Run the complete local verification set:

```bash
cargo fmt --all --check && \
cargo check --all-targets --all-features --locked && \
cargo clippy --all-targets --all-features --locked -- -D warnings && \
cargo test --all-features --locked && \
RUSTDOCFLAGS="-D warnings" cargo doc --all-features --no-deps --locked
```

## Contributing

Please see [CONTRIBUTING.md](https://github.com/lazhenyi/behest/blob/main/CONTRIBUTING.md) for details.

## License

Licensed under either of:

- Apache License, Version 2.0
- MIT license

at your option.
