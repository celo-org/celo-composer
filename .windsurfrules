# Celo Composer CLI Starter Kit Rules

## Project Overview

- This is a CLI tool that generates customizable Celo blockchain starter kits
- The tool creates monorepo structures with dynamic template composition
- Focus on modularity, code reusability, and developer experience
- Always generate projects without docs folders unless explicitly requested

## Tech Stack & Architecture

- Use Node.js with TypeScript for the CLI tool
- Use Commander.js for CLI framework and Inquirer.js for interactive prompts
- Use Turborepo for monorepo management in generated projects
- Use shadcn/ui as the default UI library in all web templates
- Use Plop.js for template generation and composition
- Use PNPM as the package manager
- Templates should use Next.js 14+ with App Router

## Code Style & Standards

- Follow TypeScript strict mode - avoid any types
- Use functional programming patterns, avoid classes where possible
- Use descriptive variable names with auxiliary verbs (isLoading, hasError)
- Prefer named exports over default exports
- Use PascalCase for React components and interfaces
- Use camelCase for functions and variables
- Use kebab-case for file and directory names

## Template Structure & Organization

- All templates must follow the shared monorepo structure with apps/ and packages/
- Base template should include shadcn/ui setup in packages/ui
- Web apps should import components from @workspace/ui
- Smart contract templates go in packages/contracts/
- Shared utilities go in packages/utils/
- Never create docs/ folders in generated projects

## Template Composition Rules

- Templates should be composable - avoid duplicating code across templates
- Use shared template partials in templates/shared/
- Each feature (privy, hardhat, minipay) should be a separate template module
- Templates should modify existing files rather than replace them when possible
- Always update package.json workspaces when adding new packages

## CLI Development Patterns

- Commands should follow the Command pattern with clear interfaces
- Use interactive prompts with sensible defaults
- Provide clear progress indicators for long operations
- Include validation for user inputs before generation
- Handle errors gracefully with helpful error messages

## Shadcn/ui Integration

- Always run shadcn/ui init in the packages/ui directory of generated projects
- Set up proper import paths (@workspace/ui) in generated apps
- Include common shadcn components (Button, Card, Input) in base template
- Configure Tailwind CSS properly across all workspace packages
- Ensure proper TypeScript configuration for shadcn components

## Testing & Quality

- Write unit tests for CLI commands and template generators
- Include integration tests that validate generated projects
- Test all template combinations to ensure they work together
- Validate that generated projects can build and run successfully

## File Organization

- Keep template files separate from CLI source code
- Use descriptive names for template files (base-web-app.tsx, privy-integration.ts)
- Organize templates by feature/platform in logical directories
- Maintain a clear separation between CLI logic and template content
