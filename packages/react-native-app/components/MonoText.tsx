import { TextStyle } from "react-native";
import { Text, TextProps } from "./Themed";

interface MonoTextProps {
    children: string;
    additionalStyles: TextStyle;
}

export default function MonoText({
    children,
    additionalStyles,
}: MonoTextProps) {
    return (
        <Text style={{ ...{ fontFamily: "space-mono" }, ...additionalStyles }}>
            {children}
        </Text>
    );
}
