import {useState, useEffect, useContext} from 'react';
import {Linking, Alert} from 'react-native';
import {Text, View} from '../components/Themed';
import {ThemeContext} from '../context/ThemeProvider';
import {useWeb3Modal} from '@web3modal/react-native';
import Button from '../components/Button';
import AccountAddress from '../components/AccountAddress';
import AccountBalance from '../components/AccountBalance';
import Colors from '../constants/Colors';
import {BlockchainActions} from '../components/BlockchainActions';

export default function Account() {
  const {address, provider} = useWeb3Modal();
  const {styles} = useContext(ThemeContext);
  const [accountLink, setAccountLink] = useState<string>('');
  useEffect(() => {
    setAccountLink(`https://celoscan.io/address/${address}`);
  }, [address]);

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
        <Button style={styles.externalLink} onPress={handlePress}>
          <AccountAddress />
          <AccountBalance />
        </Button>
        <BlockchainActions />
      </View>
      <Button onPress={() => provider?.disconnect()}>
        <Text style={{color: Colors.brand.snow}}>Disconnect Wallet</Text>
      </Button>
    </View>
  );
}
