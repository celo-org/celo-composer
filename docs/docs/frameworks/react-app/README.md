# React Framework | Celo Composer

Celo Composer support React boilerplate template. This React framework in based on [Scaffold-eth](https://github.com/scaffold-eth/scaffold-eth) theme. This starter kit support Progressive Web Application.

## Setup & Intallation

```bash
yarn
```

Run `yarn` or `npm install` to install all the required dependencies to run the dApp.

### Running React Framework with Hardhat

If you are using React with Hardhat framework, follow the below steps to start your dApp.

- Goto hardhat dirctory and install all the dependencies.

```bash
cd <app_name>/packages/hardhat
yarn
```

- Before deploying the contracts, you need to create `.env` file and add the `PRIVATE_KEY`.
- Run the following command in `hardhat` directory to use `envexmaple` created by celo-composer.

```bash
mv .envexample .env
```

- Add the private key of the account you wish to use to deploy the contract in the `.env` file.

#### Deploying contracts on Alfajores blockchain

- Run the following command from the **root directory of the project.**

```bash
yarn hardhat-deploy --network alfajores
```

### Running React Framework with Truffle

- Install truffle globally using following command.

```bash
npm install -g truffle // Might have to use sudo
```

- Before deploying the contracts, you need to create `.env` file and add the `PRIVATE_KEY`.
- Run the following command in `truffle` directory to use `.envexmaple` created by celo-composer.

```bash
mv .envexample .env
```

- Add the private key of the account you wish to use to deploy the contract in the `.env` file.

- Run the following command to compile & deploy all the contract in `contracts` directory.

```bash
truffle compile
truffle deploy --network alfajores
```

#### Troubleshoot for Truffle

The project created in `react-app` is by default created for hardhat, but it's really easy to use it for Truffle. Follow the below instructions to use Truffle.

- Open the file - `packages/react-app/pages/index.tsx`
- In `index.tsx`, there are few comments starting with `To use Truffle`. Go throught the files and uncomment the lines below these commands, and comment the line above it to use the `react-app` with `truffle`.

> Note that you will need Alfajores Testnet CELO tokens in your wallet to deploy the contracts. You can get testnet CELO from [here](https://celo.org/developers/faucet).

## Dependencies

- [react-celo](https://www.npmjs.com/package/@celo/react-celo) for web3 connection and account management
- [Next.js](https://nextjs.org/) app framework
- [Apollo Client](https://www.npmjs.com/package/apollo-client) (for Graph queries)
- [Material UI](https://mui.com/getting-started/installation/) for designed React Components

## Architecture

- `/pages` includes the main application components (specifically `index.tsx` and `_app.tsx`)
  - `_app.tsx` includes configurartion
  - `index.tsx` is the main page of the application
- `/components` includes components that are rendered in `index.tsx`
- `/public` includes files for the PWA
- `/utils` is for utility functions

## PWA (Progressive Web App)

This application uses [next-pwa](https://www.npmjs.com/package/next-pwa) to make this a mobile friendly [progressive web application](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps).

PWAs are similar to web pages, but have some additional features that give users an experience on par with native apps.
