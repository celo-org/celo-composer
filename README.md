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

Set the correct node version:

```shell
cd celo-dapp-starter
nvm use # uses node v12 as specified in .nvmrc
```

Install dependencies and start your local development chain

```shell
cd celo-dapp-starter/packages/hardhat
yarn install
yarn devchain
```

You can get a local copy of mainnet by forking with Ganache. Learn more about [forking Mainnet with ganache here.](https://trufflesuite.com/blog/introducing-ganache-7/index.html#1-zero-config-mainnet-forking)

In another terminal, start the frontend (React app using [Next.js](https://nextjs.org/))

```shell
cd packages/react-app-wagmi
yarn install
yarn dev
```

In a third terminal, deploy the contracts. Contracts are deployed to a local development chain by default. You can update this by specifying the `defaultNetwork` in `/packages/hardhat/hardhat.config.js`.

```shell
cd packages/hardhat
yarn deploy
```

- Edit smart contracts in `packages/hardhat/contracts`.
- Edit deployment scripts in `packages/hardhat/deploy`.
- Edit frontend in `packages/react-app-wagmi/pages/index.tsx`.
- Open http://localhost:3000 to see the app.

You can run `yarn deploy --reset` to force re-deploy your contracts to your local development chain.

## Developing with local devchain

You can import account account keys for the local development chain into Metamask. `cd /packages/hardhat` and run

```shell
npx hardhat devchain-keys
```

If you are working on a local development blockchain, you may see errors about `the tx doesn't have the correct nonce.` This is because wallets often cache the account nonce to reduce the number of RPC calls and can get out of sync when you restart your development chain. You can reset the account nonce in Metamask by going to `Settings > Advanced > Reset Account`. This will clear the tx history and force Metamask to query the appropriate nonce from your development chain.

## React library choices

There are multiple React packages in `packages`. The different packages use different libraries to connect to manage accounts, connections, contracts and other web3 actions. The suffix on the package indicates which package is used. I recommend using [`react-app-wagmi`](https://wagmi-xyz.vercel.app/) to start as it is the easiest to use and most stable. This packages should work with most EVM chains.

`react-app-usecontractkit` uses the Celo specific [use-contractkit library](https://use-contractkit-c-labs.vercel.app/) that allows you to pay transaction fees in Celo stable coins. This package in this repo is still a work in progress (WIP), I recommend you start building using the `wagmi` package.

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