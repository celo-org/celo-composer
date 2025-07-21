# Celo Composer CLI Starter Kit Development Project

## Project Overview

I want to build a CLI tool for Celo blockchain that generates customizable starter kits. The tool should create monorepo projects with different template combinations based on user choices.

## What We're Building

- A Node.js CLI tool that scaffolds Celo blockchain projects
- The CLI generates monorepos using Turborepo with customizable features
- Users can choose smart contract frameworks (Hardhat/Foundry), wallet integrations (Privy), and platform-specific templates (MiniPay, Farcaster)
- All generated web apps should use shadcn/ui as the default UI library
- The system should be modular and reusable - updating the base template should reflect across all generated combinations

## Tech Stack Requirements

- **CLI Framework**: Node.js + TypeScript + Commander.js + Inquirer.js
- **Template Engine**: Plop.js for template generation
- **Generated Projects**: Turborepo monorepos with Next.js 14+ apps
- **UI Library**: shadcn/ui (mandatory in all web templates)
- **Package Manager**: PNPM
- **Smart Contracts**: Hardhat or Foundry (user choice)
- **Styling**: Tailwind CSS (integrated with shadcn/ui)

## Project Goals

1. **Modularity**: Template components should be composable and reusable
2. **Developer Experience**: Simple CLI with interactive prompts and clear feedback
3. **Code Reusability**: Changes to base templates should propagate to all variants
4. **Celo Integration**: All templates should be optimized for Celo blockchain development
5. **Modern Stack**: Use latest best practices for monorepo and React development

## Project Structure Requirements

```
celo-cli/
├── src/
│ ├── commands/ # CLI command implementations
│ ├── generators/ # Template generators
│ ├── templates/ # Template source files
│ └── utils/ # Utility functions
├── templates/
│ ├── base/ # Base monorepo template
│ ├── blockchain/ # Smart contract templates
│ ├── wallet/ # Wallet integration templates
│ └── platforms/ # Platform-specific templates
└── tests/ # Test files
```

## Development Phases

### Phase 1: Core CLI Foundation & Base Template

**Deliverables:**

1. Set up the CLI project structure with TypeScript and Commander.js
2. Create the base monorepo template with:
   - Turborepo configuration
   - Next.js app in apps/web with shadcn/ui fully configured
   - Shared UI package in packages/ui with shadcn/ui setup
   - Proper TypeScript and Tailwind configuration
   - PNPM workspace setup
3. Implement the basic `create` command that generates the base template
4. Set up Plop.js for template generation
5. Create interactive prompts for basic project setup (name, description)
6. Add proper CLI help text and error handling

**Acceptance Criteria:**

- CLI can generate a working monorepo with shadcn/ui
- Generated project builds and runs successfully
- Web app can import and use shadcn/ui components from packages/ui
- Turborepo tasks (build, dev, lint) work correctly

### Phase 2: Template Composition System & Feature Integration

**Deliverables:**

1. Implement template composition system for combining features
2. Add smart contract integration templates:
   - Hardhat template with Celo-specific configuration
   - Foundry template with Celo deployment scripts
3. Add wallet integration template:
   - We will have just one option for now that is Rainbow kit UI
   - User can choose to include wallet integration like Privy, thirdweb or alchemy, we will add these in future iterations
4. Add platform-specific templates:
   - MiniPay template modifications, for now we will just add a flag, window.ethereum.isMiniPay is true then show "Minipay APP" in the landing page
   - Farcaster miniapp template, for now we will just add a flag, window.ethereum.isFarcaster is true then show "Farcaster APP" in the landing page
5. Implement template merging logic that combines base + selected features
6. Create validation to ensure generated projects work correctly

**Acceptance Criteria:**

- Users can select multiple features (wallet + smart contracts + platform)
- Generated projects include all selected features working together
- Template composition doesn't create conflicts or duplicate code
- All generated combinations build and run successfully
- Smart contracts can be deployed to Celo networks
- Wallet integration works with Celo testnet/mainnet

## Important Notes

- Never create docs folders in generated projects
- Always use shadcn/ui in web applications
- Ensure proper monorepo workspace configuration
- Test all template combinations thoroughly
- Focus on developer experience and clear documentation
- Make the CLI intuitive with good defaults

Start with Phase 1 and create a solid foundation before moving to Phase 2. Let me know when Phase 1 is complete and ready for testing.
