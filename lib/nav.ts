/**
 * Navigation tree — the single source of truth for the sidebar,
 * the home page card grid, the sitemap grouping, and the text-route
 * plaintext index.
 *
 * Each page slug matches the file path under `docs/{lang}/{slug}.md`.
 * Title keys are looked up at render time in
 * `app/[lang]/dictionaries/{en,zh}.json` under the `nav.pages` map.
 *
 * To add a new page: add a NavItem below, add the matching i18n key
 * to both dictionaries, and create the markdown file at the matching
 * `docs/{lang}/{slug}.md` path.
 */

export type NavColor = 'cyan' | 'accent' | 'pink' | 'yellow'

export type NavItem = {
  /** Slug matches the file path under `docs/{lang}/{slug}.md`. */
  slug: string
  /** i18n key under `nav.pages` in `dictionaries/{lang}.json`. */
  titleKey: string
  /** One-line description used on the home page card grid. */
  summary?: string
  /** Sort order within the group (1-based). */
  order: number
  /** Stable badge label shown in the sidebar (e.g. "new", "rc"). */
  badge?: string
}

export type NavGroup = {
  /** Group id; also used as the URL segment. */
  id: 'intro' | 'core' | 'runtime' | 'events' | 'tools' | 'providers' | 'storage' | 'config' | 'ops' | 'ref'
  /** i18n key under `nav.groups` in `dictionaries/{lang}.json`. */
  titleKey: string
  /** Sidebar section colour. */
  color: NavColor
  /** One-line description used on the home page card grid. */
  summary: string
  /** Sort order within the page (1-based). */
  order: number
  /** Group landing page slug; the card on the home page links here. */
  landing: string
  /** Pages inside the group. */
  items: NavItem[]
}

export const nav: NavGroup[] = [
  {
    id: 'intro',
    titleKey: 'nav.groups.intro',
    color: 'cyan',
    order: 1,
    summary: 'Onboarding, examples, and feature flag inventory.',
    landing: 'intro/overview',
    items: [
      { slug: 'intro/overview', titleKey: 'nav.pages.intro-overview', order: 1, summary: 'What behest is and why it exists.' },
      { slug: 'intro/quick-start', titleKey: 'nav.pages.intro-quick-start', order: 2, summary: 'Install, configure, run your first turn.' },
      { slug: 'intro/examples', titleKey: 'nav.pages.intro-examples', order: 3, summary: 'A curated catalogue of runnable examples.' },
      { slug: 'intro/feature-flags', titleKey: 'nav.pages.intro-feature-flags', order: 4, summary: 'The full feature flag inventory and selection guide.' },
    ],
  },
  {
    id: 'core',
    titleKey: 'nav.groups.core',
    color: 'accent',
    order: 2,
    summary: 'ExtensionPoint, Component, Factory — the composable runtime primitives.',
    landing: 'core/extension-point',
    items: [
      { slug: 'core/extension-point', titleKey: 'nav.pages.core-extension-point', order: 1, summary: 'Typed, name-indexed, hot-swappable collection with live-reference detection.' },
      { slug: 'core/extensions-facade', titleKey: 'nav.pages.core-extensions-facade', order: 2, summary: 'The 13-field facade: the single source of truth for plug-ins.' },
      { slug: 'core/drain-aware-replace', titleKey: 'nav.pages.core-drain-aware-replace', order: 3, summary: 'Atomic replace with natural Arc drain for in-flight-safe hot swap.' },
      { slug: 'core/component-trait', titleKey: 'nav.pages.core-component-trait', order: 4, summary: 'The lifecycle contract: init → start → serve → stop → health.' },
      { slug: 'core/component-registry', titleKey: 'nav.pages.core-component-registry', order: 5, summary: 'Dependency-aware orchestration with typed downcasting.' },
      { slug: 'core/factory-registry', titleKey: 'nav.pages.core-factory-registry', order: 6, summary: '`kind` string → JSON config → `Box<dyn AnyComponent>`.' },
      { slug: 'core/default-factory-registry', titleKey: 'nav.pages.core-default-factory-registry', order: 7, summary: 'The built-in factory invoker set: OpenAI, Anthropic, memory stores, context.' },
      { slug: 'core/component-wrappers', titleKey: 'nav.pages.core-component-wrappers', order: 8, summary: 'Component-shaped wrappers for each provider and store.' },
    ],
  },
  {
    id: 'runtime',
    titleKey: 'nav.groups.runtime',
    color: 'pink',
    order: 3,
    summary: 'AgentRuntime, the turn FSM, model routing, compaction, and safety nets.',
    landing: 'runtime/agent-runtime',
    items: [
      { slug: 'runtime/agent-runtime', titleKey: 'nav.pages.runtime-agent-runtime', order: 1, summary: 'The orchestrator: streaming-first loop, event-sourced, resume-capable.' },
      { slug: 'runtime/turn-fsm', titleKey: 'nav.pages.runtime-turn-fsm', order: 2, summary: '6 states, 4 actions, deterministic turn transitions.' },
      { slug: 'runtime/model-router', titleKey: 'nav.pages.runtime-model-router', order: 3, summary: 'Capability check, retry with backoff, fallback chain.' },
      { slug: 'runtime/context-pipeline', titleKey: 'nav.pages.runtime-context-pipeline', order: 4, summary: 'Adapters + history + compaction filter + token budget.' },
      { slug: 'runtime/compaction-service', titleKey: 'nav.pages.runtime-compaction-service', order: 5, summary: 'Proactive and reactive context compaction pipeline.' },
      { slug: 'runtime/input-admission', titleKey: 'nav.pages.runtime-input-admission', order: 6, summary: 'Validate, dedup, admit. The lifecycle of an incoming turn.' },
      { slug: 'runtime/session-gate', titleKey: 'nav.pages.runtime-session-gate', order: 7, summary: 'Per-session lock preventing concurrent run interleaving.' },
      { slug: 'runtime/snapshot-store', titleKey: 'nav.pages.runtime-snapshot-store', order: 8, summary: 'FSM-level crash recovery; resume from any state transition.' },
      { slug: 'runtime/doom-loop-detector', titleKey: 'nav.pages.runtime-doom-loop-detector', order: 9, summary: 'Duplicate and cycle detection for tool calls.' },
      { slug: 'runtime/runtime-policy', titleKey: 'nav.pages.runtime-runtime-policy', order: 10, summary: 'Limits, budgets, timeouts, and admission control.' },
      { slug: 'runtime/stream-accumulator', titleKey: 'nav.pages.runtime-stream-accumulator', order: 11, summary: 'Incrementally assemble streamed text and tool calls.' },
      { slug: 'runtime/run-state', titleKey: 'nav.pages.runtime-run-state', order: 12, summary: 'Event-sourced state projection: status, usage, finish.' },
    ],
  },
  {
    id: 'events',
    titleKey: 'nav.groups.events',
    color: 'yellow',
    order: 4,
    summary: 'Transport-neutral event facade: emit, subscribe, replay, live fanout.',
    landing: 'events/runtime-invocation',
    items: [
      { slug: 'events/runtime-invocation', titleKey: 'nav.pages.events-runtime-invocation', order: 1, summary: 'The transport-neutral `emit` / `on` facade with `Control` and `EventKind`.' },
      { slug: 'events/agent-event', titleKey: 'nav.pages.events-agent-event', order: 2, summary: 'The `AgentEvent` enum: every state change in the runtime.' },
      { slug: 'events/runtime-event-store', titleKey: 'nav.pages.events-runtime-event-store', order: 3, summary: 'Durable event persistence; the source of truth for replay.' },
      { slug: 'events/runtime-stream-adapter', titleKey: 'nav.pages.events-runtime-stream-adapter', order: 4, summary: 'Best-effort live fanout across run / session / provider rooms.' },
      { slug: 'events/runtime-subscription-hub', titleKey: 'nav.pages.events-runtime-subscription-hub', order: 5, summary: 'Pairs an EventStore with a StreamAdapter: live first, then replay.' },
      { slug: 'events/runtime-event-bridge', titleKey: 'nav.pages.events-runtime-event-bridge', order: 6, summary: 'Bridges `AgentEvent` to the runtime event envelope pipeline.' },
      { slug: 'events/session-data-store', titleKey: 'nav.pages.events-session-data-store', order: 7, summary: 'Per-session data store for invocation context.' },
    ],
  },
  {
    id: 'tools',
    titleKey: 'nav.groups.tools',
    color: 'cyan',
    order: 5,
    summary: 'The tool trait hierarchy, runtime, scopes, and RAG context adapter.',
    landing: 'tools/tool-trait',
    items: [
      { slug: 'tools/tool-trait', titleKey: 'nav.pages.tools-tool-trait', order: 1, summary: 'The base `Tool` contract: name, description, schema, execute.' },
      { slug: 'tools/function-tool', titleKey: 'nav.pages.tools-function-tool', order: 2, summary: 'Closure-backed tool with read-only and concurrency-safe markers.' },
      { slug: 'tools/external-tool', titleKey: 'nav.pages.tools-external-tool', order: 3, summary: 'Schema-only tool stub for external execution surfaces.' },
      { slug: 'tools/tool-registry', titleKey: 'nav.pages.tools-tool-registry', order: 4, summary: 'The global tool registry: register, lookup, list specs, execute.' },
      { slug: 'tools/tool-runtime', titleKey: 'nav.pages.tools-tool-runtime', order: 5, summary: 'Schema validation, per-tool timeout, concurrency partitioning.' },
      { slug: 'tools/scoped-tool-registry', titleKey: 'nav.pages.tools-scoped-tool-registry', order: 6, summary: 'LIFO shadow stack: turn → run → agent → base.' },
      { slug: 'tools/tool-output-config', titleKey: 'nav.pages.tools-tool-output-config', order: 7, summary: 'Head+tail truncation with disk spillover for large outputs.' },
      { slug: 'tools/context-adapter', titleKey: 'nav.pages.tools-context-adapter', order: 8, summary: 'The `ContextAdapter` trait and built-in static / function adapters.' },
      { slug: 'tools/rag-context-adapter', titleKey: 'nav.pages.tools-rag-context-adapter', order: 9, summary: 'Retrieval-augmented context adapter (Qdrant, Tantivy).' },
      { slug: 'tools/token-estimation', titleKey: 'nav.pages.tools-token-estimation', order: 10, summary: 'Token estimation heuristics for budget planning.' },
    ],
  },
  {
    id: 'providers',
    titleKey: 'nav.groups.providers',
    color: 'accent',
    order: 6,
    summary: 'Provider-neutral port, concrete adapters, message types, configuration.',
    landing: 'providers/chat-provider',
    items: [
      { slug: 'providers/chat-provider', titleKey: 'nav.pages.providers-chat-provider', order: 1, summary: 'The `ChatProvider` trait: complete, stream, capabilities.' },
      { slug: 'providers/embedding-provider', titleKey: 'nav.pages.providers-embedding-provider', order: 2, summary: 'The `EmbeddingProvider` trait and request / response shape.' },
      { slug: 'providers/provider-registry', titleKey: 'nav.pages.providers-provider-registry', order: 3, summary: 'In-memory routing for chat and embedding providers.' },
      { slug: 'providers/message-types', titleKey: 'nav.pages.providers-message-types', order: 4, summary: '`Message`, `ContentPart`, `ToolCall`, `FinishReason`, `TokenUsage`.' },
      { slug: 'providers/provider-config', titleKey: 'nav.pages.providers-provider-config', order: 5, summary: '`ProviderConfig` and `ProviderHttpConfig` with secret indirection.' },
      { slug: 'providers/openai-adapter', titleKey: 'nav.pages.providers-openai-adapter', order: 6, summary: 'The OpenAI-compatible chat and embedding adapter.' },
      { slug: 'providers/anthropic-adapter', titleKey: 'nav.pages.providers-anthropic-adapter', order: 7, summary: 'The Anthropic Messages API chat adapter.' },
      { slug: 'providers/custom-provider', titleKey: 'nav.pages.providers-custom-provider', order: 8, summary: 'How to implement `ChatProvider` for an internal / local model.' },
    ],
  },
  {
    id: 'storage',
    titleKey: 'nav.groups.storage',
    color: 'pink',
    order: 7,
    summary: 'Store traits, RuntimeStore facade, and feature-gated backends.',
    landing: 'storage/storage-overview',
    items: [
      { slug: 'storage/storage-overview', titleKey: 'nav.pages.storage-storage-overview', order: 1, summary: 'Store taxonomy, facade, and feature-flag matrix.' },
      { slug: 'storage/session-store', titleKey: 'nav.pages.storage-session-store', order: 2, summary: 'Session CRUD, message history, compaction meta.' },
      { slug: 'storage/embedding-store', titleKey: 'nav.pages.storage-embedding-store', order: 3, summary: 'Vector persistence and nearest-neighbour search.' },
      { slug: 'storage/execution-store', titleKey: 'nav.pages.storage-execution-store', order: 4, summary: 'Tool execution records, token usage, session stats.' },
      { slug: 'storage/artifact-store', titleKey: 'nav.pages.storage-artifact-store', order: 5, summary: 'Binary artifact storage (memory / disk / S3).' },
      { slug: 'storage/run-store', titleKey: 'nav.pages.storage-run-store', order: 6, summary: 'Event-sourced run lifecycle: create, append event, project state.' },
      { slug: 'storage/runtime-store', titleKey: 'nav.pages.storage-runtime-store', order: 7, summary: 'The runtime-facing facade over the four store traits.' },
      { slug: 'storage/backend-memory', titleKey: 'nav.pages.storage-backend-memory', order: 8, summary: 'The default in-process store backend.' },
      { slug: 'storage/backend-redis', titleKey: 'nav.pages.storage-backend-redis', order: 9, summary: 'Redis-backed store support and Redis Streams primitives.' },
      { slug: 'storage/backend-sqlx', titleKey: 'nav.pages.storage-backend-sqlx', order: 10, summary: 'SQLx PostgreSQL, MySQL, SQLite store backends.' },
      { slug: 'storage/backend-mongodb', titleKey: 'nav.pages.storage-backend-mongodb', order: 11, summary: 'MongoDB session store backend.' },
      { slug: 'storage/backend-surrealdb', titleKey: 'nav.pages.storage-backend-surrealdb', order: 12, summary: 'SurrealDB session store backend.' },
      { slug: 'storage/backend-qdrant', titleKey: 'nav.pages.storage-backend-qdrant', order: 13, summary: 'Qdrant embedding store backend.' },
      { slug: 'storage/backend-object', titleKey: 'nav.pages.storage-backend-object', order: 14, summary: 'Object storage backend (AWS S3 compatible) for artifacts.' },
    ],
  },
  {
    id: 'config',
    titleKey: 'nav.groups.config',
    color: 'yellow',
    order: 8,
    summary: 'Layered config, error model, observability, queues.',
    landing: 'config/agent-config',
    items: [
      { slug: 'config/agent-config', titleKey: 'nav.pages.config-agent-config', order: 1, summary: '`AgentConfig` + builder: the user-facing configuration surface.' },
      { slug: 'config/layered-config', titleKey: 'nav.pages.config-layered-config', order: 2, summary: 'Defaults, file, env, builder; secret indirection.' },
      { slug: 'config/error-handling', titleKey: 'nav.pages.config-error-handling', order: 3, summary: 'Typed error categories and retryable / context-overflow flags.' },
      { slug: 'config/observability', titleKey: 'nav.pages.config-observability', order: 4, summary: 'Tracing and OpenTelemetry integration.' },
      { slug: 'config/queue-publishers', titleKey: 'nav.pages.config-queue-publishers', order: 5, summary: 'External event publishing through NATS or Redis Streams.' },
    ],
  },
  {
    id: 'ops',
    titleKey: 'nav.groups.ops',
    color: 'cyan',
    order: 9,
    summary: 'ManagedRuntime, hot reload, health aggregation, deployment, performance.',
    landing: 'ops/managed-runtime',
    items: [
      { slug: 'ops/managed-runtime', titleKey: 'nav.pages.ops-managed-runtime', order: 1, summary: 'Runtime + ComponentRegistry + ShutdownToken.' },
      { slug: 'ops/hot-reload', titleKey: 'nav.pages.ops-hot-reload', order: 2, summary: 'Drain-aware atomic replace: the hot-swap protocol.' },
      { slug: 'ops/health-aggregation', titleKey: 'nav.pages.ops-health-aggregation', order: 3, summary: 'Worst-case health aggregation across components and transports.' },
      { slug: 'ops/deployment', titleKey: 'nav.pages.ops-deployment', order: 4, summary: 'Deploying behest: container, VM, sidecar, library.' },
      { slug: 'ops/performance', titleKey: 'nav.pages.ops-performance', order: 5, summary: 'Throughput, latency, and the streaming-first design.' },
    ],
  },
  {
    id: 'ref',
    titleKey: 'nav.groups.ref',
    color: 'accent',
    order: 10,
    summary: 'API reference, development guide, migration notes.',
    landing: 'ref/api-reference',
    items: [
      { slug: 'ref/api-reference', titleKey: 'nav.pages.ref-api-reference', order: 1, summary: 'Index of every public type, trait, and function.' },
      { slug: 'ref/development', titleKey: 'nav.pages.ref-development', order: 2, summary: 'Build, test, lint, and contribute.' },
      { slug: 'ref/migration-guides', titleKey: 'nav.pages.ref-migration-guides', order: 3, summary: 'Notes for migrating between major versions.' },
    ],
  },
]

export const groupsById: Record<NavGroup['id'], NavGroup> = nav.reduce(
  (acc, g) => {
    acc[g.id] = g
    return acc
  },
  {} as Record<NavGroup['id'], NavGroup>,
)

export function findItem(slug: string): { group: NavGroup; item: NavItem } | null {
  for (const group of nav) {
    for (const item of group.items) {
      if (item.slug === slug) return { group, item }
    }
  }
  return null
}

export function getGroupByLanding(slug: string): NavGroup | null {
  return nav.find((g) => g.landing === slug) ?? null
}

export function allSlugs(): string[] {
  return nav.flatMap((g) => g.items.map((i) => i.slug))
}
