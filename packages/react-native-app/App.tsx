import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import { LogBox } from "react-native";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { ThemeProvider } from "./context/ThemeProvider";
import { Web3Modal } from "@web3modal/react-native";
import { providerMetadata, sessionParams } from "./constants/Config";

// @ts-expect-error - `@env` is a virtualised module via Babel config.
import { ENV_PROJECT_ID } from "@env";

export default function App() {
    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();

    // avoid warnings showing up in app. comment below code if you want to see warnings.
    useEffect(() => {
        LogBox.ignoreAllLogs();
    }, []);

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <ThemeProvider>
                <SafeAreaProvider>
                    <Navigation colorScheme={colorScheme} />
                    <StatusBar />
                    <Web3Modal
                        projectId={ENV_PROJECT_ID}
                        providerMetadata={providerMetadata}
                        sessionParams={sessionParams}
                    />
                </SafeAreaProvider>
            </ThemeProvider>
        );
    }
}
