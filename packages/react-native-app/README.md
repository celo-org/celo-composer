<div id="top"></div>
<h1 align="center">React Native Celo Composer</h1>

<p float="right" align="middle">
<img width="170" height="150" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/539px-React-icon.svg.png" />
<img width="150" height="150" src="https://cryptologos.cc/logos/celo-celo-logo.png" />
</p>

<h4 align="center">A starter pack to get started with building dapps on Celo.</h4>

<p align="middle">
<a href="https://www.youtube.com/watch?v=iqXBkLkxZoU">Demo Video</a>
.
<a href="https://github.com/celo-org/celo-composer/issues">Report Bug</a>
·
<a href="https://github.com/celo-org/celo-composer/issues">Request Feature</a>
</p>

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
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

A mobile dapp starter template to help you get started building DApps on Celo blockchain.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

-   [React Native](https://reactnative.dev/)
-   [Celo](https://docs.celo.org/)
-   [WalletConnect](https://docs.walletconnect.com/quick-start/dapps/react-native)
-   [React Navigation](https://reactnavigation.org/docs/getting-started/)
-   [Expo](https://docs.expo.dev/)
-   [Hardhat](https://hardhat.org/getting-started/)
-   [Web3JS](https://web3js.readthedocs.io/en/v1.7.3/)

=======

# Celo Composer React Native App

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Expo
- Nodejs (14.x or higher)
- yarn

    ```sh
    npm install --global yarn
    ```

### Installation

1. Clone the repo

    ```sh
    git clone https://github.com/celo-org/celo-composer.git
    ```

2. Install NPM packages

    ```sh
    yarn
    ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

### Using the React Native App

---

-   `cd` into this folder `react-native-app` through your terminal.

```sh
yarn install
```

> Note: For Android 11 and above the following changes need to be done in order to support deeplinking.

-   navigate to `node_modules/@walletconnect/react-native-dapp/dist/providers/WalletConnectProvider.js`

-   comment the code snippet as below:

    ```
    if (Platform.OS === 'android') {

                const canOpenURL = await Linking.canOpenURL(uri);

                // if (!canOpenURL) {

                // Linking.openURL('https://walletconnect.org/wallets');

                //     throw new Error('No wallets found.');

                // }

    await Linking.openURL(uri);
    }
    ```

> The same hasn't been tested for iOS. If you are redirected to `https://walletconnect.org/wallets` on connect wallet then deeplinking is not supported.

-   Run the application using `yarn start`.
<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

## Contact

[Celo Discord](https://discord.com/invite/6yWMkgM)

Harpalsinh Jadeja - [@harpaljadeja11](https://twitter.com/harpaljadeja11) - jadejaharpal14@gmail.com

<p align="right">(<a href="#top">back to top</a>)</p>

## Acknowledgments

List of resources I find helpful and would like to give credit to.

-   [Celo Docs](https://docs.celo.org/)
-   [WalletConnect docs](https://docs.walletconnect.com/quick-start/dapps/react-native)
-   [React Native](https://reactnative.dev/docs/components-and-apis)
-   [React Navigation](https://reactnavigation.org/docs/getting-started/)
-   [Expo](https://docs.expo.dev/)
-   [Hardhat](https://hardhat.org/getting-started/)
-   [Web3](https://web3js.readthedocs.io/en/v1.7.3/)

<p align="right">(<a href="#top">back to top</a>)</p>
