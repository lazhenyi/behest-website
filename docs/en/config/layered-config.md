---
title: Layered Config
description: "Defaults → file → env → builder: the four-layer config resolution with secret indirection."
group: config
order: 2
summary: Defaults, file, env, builder; secret indirection.
related:
  - config/agent-config
  - intro/quick-start
---

# Layered Config

> Four-layer configuration resolution.

`AgentConfigBuilder` merges configuration from four layers. Each layer overrides the previous.

## Layers

```text
1. Defaults (hard-coded)
2. File (TOML, via with_file)
3. Environment (env vars, via with_env)
4. Builder (programmatic, via with_*)
```

Later layers override earlier ones at the **field** level, not the struct level. If a file sets `provider.timeout_secs = 60` and an env var sets `BEHEST__PROVIDERS__OPENAI__CHAT__MODEL = "gpt-4o"`, both values survive.

## File format

```toml
[providers.openai]
type = "openai"
base_url = "https://api.openai.com/v1"
api_key = "env:OPENAI_API_KEY"

[providers.openai.chat]
model = "gpt-4o-mini"

[runtime]
max_iterations = 16
provider_timeout_secs = 60

[store.session.memory]
# memory store needs no config
```

## Environment variables

Prefix + double underscore + lowercase path:

```bash
export BEHEST_CONFIG=/etc/behest/config.toml     # points to the TOML file
export BEHEST__PROVIDERS__OPENAI__API_KEY="sk-…"
export BEHEST__RUNTIME__MAX_ITERATIONS="32"
```

`with_env("BEHEST")` reads `BEHEST_CONFIG` as the file path, then reads every `BEHEST__*` var as a config override.

## Secret indirection

Any field value starting with `env:` is treated as an environment variable name:

```toml
api_key = "env:OPENAI_API_KEY"
```

The loader resolves `OPENAI_API_KEY` from the process environment and wraps it in `SecretString`. The literal `"env:OPENAI_API_KEY"` never reaches the HTTP client, the log, or the serialized config.

## Merge rules

- Scalar fields: later value wins.
- Map fields: merged recursively. A key present in both file and env keeps both children unless the key itself is overridden wholesale.
- Sequence fields: later value replaces the entire sequence.
- `Option` fields: `None` in a later layer does **not** unset an earlier `Some`. Use `null` in TOML to explicitly unset.

## Validation

`build()` validates that:
- Every provider references a known `ProviderType` or omits the field (generic HTTP provider).
- Required fields for each store backend are present.
- Timeout values are positive.

## See also

- **[AgentConfig](agent-config.md)** — the builder.
- **[Quick Start](../intro/quick-start.md)** — the simplest path.
