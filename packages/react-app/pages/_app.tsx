import type { AppProps } from "next/app";
import {
    RainbowKitProvider,
    getDefaultWallets,
    connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import Layout from "../components/Layout";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { publicProvider } from "wagmi/providers/public";

import { Alfajores, Celo } from "@/chains";
const projectId = process.env.WC_PROJECT_ID as string; // get one at https://cloud.walletconnect.com/app

const { chains, publicClient } = configureChains(
    [Celo, Alfajores],
    [publicProvider()]
);

const { wallets } = getDefaultWallets({
    appName: "RainbowKit demo",
    projectId,
    chains,
});

const appInfo = {
    appName: "Celo Composer",
};

const connectors = connectorsForWallets([...wallets]);

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient: publicClient,
});

function App({ Component, pageProps }: AppProps) {
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider
                chains={chains}
                appInfo={appInfo}
                coolMode={true}
            >
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </RainbowKitProvider>
        </WagmiConfig>
    );
}

export default App;
