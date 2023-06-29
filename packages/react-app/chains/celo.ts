import { Chain } from "@rainbow-me/rainbowkit";
import { celo } from "@wagmi/chains";
const Celo: Chain = {
    ...celo,
    iconUrl: "https://rainbowkit-with-celo.vercel.app/icons/celo.svg",
    iconBackground: "#fff",
};

export default Celo;
