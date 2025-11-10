# Celo Composer

A powerful CLI tool for generating customizable Celo blockchain starter kits with modern monorepo architecture.

## Features

- 🚀 **Modern Stack**: Next.js 14+, TypeScript, Tailwind CSS, shadcn/ui
- 📦 **Monorepo Ready**: Turborepo with PNPM workspaces
- 🎨 **Beautiful UI**: Pre-configured shadcn/ui components
- 🔧 **Developer Experience**: Interactive prompts and clear feedback
- 🌍 **Celo Optimized**: Ready for Celo blockchain development
- 🎯 **Multiple Templates**: Choose from Basic Web App, Farcaster Miniapp, Minipay, or AI Chat templates
- 🔌 **Flexible Integrations**: Add wallet providers (RainbowKit, Thirdweb) and smart contract frameworks (Hardhat, Foundry)

## Quick Start

Create a new Celo project in seconds:

```bash
npx @celo/celo-composer@latest create
```

This will start an interactive setup process where you can choose your template, wallet provider, and smart contract framework.

## Installation

No installation required! Use `npx` to run Celo Composer directly:

```bash
npx @celo/celo-composer@latest create [project-name] [options]
```

## Usage

### Interactive Mode

Run the command without any flags to enter interactive mode:

```bash
npx @celo/celo-composer@latest create my-celo-app
```

The CLI will guide you through:

- Project name and description
- Template selection
- Wallet provider choice
- Smart contract framework selection
- Dependency installation

### Non-Interactive Mode

Create a project with specific configurations using flags:

```bash
npx @celo/celo-composer@latest create my-celo-app \
  --template basic \
  --wallet-provider rainbowkit \
  --contracts hardhat \
  --description "My awesome Celo app"
```

### Quick Start with Defaults

Skip all prompts and use default settings:

```bash
npx @celo/celo-composer@latest create my-celo-app --yes
```

## Available Templates

### Basic Web App (default)

A standard Next.js 14+ web application with modern UI, perfect for most dApp projects.

```bash
npx @celo/celo-composer@latest create --template basic
```

### Farcaster Miniapp

A specialized template for building Farcaster Miniapps with Farcaster SDK and Frame development support.

```bash
npx @celo/celo-composer@latest create --template farcaster-miniapp
```

### Minipay App

Optimized for building dApps that integrate with the Minipay mobile wallet, with mobile-first design.

```bash
npx @celo/celo-composer@latest create --template minipay
```

### AI Chat App

A standalone Next.js AI chat application template.

```bash
npx @celo/celo-composer@latest create --template ai-chat
```

## Wallet Providers

Choose a wallet provider to handle user authentication and transaction signing:

- **RainbowKit** (default): Popular, easy-to-use wallet connector for React apps
- **Thirdweb**: Complete Web3 development framework with powerful wallet tools
- **None**: Skip wallet integration if you want to integrate your own solution

```bash
npx @celo/celo-composer@latest create --wallet-provider rainbowkit
```

## Smart Contract Frameworks

Set up a smart contract development environment:

- **Hardhat** (default): Popular Ethereum development environment
- **Foundry**: Fast, portable and modular toolkit for Ethereum application development
- **None**: Skip smart contract development setup

```bash
npx @celo/celo-composer@latest create --contracts hardhat
```

## Command Options

| Flag                              | Description                                                        | Default            |
| --------------------------------- | ------------------------------------------------------------------ | ------------------ |
| `-d, --description <description>` | Project description                                                | Interactive prompt |
| `-t, --template <type>`           | Template type (`basic`, `farcaster-miniapp`, `minipay`, `ai-chat`) | `basic`            |
| `--wallet-provider <provider>`    | Wallet provider (`rainbowkit`, `thirdweb`, `none`)                 | `rainbowkit`       |
| `-c, --contracts <framework>`     | Smart contract framework (`hardhat`, `foundry`, `none`)            | `hardhat`          |
| `--skip-install`                  | Skip automatic dependency installation                             | `false`            |
| `-y, --yes`                       | Skip all prompts and use defaults                                  | `false`            |

## Generated Project Structure

```
my-celo-app/
├── apps/
│   ├── web/                 # Next.js application
│   └── contracts/           # Smart contracts (if selected)
├── packages/
│   ├── ui/                  # Shared UI components
│   └── utils/               # Shared utilities
├── package.json             # Root package.json
├── pnpm-workspace.yaml      # PNPM workspace config
├── turbo.json              # Turborepo configuration
└── tsconfig.json           # TypeScript configuration
```

## Next Steps

After creating your project:

```bash
cd my-celo-app
pnpm install  # If you used --skip-install
pnpm dev      # Start development server
```

Your project is automatically initialized with Git and includes an initial commit.

## Requirements

- Node.js >= 18.0.0
- PNPM (recommended) or npm/yarn

## Tech Stack

**Generated Projects Include:**

- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Turborepo for monorepo management
- PNPM workspaces

## License

MIT

## Resources

- [Documentation](https://docs.celo.org/composer)
- [GitHub Repository](https://github.com/celo-org/celo-composer)
- [Celo Documentation](https://docs.celo.org)
