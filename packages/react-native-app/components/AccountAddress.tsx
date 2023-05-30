import { useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import { Text } from "./Themed";
import { useWeb3Modal } from "@web3modal/react-native";

const AccountAddress = () => {
    const { styles } = useContext(ThemeContext);
    const { address } = useWeb3Modal();

    return <Text style={styles.externalLink}>{address}</Text>;
};

export default AccountAddress;
