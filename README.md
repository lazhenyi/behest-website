# behest Website

This is the official website for the [behest](https://github.com/lazhenyi/behest) project, built with [Rspress](https://rspress.dev/).

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Quick Scripts

```bash
# Start development server
./dev.sh

# Build for production
./build.sh
```

## Project Structure

```
.
├── docs/                    # Documentation source files
│   ├── index.md            # Main landing page
│   ├── getting-started.md  # Quick start guide
│   ├── providers.md        # Provider adapters
│   ├── tools.md            # Tool definition and execution
│   ├── sessions.md         # Session management
│   ├── storage.md          # Storage backends
│   ├── configuration.md    # Configuration options
│   ├── error-handling.md   # Error handling
│   ├── examples.md         # Practical examples
│   ├── architecture.md     # Runtime architecture
│   ├── rag.md              # RAG (Retrieval-Augmented Generation)
│   ├── events.md           # Event system
│   ├── features.md         # Feature flags
│   ├── api-reference.md    # API reference
│   ├── development.md      # Development guide
│   ├── public/             # Static assets
│   └── styles/             # Custom CSS
├── package.json
├── rspress.config.ts
└── tsconfig.json
```

## Documentation

- **index.md**: Project overview and quick start
- **getting-started.md**: Installation and basic usage
- **providers.md**: Provider adapters and custom implementations
- **tools.md**: Tool definition and execution
- **sessions.md**: Session management and conversation state
- **storage.md**: Storage backends and persistence
- **configuration.md**: Configuration options and layers
- **error-handling.md**: Typed error categories and handling
- **examples.md**: Practical code examples
- **architecture.md**: Runtime model and design principles
- **rag.md**: Retrieval-Augmented Generation
- **events.md**: Event system and observability
- **features.md**: Feature flags and configuration
- **api-reference.md**: Core types and traits reference
- **development.md**: Development setup and contribution guide

## Customization

### Update Site Configuration

Edit `rspress.config.ts` to customize:
- Site title and description
- Logo and favicon
- Social links
- Theme settings

### Add Documentation

Add new `.md` files to the `docs/` directory. They will be automatically included in the build.

### Custom Styles

Edit `docs/styles/custom.css` to customize the theme colors and styles.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions to various platforms.

## License

Licensed under either of:

- Apache License, Version 2.0
- MIT license

at your option.
