import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import { Text } from "./Themed";

const AccountAddress = () => {
    const connector = useWalletConnect();
    const { styles } = useContext(ThemeContext);

    return <Text style={styles.externalLink}>{connector.accounts[0]}</Text>;
};

export default AccountAddress;
