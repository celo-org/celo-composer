<!-- TITLE -->
<p align="center">
  <img width="100px" src="https://github.com/celo-org/celo-composer/blob/main/images/readme/celo_isotype.svg" align="center" alt="Celo" />
  <h2 align="center">Celo Composer</h2>
  <p align="center">Build, deploy, and iterate quickly on decentralized applications using Celo.</p>
</p>

<p align="center">
    <a href="https://github.com/celo-org/celo-composer/stargazers">
      <img alt="GitHub Stars" src="https://img.shields.io/github/stars/celo-org/celo-composer?color=FCFF52" />
    </a>
    <a href="https://github.com/celo-org/celo-composer/graphs/contributors">
      <img alt="GitHub Contributors" src="https://img.shields.io/github/contributors/celo-org/celo-composer?color=E7E3D4" />
    </a>
    <a href="https://github.com/celo-org/celo-composer/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/celo-org/celo-composer?color=E7E3D4" />
    </a>
    <a href="https://github.com/celo-org/celo-composer/pulls">
      <img alt="GitHub Pull Requests" src="https://img.shields.io/github/issues-pr/celo-org/celo-composer?color=E7E3D4" />
    </a>
    <a href="https://opensource.org/license/mit/">
      <img alt="MIT License" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
    </a>
</p>

---

## **Table of Contents**
1. [About The Project](#about-the-project)
   - [Built With](#built-with)
   - [Prerequisites](#prerequisites)
2. [How to use Celo Composer](#how-to-use-celo-composer)
   - [Install Dependencies](#install-dependencies)
   - [Deploy a Smart Contract](#deploy-a-smart-contract)
   - [Deploy Your Dapp Locally](#deploy-your-dapp-locally)
   - [Add UI Components](#add-ui-components)
   - [Deploy with Vercel](#deploy-with-vercel)
   - [Supported Frameworks](#supported-frameworks)
   - [Supported Templates](#supported-templates)
3. [Usage](#usage)
4. [Support](#support)
5. [Roadmap](#roadmap)
6. [Contributing](#contributing)
7. [License](#license)
8. [Contact](#contact)

---

## **About The Project**

Celo Composer allows you to quickly build, deploy, and iterate on decentralized applications using Celo. It provides a variety of frameworks, templates, deployment tools, UI components, and Celo-specific functionality to accelerate your dApp development.  

This is an ideal lightweight starter-kit for hackathons and rapid prototyping on Celo.

---

## **Built With**
Celo Composer is built on the Celo ecosystem and supports multiple frameworks and libraries:

- [Celo](https://celo.org/)
- [Solidity](https://docs.soliditylang.org/)
- [Hardhat](https://hardhat.org/)
- [React.js](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [Viem](https://viem.sh/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## **Prerequisites**
Ensure you have the following installed:

- **Node.js** (v20 or higher)
- **Git** (v2.38 or higher)

---

## **How to use Celo Composer**

The easiest way to start is by using the `@celo/celo-composer` CLI tool. It helps bootstrap dApps with different templates.

```bash
npx @celo/celo-composer@latest create
```

### **Installation Steps**
1. **Enter a project name**
2. **Choose whether to use Hardhat** (Yes/No)
3. **Select a template** (Minipay, Valora, etc.)
4. **Provide project owner details**
5. **Wait for project creation to complete**
6. **Follow the on-screen instructions to start your project**

---

## **Install Dependencies**
Once the project is set up, install dependencies:

```bash
yarn
# or
npm install
```

---

## **Deploy a Smart Contract**
For detailed instructions, refer to [`packages/hardhat/README.md`](./packages/hardhat/README.md).

Quick steps:
1. Rename `packages/hardhat/.env.template` to `packages/hardhat/.env` and add your `PRIVATE_KEY`.
2. Ensure your wallet has test funds from the [Celo Faucet](https://faucet.celo.org/alfajores).
3. Deploy the contract:

```bash
npx hardhat ignition deploy ./ignition/modules/Lock.ts --network alfajores
```

---

## **Deploy Your Dapp Locally**
Before starting your project, follow these steps:

1. Rename `.env.template` to `.env` in `packages/react-app/`.
2. Add your WalletConnect Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/).

Start the local server:

```bash
yarn dev
# or
npm run dev
```

---

## **Add UI Components**
To keep Celo Composer lightweight, UI components are not pre-installed. You can easily add components using [ShadCN](https://ui.shadcn.com/). Refer to the [UI Components Guide](./docs/UI_COMPONENTS.md) for details.

---

## **Deploy with Vercel**
Deploying with Vercel is quick and easy. Follow our [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md) for step-by-step instructions.

---

## **Supported Frameworks**
### **React / Next.js**
- Supports web and PWA applications
- Compatible with major crypto wallets  
📖 [Next.js Docs](https://nextjs.org/docs)

### **Hardhat**
- Powerful tool for smart contract development
- Works with various Ethereum dev tools  
📖 [Hardhat Docs](https://hardhat.org/hardhat-runner/docs/getting-started)

---

## **Supported Templates**
### **Minipay**
- Pre-configured for building a mini-payment dApp on Celo  
📖 [Minipay Docs](https://docs.celo.org/developer/build-on-minipay/overview)

### **Valora**
- Designed for easy Valora wallet integration  
📖 [Valora Docs](https://docs.valora.xyz/)

---

## **Support**
Join the Celo community on Discord:  
📌 [Celo Discord](https://chat.celo.org)  
💬 [Repo Support Channel](https://discord.com/channels/600834479145353243/941003424298856448)

---

## **Roadmap**
See the [open issues](https://github.com/celo-org/celo-composer/issues) for upcoming features and bug tracking.

---

## **Contributing**
We welcome community contributions!  
Please refer to our [contribution guidelines](./CONTRIBUTING.md) to get started.

---

## **License**
Distributed under the **MIT License**. See [`LICENSE.txt`](./LICENSE.txt) for details.

---

## **Contact**
- **Twitter:** [@CeloDevs](https://x.com/CeloDevs)
- **Discord:** [Celo Developer Community](https://discord.com/invite/celo)

<p align="right">(<a href="#top">Back to top</a>)</p>