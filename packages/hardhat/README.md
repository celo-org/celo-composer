# Basic Sample Hardhat Project on Celo

[Hardhat Documentation](https://hardhat.org/getting-started/#overview)

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

## Setup

1. Create a `.env` file similar to `.envexample`. 
2. Add a mnemonic. You can easily generate one using [this tool](https://iancoleman.io/bip39/). This step is not required for local development with celo-devchain.
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
4. Deploy contracts with `yarn deploy`. Or specify a network directly with


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

## Verify

[Reference](https://docs.celo.org/blog/hardhat-deploy-verify)

On Alfajores:

```shell
npx hardhat --network alfajores sourcify
```

On Mainnet:

```shell
npx hardhat --network celo sourcify
```
