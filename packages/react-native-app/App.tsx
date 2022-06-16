import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import { LogBox } from "react-native";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { ThemeProvider } from "./context/ThemeProvider";

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
				</SafeAreaProvider>
			</ThemeProvider>
		);
	}
}
