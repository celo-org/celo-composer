# Truffle | Celo Composer

This project demonstrates a basic Truffle use case. It comes with a sample contractand a sample script that deploys that contract.

## Setup & Installation

### Alfajores Testnet Setup

**Note** This setup is not required when using a local development blockchain (like celo-devchain or Ganache).

1. Create a `.env` file similar to `.envexample`.
2. Paste the private key in `.env`.
3. Faucet your account with the Alfajores testnet faucet [here](https://celo.org/developers/faucet).

## Develop

1. Write your contracts in `./contracts`.
2. Update contract deployment scripts in `./deploy`.
3. Compile the contracts with `truffle compile` in `packages/truffle` directory.
4. Deploy contracts with `truffle deploy --network alfajores`.

Network configs are defined in `truffle-config.js`.

## Fork mainnet with [Ganache](https://trufflesuite.com/blog/introducing-ganache-7/index.html#1-zero-config-mainnet-forking)

You can get a local copy of mainnet by forking with Ganache. Learn more about [forking mainnet with Ganache here.](https://trufflesuite.com/blog/introducing-ganache-7/index.html#1-zero-config-mainnet-forking)
