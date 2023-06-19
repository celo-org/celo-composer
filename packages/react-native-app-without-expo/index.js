/**
 * @format
 */

import './global';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import '@walletconnect/react-native-compat';
console.log(appName);
AppRegistry.registerComponent(appName, () => App);
