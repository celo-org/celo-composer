import "../styles/globals.css";
import { Provider, Connector } from "wagmi";
import { providers } from "ethers";
import { Celo, Alfajores, Localhost } from "../utils/constants.ts";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import Head from "next/head";
import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";

// Define the Connectors for the DApp
const connectors = [
  new InjectedConnector({ chains: [Celo, Alfajores, Localhost] }),
  new WalletConnectConnector({
    chains: [Celo, Alfajores],
    options: {
      qrcode: true,
      rpc: {
        // There is a bug where on the first connection the provider URL defaults to network id 1 (ETH mainnet).
        // Set the RPC endpoint of your default network of choice as the #1
        // 1: "https://alfajores-forno.celo-testnet.org",
        44787: "https://alfajores-forno.celo-testnet.org", // Alfajores testnet
        42220: "https://forno.celo.org", // Celo mainnet
      },
    },
  }),
];

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Celo DApp Starter</title>
        <meta name="description" content="Celo DApp Starter" />
      </Head>
      <Provider connectors={connectors}>
        <ApolloProvider client={client}>
          <div suppressHydrationWarning>
            {typeof window === "undefined" ? null : (
              <Component {...pageProps} />
            )}
          </div>
        </ApolloProvider>
      </Provider>
    </>
  );
}

export default MyApp;
