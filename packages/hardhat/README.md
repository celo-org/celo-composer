# Basic Sample Hardhat Project on Celo

[Hardhat Documentation](https://hardhat.org/getting-started/#overview)

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat devchain-keys
```

## Alfajores Testnet Setup

**Note** This setup is not required when using a local development blockchain (like celo-devchain or Ganache).

1. Create a `.env` file similar to `.envexample`.
2. Add a mnemonic. You can easily generate one using [this tool](https://iancoleman.io/bip39/).
3. Run

```shell
npx hardhat accounts
```

to print the accounts associated with your mnemonic.

4. Faucet your first account in the list on the Alfajores testnet [here](https://celo.org/developers/faucet).

## Develop

1. Write your contracts in `./contracts`.
2. Update contract deployment scripts in `./deploy`.
3. Run a local development Celo chain with `yarn devchain`. You can print the addresses of the [Celo protocol contracts](https://github.com/celo-org/celo-monorepo/tree/master/packages/protocol) with `npx @terminal-fi/celo-devchain --test`.
4. Deploy contracts with `yarn deploy`. Optionally add the reset flag (`yarn deploy --reset`) to overwrite previous deployment info. The default deployment network is specified in `hardhat.config.js` and is set to `alfajores` initially. You can also overwrite previous deployments and redeploy when there are changes to the deployment script or contracts automatically by running `yarn deploy-reset-watch`. You can specify a specific network deployment directly with

```shell
npx hardhat --network [network] deploy
```
  
5. Auto deploy any contract updates by running `yarn watch`.

Network names are defined in `hardhat.config.js`.

## [Celo devchain](https://github.com/terminal-fi/celo-devchain)

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

### Run sanity tests and print all core contract addresses:

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
