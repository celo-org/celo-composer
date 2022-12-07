import React from "react";
import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";

export const ThemeContext = React.createContext<any>(null);

interface ThemeProviderProps {
    children: any;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
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
            color: Colors["brand"].light.text,
        },
        separator: {
            marginVertical: 20,
            height: 1,
            width: "85%",
            backgroundColor: "#ffffff44",
        },
        externalLink: {
            color: Colors["brand"].light.text,
            textDecorationStyle: "solid",
            textDecorationColor: "white",
            textDecorationLine: "underline",
            backgroundColor: "transparent",
        },
        textInput: {
            borderColor: Colors["brand"].light.text,
            borderRadius: 5,
            paddingVertical: 10,
            paddingHorizontal: 10,
            color: Colors["brand"].light.text,
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
