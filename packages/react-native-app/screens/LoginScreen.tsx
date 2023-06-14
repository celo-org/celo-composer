import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "../types";
import { View } from "../components/Themed";
import { Web3Button } from "@web3modal/react-native";

export default function LoginScreen({
    navigation,
}: RootStackScreenProps<"Root">) {
    return (
        <View style={styles.container}>
            <Web3Button />
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
