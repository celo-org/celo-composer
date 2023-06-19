// @ts-expect-error - `@env` is a virtualised module via Babel config.
import {ENV_PROJECT_ID} from '@env';

import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useEffect} from 'react';
import {LogBox} from 'react-native';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import {ThemeProvider} from './context/ThemeProvider';
import {Web3Modal} from '@web3modal/react-native';
import {providerMetadata, sessionParams} from './constants/Config';

console.log(ENV_PROJECT_ID);

const App = () => {
  const colorScheme = useColorScheme();

  // avoid warnings showing up in app. comment below code if you want to see warnings.
  useEffect(() => {
    LogBox.ignoreAllLogs();
  }, []);

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar
          barStyle={colorScheme == 'dark' ? 'light-content' : 'dark-content'}
        />
        <Web3Modal
          projectId={ENV_PROJECT_ID}
          providerMetadata={providerMetadata}
          sessionParams={sessionParams}
        />
      </SafeAreaProvider>
    </ThemeProvider>
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
