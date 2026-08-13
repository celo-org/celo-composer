#!/bin/bash

# Celo Composer CLI Release Script
# Usage: ./scripts/release.sh [version] [type]
# Example: ./scripts/release.sh 2.2.0 stable
# Example: ./scripts/release.sh 2.2.0-beta.1 beta

set -e

VERSION=$1
TYPE=${2:-stable}

if [ -z "$VERSION" ]; then
    echo "Error: Version is required"
    echo "Usage: ./scripts/release.sh [version] [type]"
    echo "Example: ./scripts/release.sh 2.2.0 stable"
    echo "Example: ./scripts/release.sh 2.2.0-beta.1 beta"
    exit 1
fi

echo "🚀 Starting release process for version $VERSION ($TYPE)"

# Show current branch for reference
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📍 Current branch: $CURRENT_BRANCH"

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "Error: Working directory is not clean. Please commit or stash your changes."
    git status --short
    exit 1
fi

# Update version in package.json
echo "📝 Updating version in package.json to $VERSION"
pnpm version $VERSION --no-git-tag-version

# Update CHANGELOG.md
echo "📝 Please update CHANGELOG.md with the changes for version $VERSION"
echo "Press Enter to continue after updating CHANGELOG.md..."
read

# Run tests and build
echo "🧪 Running tests and build..."
pnpm install
pnpm lint
pnpm test
pnpm build

# Commit version changes
echo "💾 Committing version changes..."
git add package.json CHANGELOG.md
git commit -m "chore: bump version to $VERSION"

# Create and push tag
echo "🏷️  Creating and pushing tag v$VERSION..."
git tag "v$VERSION"
git push origin $CURRENT_BRANCH
git push origin "v$VERSION"

echo "✅ Version bumped, committed and tagged."
echo ""
echo "🚀 The pushed tag triggers .github/workflows/publish.yml, which runs"
echo "   lint, build and the smoke-test suite, verifies the tag matches"
echo "   package.json, publishes to npm, and creates the GitHub release."
echo "   Watch it at: https://github.com/celo-org/celo-composer/actions"
echo ""
echo "📦 Manual fallback if the workflow is unavailable:"
echo "  pnpm publish --access public   # runs prepublishOnly (clean, build, test)"
echo ""
echo "📋 After successful deployment:"
echo "  - Verify npm package: https://www.npmjs.com/package/@celo/celo-composer"
echo "  - Test installation: npm install -g @celo/celo-composer@$VERSION"
echo "  - Check GitHub release: https://github.com/celo-org/celo-composer/releases"
