# NPM Deployment Setup for @celo/celo-composer

This document provides step-by-step instructions to set up automated deployment to npm for the Celo Composer CLI.

## 🔧 Setup Requirements

### 1. NPM Account & Organization Access
- Ensure you have an npm account with access to the `@celo` organization
- Generate an npm token with publish permissions:
  1. Go to https://www.npmjs.com/settings/tokens
  2. Click "Generate New Token"
  3. Select "Automation" type
  4. Copy the token (starts with `npm_`)

### 2. GitHub Repository Secrets
Add the following secret to your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add:
   - **Name**: `NPM_TOKEN`
   - **Value**: Your npm token from step 1

## 📦 Package Configuration

The following files have been configured for npm publishing:

### ✅ package.json Updates
- **Package name**: `@celo/celo-composer`
- **Version**: `2.2.0`
- **Repository info**: GitHub repository links
- **Files**: Specifies which files to include in npm package
- **PublishConfig**: Set to public access
- **Scripts**: Added `prepublishOnly` and `prepack` for build automation

### ✅ GitHub Actions Workflows

#### 1. Main Publish Workflow (`.github/workflows/publish.yml`)
- **Triggers**: 
  - Git tags matching `v*` (e.g., `v2.2.0`)
  - Manual workflow dispatch
- **Actions**:
  - Runs tests and linting
  - Builds the project
  - Publishes to npm with `latest` tag
  - Creates GitHub release

#### 2. Beta Publish Workflow (`.github/workflows/publish-beta.yml`)
- **Triggers**:
  - Git tags matching `v*-beta*`, `v*-alpha*`, `v*-rc*`
  - Manual workflow dispatch
- **Actions**:
  - Runs tests and linting
  - Builds the project
  - Publishes to npm with appropriate dist-tag
  - Creates GitHub pre-release

#### 3. CI Workflow (`.github/workflows/ci.yml`)
- **Triggers**: Push to main/develop, Pull requests
- **Actions**:
  - Tests on Node.js 18 and 20
  - Validates build artifacts
  - Tests CLI installation and project generation

## 🚀 Deployment Methods

### Method 1: Automatic (Recommended)

#### Stable Release
```bash
# Create and push a version tag
git tag v2.2.0
git push origin v2.2.0
```

#### Pre-release
```bash
# Create and push a pre-release tag
git tag v2.2.0-beta.1
git push origin v2.2.0-beta.1
```

### Method 2: Using Release Script
```bash
# Make script executable (first time only)
chmod +x scripts/release.sh

# Create a stable release
./scripts/release.sh 2.2.0 stable

# Create a beta release
./scripts/release.sh 2.2.0-beta.1 beta
```

### Method 3: Manual via GitHub UI
1. Go to Actions tab in GitHub repository
2. Select "Publish to NPM" workflow
3. Click "Run workflow"
4. Enter version and run

## 📋 Pre-Deployment Checklist

Before creating a release:

- [ ] **Update version** in `package.json`
- [ ] **Update CHANGELOG.md** with new features and fixes
- [ ] **Run tests locally**: `pnpm test`
- [ ] **Run linting**: `pnpm lint`
- [ ] **Build project**: `pnpm build`
- [ ] **Test CLI locally**: 
  ```bash
  npm pack
  npm install -g ./celo-celo-composer-*.tgz
  celo-composer --help
  ```
- [ ] **Test project generation** with various options
- [ ] **Commit all changes** to git
- [ ] **Ensure clean working directory**

## 🔍 Verification Steps

After deployment:

1. **Check npm package**: https://www.npmjs.com/package/@celo/celo-composer
2. **Test installation**:
   ```bash
   npm install -g @celo/celo-composer@latest
   celo-composer --version
   ```
3. **Test project creation**:
   ```bash
   npx @celo/celo-composer create test-project
   ```
4. **Check GitHub release**: https://github.com/celo-org/celo-composer/releases

## 🏷️ Version Management

### Semantic Versioning
- **MAJOR** (X.0.0): Breaking changes
- **MINOR** (X.Y.0): New features, backward compatible  
- **PATCH** (X.Y.Z): Bug fixes, backward compatible

### Pre-release Tags
- **Alpha**: `2.2.0-alpha.1` - Early development
- **Beta**: `2.2.0-beta.1` - Feature complete, testing
- **RC**: `2.2.0-rc.1` - Release candidate

### NPM Dist Tags
- `latest`: Stable releases (default)
- `beta`: Beta releases
- `alpha`: Alpha releases
- `rc`: Release candidates

## 🛠️ Troubleshooting

### Common Issues

1. **NPM Token Expired**
   - Generate new token on npmjs.com
   - Update `NPM_TOKEN` secret in GitHub

2. **Version Already Exists**
   - Check existing versions on npm
   - Increment version appropriately

3. **Build Failures**
   - Check GitHub Actions logs
   - Test build locally: `pnpm build`

4. **Permission Denied**
   - Verify npm token has publish permissions
   - Ensure access to `@celo` organization

## 📞 Support

For deployment issues:
1. Check GitHub Actions logs for detailed errors
2. Verify all prerequisites are met
3. Test deployment process locally
4. Contact the development team

## 🔒 Security Notes

- Never commit npm tokens to repository
- Use GitHub Secrets for sensitive information
- Regularly rotate npm tokens
- Enable 2FA on npm account
- Monitor npm package for unauthorized changes

---

## Quick Start Summary

1. **Setup**: Add `NPM_TOKEN` to GitHub Secrets
2. **Release**: Create and push git tag (`git tag v2.2.0 && git push origin v2.2.0`)
3. **Monitor**: Check GitHub Actions for deployment status
4. **Verify**: Test npm installation and functionality

The deployment is now fully automated! 🎉
