import React from "react";
import useColorScheme from "../hooks/useColorScheme";
import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";

export const ThemeContext = React.createContext<any>(null);

export const ThemeProvider = ({ children }) => {
	const colorScheme = useColorScheme();

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			alignItems: "center",
			justifyContent: "center",
			padding: 20,
		},
		innerContainer: {
			width: "100%",
			alignItems: "center",
		},
		title: {
			fontSize: 20,
			fontWeight: "bold",
			color: Colors[colorScheme].text,
		},
		separator: {
			marginVertical: 20,
			height: 1,
			width: "85%",
			backgroundColor: "#ffffff44",
		},
		externalLink: {
			color: Colors[colorScheme].text,
			textDecorationStyle: "solid",
			textDecorationColor: "white",
			textDecorationLine: "underline",
			backgroundColor: "transparent",
		},
		textInput: {
			borderColor: Colors[colorScheme].text,
			borderRadius: 5,
			paddingVertical: 10,
			paddingHorizontal: 10,
			color: Colors[colorScheme].text,
			marginVertical: 10,
			borderWidth: 1,
			alignSelf: "stretch",
		},
	});

	return (
		<ThemeContext.Provider value={{ styles }}>
			{children}
		</ThemeContext.Provider>
	);
};
