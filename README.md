# behest

Rust-native building blocks for production AI agent runtimes

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
.
├── app/                    # Next.js App Router
│   ├── [lang]/            # Dynamic language routes (en/zh)
│   │   ├── docs/          # Documentation pages (component-based)
│   │   │   ├── [...slug]/ # Dynamic catch-all for nested routes
│   │   │   ├── layout.tsx  # Three-column layout
│   │   │   └── page.tsx    # Docs index with group card grid
│   │   ├── dictionaries/  # i18n dictionaries
│   │   └── layout.tsx     # Language layout
│   ├── globals.css        # Global styles (brutalist neon)
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Root page (redirects to /en)
├── components/            # React components
│   ├── HomePage.tsx       # Home with component card grid
│   ├── Sidebar.tsx        # Data-driven sidebar (from lib/nav.ts)
│   ├── Header.tsx         # Site header with lang switcher
│   ├── DocPageClient.tsx  # Doc page renderer (article + TOC)
│   ├── TableOfContents.tsx # Sticky right-side TOC
│   ├── MermaidClient.tsx  # Client-side Mermaid renderer
│   ├── Analytics.tsx      # Vercel Analytics
│   └── JsonLd.tsx         # Structured data
├── docs/                  # Markdown documentation (nested by section)
│   ├── en/                # English docs (10 groups, ~50 pages)
│   │   ├── intro/         # Overview, quick-start, examples, feature-flags
│   │   ├── core/          # ExtensionPoint, Extensions, Component, Registry, Factory
│   │   ├── runtime/       # AgentRuntime, FSM, ModelRouter, Compaction, etc.
│   │   ├── events/        # RuntimeInvocation, AgentEvent, EventStore, etc.
│   │   ├── tools/         # Tool trait, registry, runtime, scopes, RAG
│   │   ├── providers/     # ChatProvider, EmbeddingProvider, registry, adapters
│   │   ├── storage/       # Store traits, backends
│   │   ├── config/        # AgentConfig, errors, observability, gRPC
│   │   ├── ops/           # ManagedRuntime, hot-reload, deployment
│   │   └── ref/           # API reference, development, migration
│   └── zh/               # Chinese docs (mirror layout)
├── lib/                   # Utility functions
│   ├── docs.ts            # Doc loading (nested-folder walker)
│   ├── markdown.ts        # remark → rehype pipeline (Mermaid + callouts + TOC)
│   ├── nav.ts             # Navigation tree (single source of truth)
│   ├── render-text.ts     # Plaintext rendering for curl users
│   └── rehype-*.ts        # Custom rehype plugins
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

## Features

- **Next.js App Router** - Modern React framework with server components
- **i18n Support** - English and Chinese documentation
- **Tailwind CSS** - Utility-first CSS framework
- **Markdown Documentation** - Easy to maintain documentation
- **Vercel Analytics** - Performance monitoring
- **Static Export** - Optimized for Vercel deployment

## Deployment

This project is configured for deployment on Vercel. Simply connect your repository to Vercel and it will automatically deploy.

### Manual Deployment

```bash
# Build the project
pnpm build

# The output will be in the `out` directory
```

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Format code
pnpm format
```

## Documentation

Documentation files are located in the `docs` directory:

- `docs/en/` - English documentation
- `docs/zh/` - Chinese documentation

Each documentation file should be a Markdown file with frontmatter:

```markdown
---
title: Page Title
description: Page description
---

# Content

Your documentation content here.
```

## License

MIT
