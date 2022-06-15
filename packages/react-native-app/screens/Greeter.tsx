import { useState, useEffect, useContext } from "react";
import { StyleSheet, ActivityIndicator, TextInput } from "react-native";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { Text, View, TouchableOpacity } from "../components/Themed";
import * as WebBrowser from "expo-web-browser";
import Web3 from "web3";
import Colors from "../constants/Colors";
import { ThemeContext } from "../context/ThemeProvider";

const web3 = new Web3("https://alfajores-forno.celo-testnet.org");

export default function Greeter(props) {
	const { styles } = useContext(ThemeContext);
	const { contractData } = props;
	const connector = useWalletConnect();
	const [greeterValue, setGreeterValue] = useState();
	const [greetingInput, setGreetingInput] = useState("");
	const [contractLink, setContractLink] = useState();
	const [settingGreeting, setSettingGreeting] = useState(false);
	const [gettingGreeting, setGettingGreeting] = useState(false);
	const contract = contractData
		? new web3.eth.Contract(contractData.abi, contractData.address)
		: null;

	useEffect(() => {
		if (contractData) {
			setContractLink(
				`https://alfajores-blockscout.celo-testnet.org/address/${contractData.address}`
			);
		}
	}, [contractData]);

	const setGreeting = async () => {
		setSettingGreeting(true);
		try {
			let txData = await contract?.methods
				.setGreeting(greetingInput)
				.encodeABI();

			await connector.sendTransaction({
				from: connector.accounts[0],
				to: contractData.address,
				data: txData,
			});
		} catch (e) {
			console.log(e);
		} finally {
			setSettingGreeting(false);
		}
	};

	const getGreeting = async () => {
		setGettingGreeting(true);
		try {
			const result = (await contract?.methods.greet().call()) as string;
			setGreeterValue(result);
		} catch (e) {
			console.log(e);
		} finally {
			setGettingGreeting(false);
		}
	};

	function handlePress() {
		WebBrowser.openBrowserAsync(contractLink);
	}

	return (
		<View style={styles.container}>
			<View style={styles.innerContainer}>
				<Text style={styles.title}>Greeter Contract</Text>
				{contractData ? (
					<TouchableOpacity
						style={styles.externalLink}
						onPress={handlePress}>
						<Text style={styles.externalLink}>
							{`${contractData.address.substr(
								0,
								5
							)}...${contractData.address.substr(-5)}`}
						</Text>
					</TouchableOpacity>
				) : null}
			</View>
			<View style={styles.separator}></View>
			<View style={styles.innerContainer}>
				<Text>Write Contract</Text>
				<TextInput
					value={greetingInput}
					onChangeText={(newValue) => setGreetingInput(newValue)}
					style={styles.textInput}
				/>
				{settingGreeting ? (
					<ActivityIndicator color={"white"} />
				) : (
					<TouchableOpacity onPress={setGreeting}>
						<Text>Update Greeter Contract</Text>
					</TouchableOpacity>
				)}
			</View>
			<View style={styles.separator}></View>
			<View style={styles.innerContainer}>
				<Text>Read Contract</Text>
				{greeterValue ? (
					<Text style={{ marginVertical: 10 }}>
						Greeter Contract Value: {greeterValue}
					</Text>
				) : null}
				{gettingGreeting ? (
					<ActivityIndicator color={"white"} />
				) : (
					<TouchableOpacity onPress={getGreeting}>
						<Text>Read Greeter Contract</Text>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		alignItems: "center",
// 		justifyContent: "center",
// 		padding: 20,
// 	},
// 	innerContainer: {
// 		width: "100%",
// 		alignItems: "center",
// 	},
// 	title: {
// 		fontSize: 20,
// 		fontWeight: "bold",
// 		// color: Colors[colorScheme].text,
// 	},
// 	separator: {
// 		marginVertical: 20,
// 		height: 1,
// 		width: "85%",
// 		backgroundColor: "#ffffff44",
// 	},
// 	externalLink: {
// 		color: "white",
// 		textDecorationStyle: "solid",
// 		textDecorationColor: "white",
// 		textDecorationLine: "underline",
// 	},
// });
