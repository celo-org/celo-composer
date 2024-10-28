# React Framework + NextJS | Celo Composer

Celo Composer support React boilerplate template with TailwindCSS. This is a starter kit with no additional boilerplate code. It's a perfect starter kit to get your project started on Celo blockchain.

## Setup & Installation


### Set environment variables

Create a copy of `.env.example` and rename it to `.env`.

#### Add Wallet Connect ID

Create a WalletConnect Cloud Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)

Provide the WalletConnect Cloud Project ID in your `.env` file to use WalletConnect in your project. As shown in the `.env.example` file.

```typescript
NEXT_PUBLIC_WC_PROJECT_ID=YOUR_EXAMPLE_PROJECT_ID;
```


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

- To start the dApp, run the following command.

```bash
yarn dev
```

## Dependencies

### Default

- [Next.js](https://nextjs.org/) app framework
- [TailwindCSS](https://tailwindcss.com/) for UI

## Architecture

- `/pages` includes the main application components (specifically `layout.tsx` and `page.tsx`)
  - `layout.tsx` includes configuration
  - `page.tsx` is the main page of the application
- `/components` includes components that are rendered in `page.tsx`
- `/public` includes static files

