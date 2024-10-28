# Celo Composer | Hardhat

## How to use

1. Create a copy of `.env.example` and rename it to `.env`.

   1. For the **smart contract deployment** you will need the `PRIVATE_KEY` set in `.env`. **Never** use a wallet with real funds for development. Always have a separate wallet for testing. 
   2. For the **smart contract verification** you will need a [Celoscan API Key](https://celoscan.io/myapikey) `CELOSCAN_API_KEY` set in `.env`.

2. Compile the contract 

```bash
npx hardhat compile
```

5. Deploy the contract

Make sure your wallet is funded when deploying to testnet or mainnet. You can get test tokens for deploying it on Alfajores from the [Celo Faucet](https://faucet.celo.org/alfajores).

```bash
npx hardhat ignition deploy ./ignition/modules/Lock.js --network <network-name>
```

On Alfajores

```bash
npx hardhat ignition deploy ./ignition/modules/Lock.js --network alfajores
```


On Celo Mainnet

```bash
npx hardhat ignition deploy ./ignition/modules/Lock.js --network celo
```

1. Verify the contract

For Alfajores (Testnet) Verification

```bash
npx hardhat verify [CONTRACT_ADDRESS] [...CONSTRUCTOR_ARGS] --network alfajores
```

For Celo Mainnet Verification

```bash
npx hardhat verify [CONTRACT_ADDRESS] [...CONSTRUCTOR_ARGS] --network celo
```

Check the file `hardhat.config.js` for Celo specific hardhat configuration.
