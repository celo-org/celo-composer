import {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import {useWalletConnect} from '@walletconnect/react-native-dapp';
import {Text, View, TouchableOpacity} from '../components/Themed';
import Web3 from 'web3';
import Colors from '../constants/Colors';
import {ThemeContext} from '../context/ThemeProvider';
import React from 'react';

const web3 = new Web3('https://alfajores-forno.celo-testnet.org');

export default function Account() {
  const connector = useWalletConnect();
  const {styles} = useContext(ThemeContext);
  const [accountLink, setAccountLink] = useState<string>('');
  useEffect(() => {
    setAccountLink(
      `https://alfajores-blockscout.celo-testnet.org/address/${connector.accounts[0]}`,
    );
  }, [connector]);

  async function handlePress() {
    const supported = await Linking.canOpenURL(accountLink);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(accountLink);
    } else {
      Alert.alert(`Don't know how to open this URL: ${accountLink}`);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Account Info</Text>
        <TouchableOpacity style={styles.externalLink} onPress={handlePress}>
          <Text style={styles.externalLink}>
            {`${connector.accounts[0].substr(
              0,
              5,
            )}...${connector.accounts[0].substr(-5)}`}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator}></View>
      <TouchableOpacity onPress={() => connector.killSession()}>
        <Text>Disconnect Wallet</Text>
      </TouchableOpacity>
    </View>
  );
}
