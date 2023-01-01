import { Dimensions } from "react-native";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const SPACING = 10;

export default {
    window: {
        WIDTH,
        HEIGHT,
    },
    isSmallDevice: WIDTH < 375,
    SPACING,
};
