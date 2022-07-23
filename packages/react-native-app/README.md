# Celo Composer React Native App

A starter pack to get started with building dapps on Celo.

[Demo Video](https://www.youtube.com/watch?v=iqXBkLkxZoU)

### Requirements

---

-   Expo
-   Yarn
-   NodeJS

### Using the React Native App

---

-   cd into this folder "react-native-app" through your terminal.

`yarn install`

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

### Resources

-   [WalletConnect](https://docs.walletconnect.com/quick-start/dapps/react-native)
-   [Expo](https://docs.expo.dev/)
-   [React Navigation](https://reactnavigation.org/docs/getting-started/)
-   [Hardhat](https://hardhat.org/getting-started/)
