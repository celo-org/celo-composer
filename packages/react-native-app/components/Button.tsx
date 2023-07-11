import { TouchableOpacity } from "react-native";

type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
};

export type TouchableOpacityProps = ThemeProps & TouchableOpacity["props"];

export default function Button(props: TouchableOpacityProps) {
    const { style, lightColor, darkColor, children, ...otherProps } = props;

    return (
        <TouchableOpacity
            style={[
                { backgroundColor: "black" },
                style,
                {
                    paddingHorizontal: 15,
                    paddingVertical: 7,
                    marginTop: 10,
                    borderRadius: 5,
                },
            ]}
            {...otherProps}
        >
            {children}
        </TouchableOpacity>
    );
}
