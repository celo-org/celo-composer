# React Framework + NextJS | Celo Composer

Celo Composer support React boilerplate template with TailwindCSS. This is a starter kit with no additional boilerplate code. It's a perfect starter kit to get your project started on Celo blockchain.

## Setup & Installation


### Set environment variables

Create a copy of `.env.example` and rename it to `.env`.

#### Add Wallet Connect ID

You will need a Wallet Connect ID to run the project. You can create one here: https://cloud.walletconnect.com/sign-in

Add the Wallet Connect ID in the `.env` file. 

### Install dependencies

Install all the required dependencies to run the dApp.

Using **yarn**

```bash
yarn
```

or using **npm**

```bash
npm i
```

> React + Tailwind CSS Template does not have any dependency on hardhat.
> This starterkit does not include connection of Hardhat/Truffle with ReactJS. It's up to the user to integrate smart contract with ReactJS. This gives user more flexibility over the dApp.

-   To start the dApp, run the following command.

```bash
yarn dev
```

## Dependencies

### Default

-   [Next.js](https://nextjs.org/) app framework
-   [TailwindCSS](https://tailwindcss.com/) for UI
-   [rainbowkit-celo](https://www.npmjs.com/package/@celo/rainbowkit-celo), a plugin to help rainbowkit developers support the CELO protocol faster.

## Architecture

-   `/pages` includes the main application components (specifically `index.tsx` and `_app.tsx`)
    -   `_app.tsx` includes configuration
    -   `index.tsx` is the main page of the application
-   `/components` includes components that are rendered in `index.tsx`
-   `/public` includes static files
