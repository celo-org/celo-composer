# Celo Composer CLI

A powerful CLI tool for generating customizable Celo blockchain starter kits with modern monorepo architecture.

## Features

- 🚀 **Modern Stack**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- 📦 **Monorepo Ready**: Turborepo with PNPM workspaces
- 🎨 **Beautiful UI**: Pre-configured shadcn/ui components
- 🔧 **Developer Experience**: Interactive prompts and clear feedback
- 🌍 **Celo Optimized**: Ready for Celo blockchain development

## Installation

```bash
# Install dependencies
pnpm install

# Build the CLI
pnpm build

# Link for global usage (optional)
npm link
```

## Usage

### Create a new Celo project

```bash
# Interactive mode
pnpm dev create

# With project name
pnpm dev create my-celo-app

# With options
pnpm dev create my-celo-app --description "My awesome Celo app" --skip-install
```

### Command Options

- `--description <description>` - Project description
- `--skip-install` - Skip package installation

## Generated Project Structure

```
my-celo-app/
├── apps/
│   └── web/                 # Next.js application
├── packages/
│   ├── ui/                  # shadcn/ui components
│   └── utils/               # Shared utilities
├── package.json             # Root package.json
├── pnpm-workspace.yaml      # PNPM workspace config
├── turbo.json              # Turborepo configuration
└── tsconfig.json           # TypeScript configuration
```

## Development

```bash
# Start development
pnpm dev

# Build
pnpm build

# Lint
pnpm lint

# Run tests
pnpm test
```

## Tech Stack

- **CLI Framework**: Commander.js + Inquirer.js
- **Template Engine**: Plop.js
- **Language**: TypeScript
- **Generated Projects**: Next.js 14 + Turborepo + shadcn/ui

## License

MIT
