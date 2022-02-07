# Celo Dapp Starter

A starter pack to get started with building dapps on Celo.

This repo is heavily inspired by [scaffold-eth](https://github.com/scaffold-eth/scaffold-eth).

Prerequisites:

1. Node (v12), [NVM](https://github.com/nvm-sh/nvm)
2. Yarn
3. Git

```shell
git clone https://github.com/critesjosh/celo-dapp-starter
```

### Set the correct node version (several Celo packages require using node version 12.x):

```shell
cd celo-dapp-starter
nvm use # uses node v12 as specified in .nvmrc
```

### Get testnet funds and install dependencies

```shell
cd packages/hardhat
yarn install
npx hardhat create-account # prints a private key + account
```

Paste the private key in `packages/hardhat/.env` and fund the account from the faucet [here](https://celo.org/developers/faucet). Once the account is funded, deploy the contracts with:

```shell
yarn deploy
```

Read more details about [the hardhat package here](packages/hardhat/README.md).

### In another terminal, start the frontend (React app using [Next.js](https://nextjs.org/))

```shell
cd packages/react-app
yarn install
yarn dev
```

**Serve your React app to your mobile device for testing via a tunnel.**

Next.js defaults to serving your app on port 3000, so that's what we'll do here:

```shell
npx localtunnel --port 3000
```

Read more about localtunnel [here](https://www.npmjs.com/package/localtunnel).

- Edit smart contracts in `packages/hardhat/contracts`.
- Edit deployment scripts in `packages/hardhat/deploy`.
- Edit frontend in `packages/react-app/pages/index.tsx`.
- Open http://localhost:3000 to see the app.

You can run `yarn deploy --reset` to force re-deploy your contracts to your local development chain.

## Developing with local devchain

You can import account account keys for the local development chain into Metamask. To print they private keys of the local chain accounts `cd /packages/hardhat` and run

```shell
npx hardhat devchain-keys
```

If you are working on a local development blockchain, you may see errors about `the tx doesn't have the correct nonce.` This is because wallets often cache the account nonce to reduce the number of RPC calls and can get out of sync when you restart your development chain. You can reset the account nonce in Metamask by going to `Settings > Advanced > Reset Account`. This will clear the tx history and force Metamask to query the appropriate nonce from your development chain.

**Note:** You can get a local copy of mainnet by forking with Ganache. Learn more about [forking mainnet with Ganache here.](https://trufflesuite.com/blog/introducing-ganache-7/index.html#1-zero-config-mainnet-forking)

## React library choices

The example UI in `packages/react-app` uses the [Next.js](https://nextjs.org/) React framework, and [use-contractkit](https://www.npmjs.com/package/@celo-tools/use-contractkit) Celo library to get you started with building a responsive, web3 DApp quickly. Feel free to use it as a reference and use whatever web3 packages you are familiar with.

## The Graph

The `/packages/subgraphs` directory includes an example subgraph for reading data from the example `Storage.sol` contract. The Graph is a blockchain data indexing service that makes it easier to read data from EVM blockchains. You can read more about how the Graph works and how to use it in the [README here](/packages/subgraphs/README.md).

## 🔭 Learning Solidity

📕 Read the docs: https://docs.soliditylang.org

- [Primitive Data Types](https://solidity-by-example.org/primitives/)
- [Mappings](https://solidity-by-example.org/mapping/)
- [Structs](https://solidity-by-example.org/structs/)
- [Modifiers](https://solidity-by-example.org/function-modifier/)
- [Events](https://solidity-by-example.org/events/)
- [Inheritance](https://solidity-by-example.org/inheritance/)
- [Payable](https://solidity-by-example.org/payable/)
- [Fallback](https://solidity-by-example.org/fallback/)

📧 Learn the [Solidity globals and units](https://solidity.readthedocs.io/en/v0.6.6/units-and-global-variables.html)