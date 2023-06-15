import { useState, useEffect, useContext } from "react";
import { Text, View } from "../components/Themed";
import Button from "../components/Button";
import * as WebBrowser from "expo-web-browser";
import { ThemeContext } from "../context/ThemeProvider";
import AccountAddress from "../components/AccountAddress";
import AccountBalance from "../components/AccountBalance";
import Colors from "../constants/Colors";
import { useWeb3Modal } from "@web3modal/react-native";
import { BlockchainActions } from "../components/BlockchainActions";

export default function Account() {
    const { address, provider } = useWeb3Modal();
    const { styles } = useContext(ThemeContext);
    const [accountLink, setAccountLink] = useState();
    useEffect(() => {
        setAccountLink(`https://celoscan.io/address/${address}`);
    }, [address]);

    function handlePress() {
        WebBrowser.openBrowserAsync(accountLink);
    }

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Connected As:</Text>
                <Button style={styles.externalLink} onPress={handlePress}>
                    <AccountAddress />
                    <AccountBalance />
                </Button>
                <BlockchainActions />
            </View>
            <Button onPress={() => provider?.disconnect()}>
                <Text style={{ color: Colors.brand.snow }}>
                    Disconnect Wallet
                </Text>
            </Button>
        </View>
    );
}
