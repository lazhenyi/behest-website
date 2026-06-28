---
title: Layered Config
description: 四层配置解析：Defaults → file → env → builder，含密钥间接引用。
group: config
order: 2
summary: Defaults、file、env、builder；密钥间接引用。
related: []
---

# Layered Config

> 四层配置解析。

## 层级

1. **Defaults** —— 硬编码
2. **File** —— TOML（`with_file`）
3. **Environment** —— 环境变量（`with_env`）
4. **Builder** —— 编程方式（`with_*`）

## 密钥间接引用

```toml
api_key = "env:OPENAI_API_KEY"
```

加载器解析 `OPENAI_API_KEY` 并包进 `SecretString`。

## 合并规则

- 标量：后值胜出。Map：递归合并。Sequence：整个替换。
- `None` 不会取消早先的 `Some`。

## 另见

- **[AgentConfig](agent-config.md)** —— builder。

