import { SafeAreaView } from "react-native-safe-area-context";
import Container from "../components/Container";
import { H1, H2, H3, H4, H5, H6 } from "../components/Headings";
import MonoText from "../components/MonoText";
import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";

const Docs = () => {
    return (
        <SafeAreaView>
            <View
                style={{
                    height: "100%",
                    padding: 10,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        margin: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                    }}
                >
                    <H4
                        additionalStyles={{
                            marginBottom: 10,
                            fontFamily: "Inter-Medium",
                        }}
                    >
                        Celo Composer
                    </H4>
                    <Text style={{ textAlign: "center", marginBottom: 15 }}>
                        Celo Composer is built to give you headstart on your
                        next Web3 Mobile project on Celo
                    </Text>
                    <Text style={{ textAlign: "center", marginBottom: 10 }}>
                        {
                            "Celo Composer has the following components built-in ConnectWallet, AccountAddress, and AccountBalance to get you to speed!"
                        }
                    </Text>
                    <Text style={{ textAlign: "center", fontStyle: "italic" }}>
                        {
                            "All respective files can be found in /components folder"
                        }
                    </Text>
                    <Container style={{ marginTop: 15 }}>
                        <MonoText
                            additionalStyles={{
                                textAlign: "center",
                                color: Colors.brand.brown,
                                fontSize: 13,
                            }}
                        >
                            {
                                "Delete this screen by removing Docs.tsx in /screens folder"
                            }
                        </MonoText>
                    </Container>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Docs;
