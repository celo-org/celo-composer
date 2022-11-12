# Celo Composer Frontend

## Getting Started

### Install

```shell
yarn
```

### Start

```shell
yarn dev
```

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
