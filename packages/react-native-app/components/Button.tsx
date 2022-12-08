import { TouchableOpacity } from "react-native";
import { useThemeColor } from "./Themed";

type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
};

export type TouchableOpacityProps = ThemeProps & TouchableOpacity["props"];

export function Button(props: TouchableOpacityProps) {
    const { style, lightColor, darkColor, children, ...otherProps } = props;
    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        500
    );
    return (
        <TouchableOpacity
            style={[
                { backgroundColor },
                style,
                {
                    paddingHorizontal: 15,
                    paddingVertical: 7,
                    marginTop: 10,
                    borderRadius: 50,
                },
            ]}
            {...otherProps}
        >
            {children}
        </TouchableOpacity>
    );
}
