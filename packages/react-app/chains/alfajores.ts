import { Chain } from "@rainbow-me/rainbowkit";
import { celoAlfajores } from "@wagmi/chains";
const Alfajores: Chain = {
    ...celoAlfajores,
    iconUrl: "https://rainbowkit-with-celo.vercel.app/icons/alfajores.svg",
    iconBackground: "#fff",
};

export default Alfajores;
