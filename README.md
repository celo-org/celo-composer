# Celo Dapp Starter

A starter pack to get started with building dapps on Celo.

This repo is heavily inspired by [scaffold-eth](https://github.com/scaffold-eth/scaffold-eth).

Prerequisites:

1. Node (v12)
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

In another terminal, start the frontend (React app using [Next.js](https://nextjs.org/))

```shell
cd packages/react-app
yarn install
yarn dev
```

In a third terminal, deploy the contracts

```shell
cd packages/hardhat
yarn deploy
```

- Edit smart contracts in `packages/hardhat/contracts`.
- Edit deployment scripts in `packages/hardhat/deploy`.
- Edit frontend in `packages/react-app/pages/index.tsx`.
- Open http://localhost:3000 to see the app.

You can run `yarn deploy --reset` to force re-deploy your contracts to your local development chain.
# 🔭 Learning Solidity

📕 Read the docs: https://docs.soliditylang.org

📚 Go through each topic from [solidity by example](https://solidity-by-example.org) editing `YourContract.sol` in **🏗 scaffold-eth**

- [Primitive Data Types](https://solidity-by-example.org/primitives/)
- [Mappings](https://solidity-by-example.org/mapping/)
- [Structs](https://solidity-by-example.org/structs/)
- [Modifiers](https://solidity-by-example.org/function-modifier/)
- [Events](https://solidity-by-example.org/events/)
- [Inheritance](https://solidity-by-example.org/inheritance/)
- [Payable](https://solidity-by-example.org/payable/)
- [Fallback](https://solidity-by-example.org/fallback/)

📧 Learn the [Solidity globals and units](https://solidity.readthedocs.io/en/v0.6.6/units-and-global-variables.html)