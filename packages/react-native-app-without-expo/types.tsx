/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */
import type {ethers} from 'ethers';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
  Login: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  Docs: undefined;
  Login: undefined;
  Account: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export interface FormattedRpcResponse {
  method: string;
  address: string;
  valid: boolean;
  result: string;
  error?: string;
}

export interface FormattedRpcError {
  method: string;
  error?: string;
}

export interface AccountAction {
  method: string;
  callback: (web3Provider?: ethers.providers.Web3Provider) => Promise<any>;
}

export interface RpcRequestParams {
  method: string;
  web3Provider: ethers.providers.Web3Provider;
}
