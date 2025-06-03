# Celo Composer CLI Test Examples

This document shows how to test both interactive and inline command modes of the Celo Composer CLI.

## Interactive Mode (Original behavior)

```bash
npx @celo/celo-composer@latest create
# This will prompt you for:
# - Project name
# - Whether to use Hardhat
# - Whether to use a template
# - Template choice (if selected)
# - Project owner name
```

## Inline Commands Mode (New feature)

### Full inline command

```bash
# Create a project with Hardhat and Minipay template
npx @celo/celo-composer@latest create \
  --name my-celo-app \
  --owner "John Doe" \
  --hardhat \
  --template Minipay

# Create a project without Hardhat using Valora template
npx @celo/celo-composer@latest create \
  -n my-valora-app \
  -o "Jane Smith" \
  --no-hardhat \
  -t Valora

```

### Partial inline command (mix of flags and prompts)

```bash
# Specify name and hardhat, but prompt for template and owner
npx @celo/celo-composer@latest create --name my-project --hardhat

# Specify name and owner, but prompt for hardhat and template choices
npx @celo/celo-composer@latest create -n my-app -o "Developer"

# Specify only the name, prompt for everything else
npx @celo/celo-composer@latest create --name my-new-project
```

## Available Flags

| Flag           | Short | Description                      | Values                               |
| -------------- | ----- | -------------------------------- | ------------------------------------ |
| `--name`       | `-n`  | Name of the project              | Any string (converted to kebab-case) |
| `--owner`      | `-o`  | Project owner name               | Any string                           |
| `--hardhat`    |       | Include Hardhat in the project   | Boolean flag                         |
| `--no-hardhat` |       | Exclude Hardhat from the project | Boolean flag                         |
| `--template`   | `-t`  | Template to use                  | `Minipay`, `Valora`                  |

## Test Commands

```bash
# Test help output
./bin/run.js create --help

# Test inline command (in /tmp to avoid conflicts)
cd /tmp
node /path/to/celo-composer/bin/run.js create --name test-app --owner "Test User" --no-hardhat --template Minipay

# Clean up test
rm -rf test-app
```
