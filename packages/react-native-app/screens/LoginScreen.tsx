import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "../types";
import { Text, View } from "../components/Themed";
import ConnectWallet from "../components/ConnectWallet";
import Button from "../components/Button";

export default function LoginScreen({
    navigation,
}: RootStackScreenProps<"Root">) {
    const connector = useWalletConnect();
    return (
        <View style={styles.container}>
            <ConnectWallet />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
});
