# Celo Composer | Hardhat

## How to use

1. Create a copy of `.env.example` and rename it to `.env`.

2. For Deploying you will need `PRIVATE_KEY` set in `.env`.

3. For verification you will need [Celoscan API Key](https://celoscan.io/myapikey) `CELOSCAN_API_KEY` set in `.env`.

For Alfajores (Testnet) Verification

```bash
npx hardhat verify [CONTRACT_ADDRESS] [...CONSTRUCTOR_ARGS] --network alfajores
```

For Mainnet Verification

```bash
npx hardhat verify [CONTRACT_ADDRESS] [...CONSTRUCTOR_ARGS] --network celo
```

Check the file `hardhat.config.js` for Celo specific hardhat configuration.
