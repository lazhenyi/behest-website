# Documentation Structure

This directory contains the documentation for the behest project.

## Files

- **index.md** - Main landing page with project overview
- **getting-started.md** - Quick start guide and installation
- **providers.md** - Provider adapters and custom implementations
- **tools.md** - Tool definition and execution
- **configuration.md** - Configuration options and layers
- **error-handling.md** - Typed error categories and handling
- **examples.md** - Practical code examples
- **architecture.md** - Runtime model and design principles
- **features.md** - Feature flags and configuration
- **api-reference.md** - Core types and traits reference
- **development.md** - Development setup and contribution guide

## Directories

- **public/** - Static assets (icons, images)
- **styles/** - Custom CSS styles

## Adding Documentation

To add new documentation:

1. Create a new `.md` file in this directory
2. Add the page to the sidebar in `rspress.config.ts`
3. Update `index.md` to include a link to the new page

## Building

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## License

Licensed under either of:

- Apache License, Version 2.0
- MIT license

at your option.
