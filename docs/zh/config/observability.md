---
title: Observability
description: 运行时的 tracing 与可选 OpenTelemetry 集成。
group: config
order: 4
summary: Tracing 与 OpenTelemetry 集成。
related: []
---

# Observability

> Tracing 与 OpenTelemetry。

## Span

| 操作 | Span 名称 | 关键字段 |
|---|---|---|
| Run | run | run_id, session_id, provider |
| Turn | turn | run_id, iteration |
| 模型调用 | model.call | provider, model, input_tokens |
| Tool 执行 | tool.execute | tool_name, call_id, duration_ms |

## OpenTelemetry

Feature `otel` 启用 `tracing-opentelemetry` 层。

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4317"
```

## 另见

- **[AgentRuntime](../runtime/agent-runtime.md)** —— 被插桩的代码。

