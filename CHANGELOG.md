# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Released entries are left as they were written. Where a statement was true at the
time and is not now — 2.2.0 describing Alfajores as the testnet, for instance —
it stays, because a changelog records what shipped rather than what is currently
true. The move to Celo Sepolia is its own entry under 2.4.13.

## [Unreleased]

### Added
- Miniapp environment detection in the Farcaster template.

### Changed
- **Breaking for scripts:** a flag now skips only its own prompt. Previously any
  flag suppressed every prompt, so `create app -t basic --skip-install` ran to
  completion in CI; it now stops at the description question. Add `-y` to any
  invocation with no terminal attached. This restores the documented behaviour
  (#411).

### Fixed
- Bumped `next` to 15.3.6 in the chat template for GHSA-9qr9-h5gf-34mp.
- Wallet status display no longer shows a hardcoded address; authentication status message corrected.
- Variable initialisation and SDK property access errors in the Farcaster template.
- Removed duplicate keys and fixed formatting across the `.env.example` files (#372).

### Documentation
- MiniPay: token reference table, a USDT transfer example, and JSDoc on `UserBalance` covering addresses and decimals.

## [2.4.13] - 2025-12-18

### Changed
- **Alfajores replaced by Celo Sepolia throughout** — templates, docs and network config.
- Contract verification moved to the Etherscan V2 API in place of Celoscan.
- thirdweb bumped to a version that includes `celoSepoliaTestnet`.

### Fixed
- Plopfile and template paths now resolve on Windows.
- Connect-button generation.

### Documentation
- README rewritten around the full template set and the command options.

## [2.4.10] - 2025-08-21

Covers 2.4.7 through 2.4.10, which were published without tags.

### Changed
- **Codebase migrated to ESM modules**, with dependencies updated to match.
- ESLint config converted to ESM, then to `.json`.

## [2.4.6] - 2025-08-21

Covers 2.4.5 and 2.4.6. There is no `v2.4.5` tag, and the 2.4.5 bump (`a2e812b`) is an ancestor of `v2.4.6`.

### Fixed
- Downgraded `plop` and `node-plop` to resolve version conflicts.

## [2.4.4] - 2025-08-21

### Fixed
- Downgraded `chalk`, `inquirer` and `ora` to resolve ESM compatibility issues.

## [2.4.3] - 2025-08-18

### Fixed
- `.env` added to the AI chat template's gitignore.

## [2.4.2] - 2025-08-18

### Documentation
- AI chat template: Celo integration details and project structure.

## [2.4.1] - 2025-08-18

### Added
- **AI chat template**, with document management and real-time streaming.
- Jest and ts-jest configured for unit testing.

## [2.3.7] - 2025-08-07

### Added
- **Foundry support** as a contract framework.
- **MiniPay template**, with custom wallet integration and balance display.

### Changed
- Contracts moved to `apps/`, and the Git initialisation flow improved.

### Documentation
- MiniPay template documentation, and template references updated.

## [2.3.6] - 2025-08-07

### Fixed
- Template generation conflict for `connect-button`.
- `moduleResolution` set to `bundler` in the base template's tsconfig.

### Documentation
- Mintlify configuration updated; Farcaster template tag added.

## [2.3.5] - 2025-08-06

### Fixed
- Resolved file conflict issue during project generation by removing the base `connect-button.tsx.hbs` and ensuring wallet-specific templates are used.

## [2.3.4] - 2025-08-05

### Changed
- Updated docs config with SEO metadata and replaced favicon with new Celo logo.

## [2.3.3] - 2025-08-04

### Added
- Added wallet connection and miniapp installation UI to the Farcaster template.

## [2.2.4] - 2024-01-23

### Fixed
- Fixed runtime error "Cannot find module 'tsx/cjs'" when running published package
- Removed unnecessary tsx/cjs requirement from plop-generator
- CLI now works correctly when installed via npm/npx

## [2.2.3] - 2024-01-23

### Fixed
- Fixed GitHub Actions pnpm lockfile issues by removing --frozen-lockfile flag
- Improved CI/CD pipeline reliability for npm deployment

## [2.2.2] - 2024-01-23

### Internal
- Version bump for deployment testing

## [2.2.1] - 2024-01-23

### Fixed
- Fixed ESLint configuration for proper TypeScript support
- Resolved TypeScript linting errors and removed 'any' types
- Added proper type definitions for Plop.js data interfaces
- Updated test script to pass with no tests during development

### Added
- Complete GitHub Actions workflow for npm deployment
- CI/CD pipeline with automated testing and publishing
- Comprehensive deployment documentation
- Release automation script
- MIT License file

## [2.2.0] - 2024-01-XX

### Added
- Complete CLI tool for generating customizable Celo blockchain starter kits
- Support for multiple wallet providers (RainbowKit, Thirdweb)
- Hardhat smart contract development framework integration
- Modern UI with shadcn/ui components
- Monorepo structure with Turborepo
- Interactive prompts for project configuration
- Template-based project generation with Plop.js
- Support for Next.js 14+ with App Router
- TypeScript support throughout
- PNPM package manager integration

### Features
- **Wallet Integration**: Support for MetaMask, Trust Wallet, Valora, and in-app wallets
- **Smart Contracts**: Hardhat integration with Celo network configuration
- **Modern UI**: shadcn/ui components with responsive design
- **Monorepo**: Turborepo-based monorepo structure
- **Developer Experience**: Interactive CLI with progress indicators
- **Template System**: Modular template composition
- **Network Support**: Pre-configured for Celo mainnet and Alfajores testnet

### Technical Details
- Node.js 18+ support
- TypeScript strict mode
- ESLint configuration
- Jest testing framework
- Commander.js for CLI framework
- Inquirer.js for interactive prompts
- Plop.js for template generation

---

## Release Process

### Stable Releases
- Tagged as `v2.2.0`, `v2.3.0`, etc.
- Published to npm with `latest` tag
- Full GitHub releases with changelog

### Pre-releases
- Tagged as `v2.2.0-beta.1`, `v2.2.0-alpha.1`, etc.
- Published to npm with `beta`, `alpha`, or `rc` tags
- GitHub pre-releases for testing

### Installation
```bash
# Latest stable version
npm install -g @celo/celo-composer

# Beta version
npm install -g @celo/celo-composer@beta

# Specific version
npm install -g @celo/celo-composer@2.2.0
```
