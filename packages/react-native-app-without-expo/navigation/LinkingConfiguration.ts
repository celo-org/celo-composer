/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import {LinkingOptions} from '@react-navigation/native';
import {Linking} from 'react-native';

import {RootStackParamList} from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['rnWithoutExpoCeloComposer://'],
  config: {
    screens: {
      Root: {
        screens: {
          Greeter: {
            screens: {
              Greeter: 'greeter',
            },
          },
          Storage: {
            screens: {
              Storage: 'storage',
            },
          },
          Account: {
            screens: {
              Account: 'account',
            },
          },
        },
      },
      Modal: 'modal',
      NotFound: '*',
    },
  },
};

export default linking;
