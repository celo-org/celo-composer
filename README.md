<!-- TITLE -->
<p align="center">
  <img width="100px" src="https://github.com/celo-org/celo-composer/blob/main/images/readme/celo_isotype.svg" align="center" alt="Celo" />
 <h2 align="center">Celo Composer</h2>
 <p align="center">Build, deploy, and iterate quickly on decentralized applications using Celo.</p>
</p>
  <p align="center">
    <a href="https://github.com/celo-org/celo-composer/graphs/stars">
      <img alt="GitHub Contributors" src="https://img.shields.io/github/stars/celo-org/celo-composer?color=FCFF52" />
    </a>
    <a href="https://github.com/celo-org/celo-composer/graphs/contributors">
      <img alt="GitHub Contributors" src="https://img.shields.io/github/contributors/celo-org/celo-composer?color=E7E3D4" />
    </a>
    <a href="https://github.com/celo-org/celo-composer/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/celo-org/celo-composer?color=E7E3D4" />
    </a>
    <a href="https://github.com/celo-org/celo-composer/pulls">
      <img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/celo-org/celo-composer?color=E7E3D4" />
    </a>
    <a href="https://opensource.org/license/mit/">
      <img alt="MIT License" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
    </a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->

<div>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
      <ol>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#prerequisites">Prerequisites</a></li>
     </ol>
    <li><a href="#how-to-use-celo-composer">How to use Celo Composer</a></li>
        <ol>
          <li><a href="#install-dependencies">Install Dependencies</a></li>
          <li><a href="#deploy-a-smart-contract">Deploy a Smart Contract</a></li>
          <li><a href="#deploy-your-dapp-locally">Deploy your Dapp Locally</a></li>
          <li><a href="#add-ui-components">Add UI Components</a></li>
          <li><a href="#deploy-with-vercel">Deploy with Vercel</a></li>
          <li><a href="#supported-frameworks">Supported Frameworks</a></li>
          <li><a href="#supported-templates">Supported Templates</a></li>
        </ol>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#support">Support</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

Celo Composer allows you to quickly build, deploy, and iterate on decentralized applications using Celo. It provides a number of frameworks, templates, deployment and component support, and Celo specific functionality to help you get started with your next dApp. 

It is the perfect lightweight starter-kit for any hackathon and for quickly testing out integrations and deployments on Celo.

<p align="right">(<a href="#top">back to top</a>)</p>

## Built With

Celo Composer is built on Celo to make it simple to build dApps using a variety of front-end frameworks, and libraries.

- [Celo](https://celo.org/)
- [Solidity](https://docs.soliditylang.org/en/v0.8.19/)
- [Hardhat](https://hardhat.org/)
- [React.js](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [viem](https://viem.sh/)
- [Tailwind](https://tailwindcss.com/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Prerequisites

- Node (v20 or higher)
- Git (v2.38 or higher)

## How to use Celo Composer

The easiest way to start with Celo Composer is using `@celo/celo-composer`. This CLI tool lets you quickly start building dApps on Celo, including several templates. To get started, just run the following command, and follow the steps:

- Step 1

```bash
npx @celo/celo-composer@latest create
```

- Step 2: Provide the Project Name: You will be prompted to enter the name of your project.

```text
What is your project name: 
```

- Step 3: Choose to Use Hardhat: You will be asked if you want to use Hardhat. Select Yes or No.

```text
Do you want to use Hardhat? (Y/n)
```

- Step 4: Choose to Use a Template: You will be asked if you want to use a template. Select `Yes` or `No`.

```text
Do you want to use a template?
```

- Step 5: Select a Template: If you chose to use a template, you will be prompted to select a template from the list provided.

```text
- Minipay
- Valora
```

- Step 6: Provide the Project Owner's Name: You will be asked to enter the project owner's name.

```text
Project Owner name:
```

- Step 7: Wait for Project Creation: The CLI will now create the project based on your inputs. This may take a few minutes.

- Step 8: Follow the instructions to start the project. The same will be displayed on the console after the project is created.

```text
🚀 Your starter project has been successfully created!
```

## Install Dependencies


Once your custom dApp has been created, just install dependencies, either with yarn:

```bash
   yarn
```

If you prefer npm, you can run:

```bash
   npm install
```

## Deploy a Smart Contract

Find the detailed instructions on how to run your smart contract in [packages/hardhat/README.md](./packages/hardhat/README.md).

For quick development follow these three steps:

1. Change `packages/hardhat/env.template` to `packages/hardhat/env` and add your `PRIVATE_KEY` into the `.env` file.
2. Make sure your wallet is funded when deploying to testnet or mainnet. You can get test tokens for deploying it on Alfajores from the [Celo Faucet](https://faucet.celo.org/alfajores).
3. Run the following commands from the `packages/hardhat` folder to deploy your smart contract to the Celo Testnet Alfajores:

```bash
npx hardhat ignition deploy ./ignition/modules/Lock.ts --network alfajores
```

## Deploy your Dapp Locally

Find the detailed instructions on how to run your frontend in the [`react-dapp` README.md](./packages/react-app/README.md).

Before you start the project, please follow these steps:

1. Rename the file:
   packages/react-app/.env.template
   to
   packages/react-app/.env

2. Open the newly renamed .env file and add your WalletConnect Cloud Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)

Once you've done that, you're all set to start your project!

Run the following commands from the `packages/react-app` folder to start the project:

```bash
   yarn dev
```

If you prefer npm, you can run:

```bash
   npm run dev
```

Thank you for using Celo Composer! If you have any questions or need further assistance, please refer to the README or reach out to our team.

**_🔥Voila, you have a dApp ready to go. Start building your dApp on Celo._**


## Add UI Components

To keep the Celo Composer as lightwieght as possible we didn't add any components but rather a guide on how to add the components you need yourself with a very simple to use components library. To learn how to add UI components using [ShadCN](https://ui.shadcn.com/) in this project, refer to the [UI Components Guide](./docs/UI_COMPONENTS.md).

## Deploy with Vercel

The Celo Composer is a great tool for hackathons and fast deployments. We created a guide for you, using the Vercel CLI to create a live deployment in minutes. For detailed instructions on deploying the Next.js app using Vercel CLI, refer to the [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md).


## Supported Frameworks

### React / Nextjs

- Support for Website and Progressive Web Application.
- Works with all major crypto wallets.

Check [nextjs docs](https://nextjs.org/docs) to learn more about it.

### Hardhat

- Robust framework for building and testing smart contracts.
- Compatible with various Ethereum development tools and plugins.

Check [hardhat docs](https://hardhat.org/hardhat-runner/docs/getting-started) to learn more about it.

## Supported Templates

### Minipay

- Pre-built template for creating a mini-payment application.
- Seamless integration with Celo blockchain for handling payments.

Checkout [minipay docs](https://docs.celo.org/developer/build-on-minipay/overview) to learn more about it.

### Valora

- Template designed for Valora wallet integration.
- Facilitates easy wallet connectivity and transaction management.

Checkout [valora docs](https://docs.valora.xyz/) to learn more about it.


## Support

Join the Celo Discord server at <https://chat.celo.org>. Reach out on the dedicated repo channel [here](https://discord.com/channels/600834479145353243/941003424298856448).

<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/celo-org/celo-composer/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

We welcome contributions from the community.

<p align="right">(<a href="#top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- CONTACT -->
## Contact

- [@CeloDevs](https://twitter.com/CeloDevs)
- [Discord](https://discord.com/invite/celo)

<p align="right">(<a href="#top">back to top</a>)</p>
