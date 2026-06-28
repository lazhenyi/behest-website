---
title: Health Aggregation
description: 跨组件和 transport 的最差情况健康聚合。
group: ops
order: 3
summary: 组件和 transport 健康探测的最差情况语义。
related:
  - ops/managed-runtime
  - ops/hot-reload
  - core/component-trait
  - config/grpc-transport
---

# 健康聚合

> 从多个独立探测中产生一个统一的健康信号。

`ManagedRuntime` 将每个已注册组件和 transport 的健康聚合为一个 `HealthStatus`。聚合使用**最差情况语义**：最不健康的组件决定整体状态。

## 语义

```text
   Unhealthy  >  Degraded  >  Healthy
```

| 条件 | 结果 |
|------|------|
| 任何组件是 `Unhealthy` | **Unhealthy** |
| 没有 unhealthy，但有 `Degraded` | **Degraded** |
| 所有组件都是 `Healthy`（或 registry 为空） | **Healthy** |

原因字符串列出所有非健康的组件，让运维者可以快速定位：

```text
unhealthy components: store.session.redis, provider.openai.chat
```

## API

```rust
impl ManagedRuntime {
    /// 用最差情况语义将所有组件和 transport 健康聚合为一个 HealthStatus。
    pub async fn overall_health(&self) -> HealthStatus;

    /// 如果每个组件至少是可操作的（healthy 或 degraded）则返回 true。
    /// 适用于就绪探测。
    pub async fn is_ready(&self) -> bool;

    /// 构建 JSON /healthz 响应体。
    pub async fn healthz_json(&self) -> serde_json::Value;

    /// 如果每个组件都是 healthy 则返回 true。
    pub async fn is_healthy(&self) -> bool;
}
```

### `overall_health` vs `is_ready`

- **`overall_health`** 返回完整的 `HealthStatus` 枚举（`Healthy`、`Degraded`、`Unhealthy`）。用于仪表盘和告警。
- **`is_ready`** 当每个组件至少可操作（`Healthy` 或 `Degraded`）时返回 `true`。用于负载均衡器就绪探测，`Degraded` 仍然意味着"可以服务流量"。

## `/healthz` JSON 格式

`healthz_json` 生成适用于 Kubernetes liveness/readiness 探测的响应：

```json
{
  "status": "degraded",
  "components": {
    "provider.openai.chat": {
      "status": "healthy",
      "reason": null
    },
    "store.session.redis": {
      "status": "degraded",
      "reason": "connection pool exhausted"
    },
    "store.embedding.memory": {
      "status": "healthy",
      "reason": null
    }
  }
}
```

顶层 `status` 是聚合结果。`components` 对象包含每个组件的详细信息。

## Transport 健康

`TransportHub::health()` 为每个已注册 transport 返回 `HashMap<String, HealthStatus>`。`ManagedRuntime::health()` 在聚合前合并组件和 transport 的健康映射：

```rust
let component_health = registry.health().await;
let transport_health = hub.health().await;
// 合并为一个 map，然后聚合
```

这意味着降级的 transport（例如无法绑定的 gRPC 服务器）会像降级组件一样影响整体状态。

## 使用示例

```rust
use behest::config::AgentConfigBuilder;

let managed = AgentConfigBuilder::default()
    .build_managed()
    .await?;

// Kubernetes 就绪探测
if managed.is_ready().await {
    // 200 OK
} else {
    // 503 Service Unavailable
}

// 完整健康报告
let report = managed.healthz_json().await;
println!("{}", serde_json::to_string_pretty(&report)?);
```

## 另见

- **[ManagedRuntime](managed-runtime.md)** —— 驱动健康聚合的编排器。
- **[Component Trait](../core/component-trait.md)** —— `health()` 探测合约。
- **[gRPC Transport](../config/grpc-transport.md)** —— transport 健康探测。
