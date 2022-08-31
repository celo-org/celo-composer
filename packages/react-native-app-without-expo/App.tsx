import React from 'react';
import {Platform, StatusBar, StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useEffect} from 'react';
import {LogBox} from 'react-native';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import {ThemeProvider} from './context/ThemeProvider';
import WalletConnectProvider from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const colorScheme = useColorScheme();

  // avoid warnings showing up in app. comment below code if you want to see warnings.
  useEffect(() => {
    LogBox.ignoreAllLogs();
  }, []);

  return (
    <WalletConnectProvider
      bridge="https://bridge.walletconnect.org"
      clientMeta={{
        name: 'Celo Composer React Native without expo',
        description: 'React Native Starter Project to build on Celo',
        url: 'https://celo.org',
        icons: ['https://walletconnect.org/walletconnect-logo.png'],
      }}
      redirectUrl={
        Platform.OS === 'web'
          ? window.location.origin
          : `rnWithoutExpoCeloComposer://`
      }
      storageOptions={{
        asyncStorage: AsyncStorage,
      }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar
            barStyle={colorScheme == 'dark' ? 'light-content' : 'dark-content'}
          />
        </SafeAreaProvider>
      </ThemeProvider>
    </WalletConnectProvider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
