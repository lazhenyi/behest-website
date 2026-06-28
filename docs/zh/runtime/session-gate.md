---
title: SessionGate
description: 串行化同一 session 上的并发 run 的 per-session 互斥锁。
group: runtime
order: 7
summary: 防止 run 交错的 per-session 锁。
related:
  - runtime/agent-runtime
  - runtime/input-admission
  - storage/session-store
---

# `SessionGate`

> 同一 session 上并发 run 的串行化。

同一 session 上的两个 run **不能**让它们的写交错；否则消息顺序、tool-call 配对、turn-completion 语义都会损坏。`SessionGate` 是一个 per-session 的 `tokio::sync::Mutex`，运行时在任何 session 写之前获取它，写完之后释放。

完整源码在 `src/runtime/session_gate.rs`。

## API

```rust
pub struct SessionGate {
    config: SessionGateConfig,
    locks: Mutex<HashMap<Uuid, Arc<Mutex<()>>>>,
}

pub struct SessionGateConfig {
    pub acquire_timeout: Duration,    // default: 30s
    pub max_locks: usize,             // default: 10_000
}

impl SessionGate {
    pub fn new(config: SessionGateConfig) -> Self;
    pub async fn acquire(&self, session_id: Uuid) -> Result<SessionGuard, RuntimeError>;
    pub fn inflight(&self) -> usize;
}

pub struct SessionGuard {
    _permit: tokio::sync::OwnedMutexGuard<()>,
}
```

## Acquire

`runtime.session_gate().acquire(session_id).await?` 返回一个 `SessionGuard`。Guard 在 run 期间持有；drop 时释放锁。

如果锁已被另一个 run 持有，第二次调用会**阻塞**最多 `acquire_timeout`。如果超时到期，返回 `RuntimeError::SessionGateTimeout`，第二次 run 被拒绝。

## 为什么是 per-session 而不是全局

全局锁会跨所有 session 串行化 run，限制吞吐。Per-session 锁允许不相关的 session 并行执行；只有对**同一**session 的写才会被串行化。

## 边界情况

- **`max_locks` 超出** —— gate 拒绝创建新锁，返回 `RuntimeError::TooManySessions`。如果创建很多短生命周期的 session，这限制了内存增长。
- **Run 中途崩溃** —— 锁被 drop 的 future 持有。Tokio 检测到 drop 并自动释放锁。下一次 acquire 成功。
- **长时间运行的 run** —— 同 session 上的其它 run 会等待。没有优先级或抢占；如果需要，先 `cancel` 该 run。

## 另见

- **[AgentRuntime](agent-runtime.md)** —— 调用方。
- **[InputAdmission](input-admission.md)** —— 配套的输入关。
- **[SessionStore](../../storage/session-store)** —— session 状态的持久后端。
