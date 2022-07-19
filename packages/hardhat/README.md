# Basic Sample Hardhat Project on Celo

[Hardhat Documentation](https://hardhat.org/getting-started/#overview)

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat devchain-keys  # print devchain keys
npx hardhat create-account # print new key + account
npx hardhat test           # run contract tests in ./test
```

## Alfajores Testnet Setup

**Note** This setup is not required when using a local development blockchain (like celo-devchain or Ganache).

1. Create a `.env` file similar to `.envexample`.
2. Add a private key. Generate a new one with `npx hardhat create-account`. Paste the private key in `.env`.
3. Faucet your account with the Alfajores testnet faucet [here](https://celo.org/developers/faucet).

## Develop

1. Write your contracts in `./contracts`.
2. Update contract deployment scripts in `./deploy`.
3. Deploy contracts with `yarn deploy`. Optionally add the reset flag (`yarn deploy --reset`) to overwrite previous deployment info. The default deployment network is specified in `hardhat.config.js` and is set to `alfajores` initially. You can also overwrite previous deployments and redeploy when there are changes to the deployment script or contracts automatically by running `yarn deploy-reset-watch`. You can specify a specific network deployment directly with

```shell
npx hardhat --network [network] deploy
```
  
4. Auto deploy any contract updates by running `yarn watch`.

Network configs are defined in `hardhat.config.js`.

## [Celo devchain](https://github.com/terminal-fi/celo-devchain)

Run a local development Celo chain with `yarn devchain`. You can print the addresses of the [Celo protocol contracts](https://github.com/celo-org/celo-monorepo/tree/master/packages/protocol) with `npx @terminal-fi/celo-devchain --test`.

This is a version of Ganache (@celo/ganache-cli) that deploys the Celo core protocol contracts when it starts.

**NOTE:** @celo/ganache-cli works only with Node 10 or Node 12 versions. Using Node 14 or later will result in errors.

**NOTE:** @celo/ganache-cli currently doesn't support locally signed transactions. If you send a locally signed transaction it will throw: Error: Number can only safely store up to 53 bits error and crash. Thus you have to make sure your ContractKit doesn't actually have the private keys for test addresses and send transactions to be signed by ganache-cli itself.

### Start

```shell
npx celo-devchain --port 8545
```

or

```shell
yarn devchain
```

### Generate Typescript bindings

This setting defaults to the web3 v1 bindings because that is what is used by use-contractkit in `packages/react-app`.

You can change the output directory and target in `hardhat.config.js`.

```shell
npx hardhat typechain
```

Read more about Typechain [here](https://github.com/dethcrypto/TypeChain) and more about the hardhat plugin [here](https://github.com/dethcrypto/TypeChain/tree/master/packages/hardhat).

### Run sanity tests and print all core contract addresses

```shell
npx @terminal-fi/celo-devchain --test
```

## Fork mainnet with [Ganache](https://trufflesuite.com/blog/introducing-ganache-7/index.html#1-zero-config-mainnet-forking)

You can get a local copy of mainnet by forking with Ganache. Learn more about [forking mainnet with Ganache here.](https://trufflesuite.com/blog/introducing-ganache-7/index.html#1-zero-config-mainnet-forking)

There is a script provided (`yarn fork-mainnet`) to fork mainnet and fund the same test accounts that come with Celo devchain. Sometimes sending transactions from the first account (which defaults to `0x5409ED021D9299bf6814279A6A1411A7e866A631`) is delayed and sending test transactions from the other accounts works better for some reason. :shrug: The private keys of the associated test accounts are printed in `account_keys.json`.

## Verify your contracts

You can easily verify your contracts deployed to the associated networks with the following commands.

[Reference](https://docs.celo.org/blog/hardhat-deploy-verify)

On Alfajores:

```shell
npx hardhat --network alfajores sourcify
```

On Mainnet:

```shell
npx hardhat --network celo sourcify
```

## Deploy with [Figment Datahub](https://datahub.figment.io/)

Figment Datahub provides RPC & REST APIs for Celo network. To learn more about Datahub refer this doc - [https://docs.figment.io/introduction/what-is-datahub](https://docs.figment.io/introduction/what-is-datahub). Follow these steps to deploy your smart contract with Figment datahub's RPC.

- Create account on [Datahub](https://datahub.figment.io/).
- On the dashboard, click on `Create new app` and select **Celo** from the protocol list.
- Once you have created an app, copy the api key.
- Edit `hardhat.config.js` and update `alfajoresDatahub` and `celoDatahub` with the API Key.
- Run the test or deploy the contract with following commands.

```bash
npx hardhat run scripts/run.ts --network alfajoresDatahub

npx hardhat run scripts/deploy.ts --network celoDatahub
```
