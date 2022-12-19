# React Framework + TailwindCSS | Celo Composer

Celo Composer support React boilerplate template with TwilwindCSS. This is a starterkit with no additional boilderplate code. It's a perfect starterkit to get your project started on Celo blockchain.

## Setup & Intallation

```bash
yarn
```

Run `yarn` or `npm install` to install all the required dependencies to run the dApp.

> React + Tailwind CSS Template does not have any dependency on hardhat and truffle.
> This starterkit does not include connection of Hardhat/Truffle with ReactJS. It's up to the user to integrate smart contract with ReactJS. This gives user more flexibily over the dApp.

- To start the dApp, run the following command.

```bash
yarn react-dev
```

## Dependencies

- [react-celo](https://www.npmjs.com/package/@celo/react-celo) for web3 connection and account management
- [Next.js](https://nextjs.org/) app framework
- [TailwindCSS](https://tailwindcss.com/) for UI

## Architecture

- `/pages` includes the main application components (specifically `index.tsx` and `_app.tsx`)
  - `_app.tsx` includes configurartion
  - `index.tsx` is the main page of the application
- `/components` includes components that are rendered in `index.tsx`
- `/public` includes static files
