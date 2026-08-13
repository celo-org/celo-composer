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

The entry point is `scripts/release.sh`. It bumps `package.json`, prompts for the CHANGELOG update, commits, tags `vX.Y.Z`, and pushes both — the pushed tag triggers this workflow, which verifies the tag matches `package.json` before publishing.

```bash
./scripts/release.sh patch   # or minor / major / X.Y.Z
```

If you need to trigger it without the script, push a matching tag by hand — but the version bump must already be committed, or the workflow's tag-vs-package.json check will fail:

```bash
git tag v2.4.14
git push origin v2.4.14
```

**Notes:**
- Tags are the only trigger; there is no manual-dispatch path (a CI-side version bump would publish a version the repo never recorded)
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

**Notes:**
- Tags are the only trigger; there is no manual-dispatch path
- The `package.json` version must be committed as the pre-release version (e.g. `2.4.14-beta.1`) before tagging — the workflow verifies tag and package.json agree

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
