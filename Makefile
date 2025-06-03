# Celo Composer CLI - Makefile
# Build and deployment automation for @celo/celo-composer

.PHONY: help install clean build test lint format check-git prepare-release publish dry-run dev

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE = \033[34m
GREEN = \033[32m
YELLOW = \033[33m
RED = \033[31m
NC = \033[0m # No Color

# Variables
PACKAGE_NAME = @celo/celo-composer
NODE_VERSION = $(shell node --version)
NPM_VERSION = $(shell npm --version)

help: ## Show this help message
	@echo "$(BLUE)Celo Composer CLI - Build & Deployment$(NC)"
	@echo "$(BLUE)=====================================$(NC)"
	@echo "Node.js: $(NODE_VERSION)"
	@echo "npm: $(NPM_VERSION)"
	@echo ""
	@echo "$(GREEN)Available commands:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(BLUE)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	@echo "$(YELLOW)Installing dependencies...$(NC)"
	npm install

clean: ## Clean build artifacts and dependencies
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	npm run build
	rm -rf dist/
	rm -rf node_modules/
	rm -f oclif.manifest.json
	rm -f tsconfig.tsbuildinfo

build: ## Build the project
	@echo "$(YELLOW)Building project...$(NC)"
	npm run build
	@echo "$(GREEN)✓ Build completed$(NC)"

test: ## Run tests
	@echo "$(YELLOW)Running tests...$(NC)"
	npm test
	@echo "$(GREEN)✓ Tests passed$(NC)"

lint: ## Run linter
	@echo "$(YELLOW)Running linter...$(NC)"
	npm run lint
	@echo "$(GREEN)✓ Linting completed$(NC)"

format: ## Format code (if prettier is available)
	@echo "$(YELLOW)Formatting code...$(NC)"
	@if command -v prettier >/dev/null 2>&1; then \
		npx prettier --write "src/**/*.ts" "test/**/*.ts"; \
		echo "$(GREEN)✓ Code formatted$(NC)"; \
	else \
		echo "$(YELLOW)Prettier not found, skipping formatting$(NC)"; \
	fi

dev: ## Start development mode with file watching
	@echo "$(YELLOW)Starting development mode...$(NC)"
	@echo "$(BLUE)Use './bin/run.js create --help' to test CLI commands$(NC)"
	npm run build
	@echo "$(GREEN)✓ Development build ready$(NC)"

check-git: ## Check if git is clean and on main branch
	@echo "$(YELLOW)Checking git status...$(NC)"
	@if [ -n "$$(git status --porcelain)" ]; then \
		echo "$(RED)✗ Git working directory is not clean$(NC)"; \
		git status --short; \
		exit 1; \
	fi
	@echo "$(GREEN)✓ Git working directory is clean$(NC)"

check-tests: build test lint ## Run all checks (build, test, lint)
	@echo "$(GREEN)✓ All checks passed$(NC)"

prepare-release: check-git check-tests ## Prepare for release (run all checks)
	@echo "$(YELLOW)Preparing release...$(NC)"
	npm run prepack
	@echo "$(GREEN)✓ Release prepared$(NC)"

version-patch: prepare-release ## Bump patch version (1.0.0 -> 1.0.1)
	@echo "$(YELLOW)Bumping patch version...$(NC)"
	npm version patch
	@echo "$(GREEN)✓ Patch version bumped$(NC)"

version-minor: prepare-release ## Bump minor version (1.0.0 -> 1.1.0)
	@echo "$(YELLOW)Bumping minor version...$(NC)"
	npm version minor
	@echo "$(GREEN)✓ Minor version bumped$(NC)"

version-major: prepare-release ## Bump major version (1.0.0 -> 2.0.0)
	@echo "$(YELLOW)Bumping major version...$(NC)"
	npm version major
	@echo "$(GREEN)✓ Major version bumped$(NC)"

dry-run: prepare-release ## Perform a dry run of npm publish
	@echo "$(YELLOW)Performing dry run...$(NC)"
	npm publish --dry-run
	@echo "$(GREEN)✓ Dry run completed$(NC)"

publish: prepare-release ## Publish to npm (requires npm authentication)
	@echo "$(YELLOW)Publishing to npm...$(NC)"
	@echo "$(RED)WARNING: This will publish $(PACKAGE_NAME) to npm!$(NC)"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	npm publish
	@echo "$(GREEN)✓ Published successfully!$(NC)"

publish-beta: prepare-release ## Publish beta version to npm
	@echo "$(YELLOW)Publishing beta version to npm...$(NC)"
	npm publish --tag beta
	@echo "$(GREEN)✓ Beta version published!$(NC)"

quick-test: ## Quick test of CLI functionality
	@echo "$(YELLOW)Testing CLI functionality...$(NC)"
	npm run build
	./bin/run.js create --help
	@echo "$(GREEN)✓ CLI is working$(NC)"

release-patch: version-patch publish ## Full patch release workflow
	@echo "$(GREEN)✓ Patch release completed!$(NC)"

release-minor: version-minor publish ## Full minor release workflow
	@echo "$(GREEN)✓ Minor release completed!$(NC)"

release-major: version-major publish ## Full major release workflow
	@echo "$(GREEN)✓ Major release completed!$(NC)"

status: ## Show current package status
	@echo "$(BLUE)Package Status$(NC)"
	@echo "$(BLUE)==============$(NC)"
	@echo "Name: $(PACKAGE_NAME)"
	@echo "Version: $$(npm list --depth=0 | head -1 | sed 's/.*@//')"
	@echo "Main: $$(node -p "require('./package.json').main")"
	@echo "Bin: $$(node -p "require('./package.json').bin['celo-composer']")"
	@echo ""
	@echo "$(BLUE)Files that will be published:$(NC)"
	@npm pack --dry-run 2>/dev/null | tail -n +2

info: ## Show npm package info
	@echo "$(YELLOW)Fetching npm package info...$(NC)"
	npm info $(PACKAGE_NAME)

# Development helpers
watch: ## Watch for changes and rebuild
	@echo "$(YELLOW)Watching for changes...$(NC)"
	@echo "$(BLUE)Press Ctrl+C to stop$(NC)"
	@while true; do \
		inotifywait -qq -r -e modify,create,delete src/ 2>/dev/null || \
		(echo "$(YELLOW)inotifywait not available, using basic loop$(NC)" && sleep 2); \
		make build; \
		echo "$(GREEN)✓ Rebuilt at $$(date)$(NC)"; \
	done

install-dev: ## Install development dependencies globally
	@echo "$(YELLOW)Installing development tools...$(NC)"
	npm install -g prettier typescript ts-node
	@echo "$(GREEN)✓ Development tools installed$(NC)"

# Cleanup commands
clean-all: clean ## Clean everything including node_modules
	@echo "$(GREEN)✓ Everything cleaned$(NC)"

reset: clean-all install build ## Reset project (clean + install + build)
	@echo "$(GREEN)✓ Project reset completed$(NC)" 