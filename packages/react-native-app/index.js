import "./global";
import App from "./App";
import { registerRootComponent, scheme } from "expo";
const {
	default: AsyncStorage,
} = require("@react-native-async-storage/async-storage");
const { withWalletConnect } = require("@walletconnect/react-native-dapp");

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(
	withWalletConnect(App, {
		clientMeta: {
			name: "Celo Composer React Native",
			description: "React Native Starter Project to build on Celo",
		},
		redirectUrl:
			Platform.OS === "web" ? window.location.origin : `${scheme}://`,
		storageOptions: {
			asyncStorage: AsyncStorage,
		},
	})
);
