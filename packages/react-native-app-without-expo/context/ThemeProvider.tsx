import React from 'react';
import {StyleSheet} from 'react-native';
import Colors from '../constants/Colors';

export const ThemeContext = React.createContext<any>(null);

interface ThemeProviderProps {
  children: any;
}

export const ThemeProvider = ({children}: ThemeProviderProps) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: Colors.brand.light.background,
    },
    innerContainer: {
      width: '100%',
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: '500',
      color: Colors['brand'].light.text,
    },
    separator: {
      marginVertical: 20,
      height: 1,
      width: '85%',
      backgroundColor: '#ffffff',
    },
    externalLink: {
      color: Colors['brand'].light.text,
      textDecorationStyle: 'solid',
      textDecorationColor: 'white',
      textDecorationLine: 'underline',
      backgroundColor: 'transparent',
      fontSize: 12,
    },
    textInput: {
      borderColor: Colors['brand'].light.text,
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 10,
      color: Colors['brand'].light.text,
      marginVertical: 10,
      borderWidth: 1,
      alignSelf: 'stretch',
    },
    text: {
      fontSize: 12,
    },
    h1: {
      color: Colors['brand'].light.text,
      fontSize: 48,
    },
    h2: {
      color: Colors['brand'].light.text,
      fontSize: 40,
    },
    h3: {
      color: Colors['brand'].light.text,
      fontSize: 32,
    },
    h4: {
      color: Colors['brand'].light.text,
      fontSize: 24,
      fontWeight: '400',
    },
    h5: {
      color: Colors['brand'].light.text,
      fontSize: 16,
    },
    h6: {
      color: Colors['brand'].light.text,
      fontSize: 14,
    },
  });

  return (
    <ThemeContext.Provider value={{styles}}>{children}</ThemeContext.Provider>
  );
};
