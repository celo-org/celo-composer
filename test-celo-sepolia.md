# Celo Sepolia Test Examples

This document shows how to test the new Celo Sepolia support in Celo Composer.

## Quick Setup

```bash
# Install dependencies
cd packages/hardhat && npm install --legacy-peer-deps
cd ../react-app && npm install --legacy-peer-deps

# Set up environment
cp .env.template .env
# Add your PRIVATE_KEY to .env
```

## Test Contract Deployment

### Deploy to Celo Sepolia

```bash
# Get test tokens first from:
# https://faucet.celo.org/celo-sepolia
# https://cloud.google.com/application/web3/faucet/celo/sepolia

# Deploy the Lock contract
npx hardhat ignition deploy ./ignition/modules/Lock.ts --network celo-sepolia
```

**Expected Output:**
```
✔ Confirm deploy to network celo-sepolia (11142220)? … yes

Hardhat Ignition 🚀

Deploying [ LockModule ]

Batch #1
  Executed LockModule#Lock

[ LockModule ] successfully deployed 

Deployed Addresses

LockModule#Lock - 0x[CONTRACT_ADDRESS]
```

### Verify Contract (Optional)

```bash
npx hardhat verify 0x[CONTRACT_ADDRESS] 1893456000 --network celo-sepolia
```

## Test Frontend

### Start React App

```bash
cd packages/react-app
npm run dev
```

### Test Wallet Connection

1. Open http://localhost:3000
2. Click "Connect Wallet"
3. You should see **Celo Sepolia** in the network list
4. Connect and switch to Celo Sepolia

## Test Commands

```bash
# Test network connection
npx hardhat run --network celo-sepolia -e "console.log('Connected to Celo Sepolia!')"

# Test compilation
npx hardhat compile

# Test build
cd packages/react-app && npm run build
```

## Network Configuration

| Network      | Chain ID | RPC URL                                    | Explorer                           |
| ------------ | -------- | ------------------------------------------ | ---------------------------------- |
| Celo Sepolia | 11142220 | https://forno.celo-sepolia.celo-testnet.org | https://celo-sepolia.blockscout.com |
| Alfajores    | 44787    | https://alfajores-forno.celo-testnet.org   | https://alfajores.celoscan.io      |
| Celo Mainnet | 42220    | https://forno.celo.org                     | https://celoscan.io                |

## What's New

- Celo Sepolia network support
- Contract deployment to Celo Sepolia
- Frontend integration with Celo Sepolia
- Migration path from Alfajores

**Note**: Celo Sepolia is the new long-term testnet. Alfajores will be deprecated on September 30, 2025. 