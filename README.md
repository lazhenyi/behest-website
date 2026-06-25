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
│   ├── [lang]/            # Dynamic language routes
│   │   ├── docs/          # Documentation pages
│   │   ├── dictionaries/  # i18n dictionaries
│   │   └── layout.tsx     # Language layout
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Root page (redirects to /en)
├── components/            # React components
│   ├── Analytics.tsx      # Vercel Analytics
│   ├── Header.tsx         # Site header
│   └── Sidebar.tsx        # Documentation sidebar
├── docs/                  # Markdown documentation
│   ├── en/                # English docs
│   └── zh/                # Chinese docs
├── lib/                   # Utility functions
│   └── docs.ts            # Documentation helpers
├── next.config.mjs        # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vercel.json            # Vercel deployment configuration
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
