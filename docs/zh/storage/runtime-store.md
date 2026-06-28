---
title: RuntimeStore
description: 五个 store trait 之上的运行时 facade。
group: storage
order: 7
summary: 五个 store trait 之上的运行时 facade。
related: []
---

# RuntimeStore

> 运行时 facade。

`RuntimeStore` 把五个 store trait 组合为一个句柄。

## API

```rust
impl RuntimeStore {
    pub fn from_extensions(ext: &Extensions) -> Self;
    pub fn session(&self, name: &str) -> Option<Arc<dyn SessionStore>>;
    pub fn execution(&self, name: &str) -> Option<Arc<dyn ExecutionStore>>;
    pub fn run(&self, name: &str) -> Option<Arc<dyn RunStore>>;
    pub fn embedding(&self, name: &str) -> Option<Arc<dyn EmbeddingStore>>;
    pub fn artifact(&self, name: &str) -> Option<Arc<dyn ArtifactStore>>;
}
```

## 另见

- **[Storage Overview](storage-overview.md)** —— 完整矩阵。
- **[Extensions Facade](../core/extensions-facade.md)** —— 来源。

