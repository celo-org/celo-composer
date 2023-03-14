<!-- TITLE -->

<p align="center"> 
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

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Celo Composer allows you to quickly build, deploy, and iterate on decentralized applications using Celo. It provides a number of frameworks, examples, and Celo specific functionality to help you get started with your next dApp.

<p align="right">(<a href="#top">back to top</a>)</p>

## Built With

Celo Composer is built on Celo to make it simple to build dApps using a variety of front-end frameworks.

- [Celo](https://celo.org/)
- [Solidity](https://docs.soliditylang.org/en/v0.8.15/)
- [Next.js](https://nextjs.org/)
- [React.js](https://reactjs.org/)
- [Material UI](https://mui.com/)
- [React Native](https://reactnative.dev/)
- [Flutter](https://docs.flutter.dev/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To build your dApp, you'll need to install the dependencies, create a new project, and run the following commands:

## Prerequisites

- Node
- Git (v2.38 or higher)

## How to use Celo Composer

The easiest way to get started with Celo Composer is using `@celo/celo-composer`. This is a CLI tool enables you to quickly start building dApps on Celo for multiple frameworks including React, React Native (w/o Expo), Flutter and Angular. You can create the dApp using default Composer templates provided by Celo. To get started, use the following command:

```bash
npx @celo/celo-composer create
```

#### This will prompt you to select the framework and the template you want to use

![Celo Composer select framework](https://github.com/celo-org/celo-composer/blob/main/images/readme/celo-composer-create.png?raw=true)

#### Once you select the framework and the template, it will ask you to select the smart contract development environment tool

![Celo Composer tool selection](https://github.com/celo-org/celo-composer/blob/main/images/readme/celo-composer-tool.png?raw=true)

#### After selecting the tool, it will ask you whether you want subgraph support for your dApp

![Celo Composer subgraph support](https://github.com/celo-org/celo-composer/blob/main/images/readme/celo-composer-subgraph.png?raw=true)

#### Finally, it will ask you for the name of your dApp

![Celo Composer dApp name](https://github.com/celo-org/celo-composer/blob/main/images/readme/celo-composer-project-name.png?raw=true)

**_🔥Voila, you have your dApp ready to go. You can now start building your dApp on Celo._**

## Supported Frameworks

### <u>React</u>

- Creating examples and experiment with React for your libraries and components.
- Install dependencies with `yarn` or `npm i`.
- Start the dApp with `yarn react-app:dev`/`npm run react-app:dev` and you are good to go.
- Support for Website and Progressive Web Application.
- Works with all major crypto wallets.

Check here to learn more about [Celo Composer - React](https://github.com/celo-org/celo-composer/blob/main/packages/react-app/README.md)

### <u>React Native</u>

- You don't need to configure anything. A reasonably good configuration of both development and production builds is handled for you so you can focus on writing code.
- Support for Android and IOS.
- Works with [Expo](https://expo.dev/) and without Expo.
- Working example app - The included example app shows how this all works together.
- Easy to use and always updated with latest dependencies.

Check here to learn more about [Celo Composer - React Native](https://github.com/celo-org/celo-composer/blob/main/packages/react-native-app/README.md)

### <u>Flutter</u>

- One command to get started - Type `flutter run` to start development in your mobile phone.
- Works with all major mobile crypto wallets.
- Support for Android, IOS (Web, Windows, and Linux coming soon).
- Working example app - The included example app shows how this all works together.
- Easy to use and always updated with latest dependencies.

Check here to learn more about [Celo Composer - Flutter](https://github.com/celo-org/celo-composer/blob/main/packages/flutter-app/README.md)

### <u>Angular</u>

- Creating examples and experiment with Angular for your libraries and components.
- Easy to setup and use.

Check here to learn more about [Celo Composer - Angular](https://github.com/celo-org/celo-composer/blob/main/packages/angular-app/README.md)

<!-- USAGE EXAMPLES -->

## 🔭 Learning Solidity

📕 Read the docs: <https://docs.soliditylang.org>

- [Primitive Data Types](https://solidity-by-example.org/primitives/)
- [Mappings](https://solidity-by-example.org/mapping/)
- [Structs](https://solidity-by-example.org/structs/)
- [Modifiers](https://solidity-by-example.org/function-modifier/)
- [Events](https://solidity-by-example.org/events/)
- [Inheritance](https://solidity-by-example.org/inheritance/)
- [Payable](https://solidity-by-example.org/payable/)
- [Fallback](https://solidity-by-example.org/fallback/)

📧 Learn the [Solidity globals and units](https://solidity.readthedocs.io/en/v0.6.6/units-and-global-variables.html)

## Support

Join the Celo Discord server at <https://chat.celo.org>. Reach out on the dedicated repo channel [here](https://discord.com/channels/600834479145353243/941003424298856448).

<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/celo-org/celo-composer/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

As a contributor, you can add your own dApp to this repository and include it as a tab for others to access. Follow the steps below and reference existing files for additional details to help you get started.

If you decide to try this out and find something confusing, consider opening an pull request to make things more clear for the next developer that comes through. If you improve the user interface or create new components that you think might be useful for other developers, consider opening a PR.

We will happily compensate you for contributions. Anywhere between 5 and 50 cUSD (or more) depending on the work. This is dependent on the work that is done and is ultimately up to the discretion of the Celo Foundation developer relations team.

You can view the associated bounty on Gitcoin [here](https://gitcoin.co/issue/celo-org/celo-progressive-dapp-starter/17/100028587).

<p align="right">(<a href="#top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- CONTACT -->
## Contact

- [@CeloDevs](https://twitter.com/CeloDevs)
- [Discord](https://discord.com/invite/6yWMkgM)

<p align="right">(<a href="#top">back to top</a>)</p>
