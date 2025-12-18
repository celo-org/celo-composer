# Deployment Guide

This document describes the CI/CD workflows for the `@celo/celo-composer` CLI tool.

## Workflows

### 1. CI Workflow

**Description:**
Runs automated tests and validation on every push and pull request. This workflow ensures code quality by:
- Linting TypeScript code
- Building the project
- Running tests
- Verifying build artifacts
- Testing CLI installation

**How to Trigger:**
- Automatically runs on push to `main` or `develop` branches
- Automatically runs on pull requests targeting `main` or `develop` branches
- No manual action required

**View Results:**
- Go to the [Actions tab](https://github.com/celo-org/celo-composer/actions) on GitHub
- Click on any workflow run to see detailed logs

---

### 2. Publish Workflow (Stable Releases)

**Description:**
Publishes stable releases to npm with the `latest` tag and creates GitHub releases. This workflow:
- Runs all CI checks (lint, build, test)
- Publishes the package to npm
- Creates a GitHub release with release notes

**How to Trigger:**

**Automatic (Recommended):**
1. Ensure your code is on the `main` branch and all changes are committed and pushed
2. Make sure `package.json` version is already updated to match the release version / new version (e.g., `2.4.14`)
3. Create and push a version tag from your local machine:
   ```bash
   git tag v2.4.14
   git push origin v2.4.14
   ```
   The workflow will automatically trigger when you push a tag matching `v*` (excluding pre-releases). This does not create any new commit, just trigger deployment workflow.

**Manual:**
1. Go to [Actions](https://github.com/celo-org/celo-composer/actions) → **Publish to NPM**
2. Click **Run workflow**
3. Select the branch (usually `main`)
4. Enter the version number (e.g., `2.4.14`)
5. Click **Run workflow**
   
   **Note:** Manual dispatch will automatically update `package.json` version, but won't create a git tag.

**Notes:**
- Code should be on the `main` branch (or the branch you're releasing from)
- Git commands are run from your local machine
- Tags containing `-beta`, `-alpha`, or `-rc` will be handled by the Publish-beta workflow instead

---

### 3. Publish-beta Workflow (Pre-Releases)

**Description:**
Publishes pre-releases (beta/alpha/rc) to npm with appropriate dist-tags and creates GitHub pre-releases. This workflow:
- Automatically detects the dist-tag from the tag name
- Runs all CI checks
- Publishes to npm with the appropriate dist-tag (`beta`, `alpha`, or `rc`)
- Creates a GitHub pre-release

**How to Trigger:**

**Automatic (Recommended):**
1. Ensure your code is on the `main` branch and all changes are committed and pushed
2. Make sure `package.json` version is already updated with pre-release/beta version (e.g., `2.4.14-beta.1`)
3. Create and push a pre-release tag from your local machine:
   ```bash
   # Beta release
   git tag v2.4.14-beta.1
   git push origin v2.4.14-beta.1
   
   # Alpha release
   git tag v2.4.14-alpha.1
   git push origin v2.4.14-alpha.1
   
   # Release candidate
   git tag v2.4.14-rc.1
   git push origin v2.4.14-rc.1
   ```
   The workflow will automatically trigger when you push a tag matching `v*-beta*`, `v*-alpha*`, or `v*-rc*`.

**Manual:**
1. Go to [Actions](https://github.com/celo-org/celo-composer/actions) → **Publish Beta to NPM**
2. Click **Run workflow**
3. Select the branch (usually `main`)
4. Enter:
   - **Version**: `2.4.14-beta.1` (or alpha/rc)
   - **Tag**: `beta` (or `alpha` or `rc`)
5. Click **Run workflow**
   
   **Note:** Manual dispatch will automatically update `package.json` version, but won't create a git tag.

**Notes:**
- Code should be on the `main` branch (or the branch you're releasing from)
- Git commands are run from your local machine
- For automatic trigger: You must manually update `package.json` version before creating the tag

**Installation:**
Users can install pre-releases with:
```bash
npm install -g @celo/celo-composer@beta
npm install -g @celo/celo-composer@alpha
npm install -g @celo/celo-composer@rc
```

---

## Version Numbering

Follow [Semantic Versioning](https://semver.org/):

- **Stable releases**: `v2.4.14` (MAJOR.MINOR.PATCH)
- **Pre-releases**: `v2.4.14-beta.1`, `v2.4.14-alpha.1`, `v2.4.14-rc.1`

## Monitoring

- **GitHub Actions:** https://github.com/celo-org/celo-composer/actions
- **npm Package:** https://www.npmjs.com/package/@celo/celo-composer
- **GitHub Releases:** https://github.com/celo-org/celo-composer/releases
