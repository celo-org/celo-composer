# Celo Composer | Hardhat

## How to use

1. Create a copy of `.env.example` and rename it to `.env`.

2. For Deploying you will need `PRIVATE_KEY` set in `.env`.

3. For verification you will need [Celoscan API Key](https://celoscan.io/myapikey) `CELOSCAN_API_KEY` set in `.env`.

4. Compile the contract 

```bash
npx hardhat compile
```

5. Deploy the contract

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

6. Verify the contract

For Alfajores (Testnet) Verification

```bash
npx hardhat verify [CONTRACT_ADDRESS] [...CONSTRUCTOR_ARGS] --network alfajores
```

For Mainnet Verification

```bash
npx hardhat verify [CONTRACT_ADDRESS] [...CONSTRUCTOR_ARGS] --network celo
```

Check the file `hardhat.config.js` for Celo specific hardhat configuration.
