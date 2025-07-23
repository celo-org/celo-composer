# Deployment Guide

This document outlines the deployment process for the Celo Composer CLI to npm.

## Prerequisites

Before deploying, ensure you have:

1. **NPM Token**: A valid npm token with publish permissions for the `@celo` organization
2. **GitHub Secrets**: The following secrets configured in your GitHub repository:
   - `NPM_TOKEN`: Your npm authentication token
   - `GITHUB_TOKEN`: Automatically provided by GitHub Actions

## Deployment Methods

### 1. Automatic Deployment (Recommended)

#### Stable Release
1. Create and push a git tag:
   ```bash
   git tag v2.2.0
   git push origin v2.2.0
   ```

2. The GitHub Action will automatically:
   - Run tests and linting
   - Build the project
   - Publish to npm with `latest` tag
   - Create a GitHub release

#### Pre-release (Beta/Alpha/RC)
1. Create and push a pre-release tag:
   ```bash
   git tag v2.2.0-beta.1
   git push origin v2.2.0-beta.1
   ```

2. The GitHub Action will automatically:
   - Run tests and linting
   - Build the project
   - Publish to npm with appropriate dist-tag (`beta`, `alpha`, `rc`)
   - Create a GitHub pre-release

### 2. Manual Deployment

#### Using GitHub Actions UI
1. Go to the "Actions" tab in your GitHub repository
2. Select "Publish to NPM" workflow
3. Click "Run workflow"
4. Enter the version number (e.g., `2.2.0`)
5. Click "Run workflow"

#### Using GitHub Actions UI (Beta)
1. Go to the "Actions" tab in your GitHub repository
2. Select "Publish Beta to NPM" workflow
3. Click "Run workflow"
4. Enter the beta version (e.g., `2.2.0-beta.1`)
5. Select the dist-tag (`beta`, `alpha`, `rc`)
6. Click "Run workflow"

### 3. Local Deployment (Not Recommended)

Only use this method for emergency releases:

```bash
# Build the project
pnpm build

# Run tests
pnpm test

# Login to npm (if not already logged in)
npm login

# Publish
npm publish
```

## Version Management

### Semantic Versioning
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR** version (X.0.0): Breaking changes
- **MINOR** version (X.Y.0): New features, backward compatible
- **PATCH** version (X.Y.Z): Bug fixes, backward compatible

### Pre-release Versions
- **Alpha**: `2.2.0-alpha.1` - Early development, unstable
- **Beta**: `2.2.0-beta.1` - Feature complete, testing phase
- **RC**: `2.2.0-rc.1` - Release candidate, final testing

## NPM Dist Tags

- `latest`: Stable releases (default)
- `beta`: Beta releases
- `alpha`: Alpha releases
- `rc`: Release candidates

### Installing Specific Versions
```bash
# Latest stable
npm install -g @celo/celo-composer

# Beta version
npm install -g @celo/celo-composer@beta

# Specific version
npm install -g @celo/celo-composer@2.2.0

# Specific pre-release
npm install -g @celo/celo-composer@2.2.0-beta.1
```

## Release Checklist

### Before Release
- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md` with new features and fixes
- [ ] Run tests locally: `pnpm test`
- [ ] Run linting: `pnpm lint`
- [ ] Build project: `pnpm build`
- [ ] Test CLI locally: `npm pack && npm install -g ./celo-celo-composer-*.tgz`
- [ ] Test project generation with various options

### During Release
- [ ] Create and push git tag
- [ ] Monitor GitHub Actions workflow
- [ ] Verify npm package is published
- [ ] Test installation from npm: `npm install -g @celo/celo-composer@latest`

### After Release
- [ ] Update documentation if needed
- [ ] Announce release in relevant channels
- [ ] Monitor for issues and feedback
- [ ] Update any dependent projects

## Troubleshooting

### Common Issues

#### 1. NPM Token Expired
- Generate a new token on npmjs.com
- Update the `NPM_TOKEN` secret in GitHub repository settings

#### 2. Version Already Exists
- Check if the version was already published
- Increment the version number appropriately
- For pre-releases, increment the pre-release number (e.g., `beta.1` → `beta.2`)

#### 3. Build Failures
- Check the GitHub Actions logs
- Ensure all dependencies are properly installed
- Verify TypeScript compilation succeeds locally

#### 4. Test Failures
- Run tests locally to reproduce the issue
- Fix failing tests before attempting to deploy
- Ensure all new features have appropriate tests

### Getting Help

If you encounter issues during deployment:
1. Check the GitHub Actions logs for detailed error messages
2. Verify all prerequisites are met
3. Test the deployment process locally
4. Contact the development team for assistance

## Security Considerations

- Never commit npm tokens to the repository
- Use GitHub Secrets for sensitive information
- Regularly rotate npm tokens
- Monitor npm package for unauthorized changes
- Use 2FA on npm account
