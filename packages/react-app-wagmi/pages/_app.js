import "../styles/globals.css";
import { Provider, Connector } from "wagmi";
import { Celo, Alfajores, Localhost } from "../utils/constants.ts";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import Head from "next/head";

const connectors = [
  new InjectedConnector({ chains: [Celo, Alfajores, Localhost] }),
  new WalletConnectConnector({
    chains: [Celo, Alfajores, Localhost],
    options: {
      qrcode: true,
      rpc: {
        1: "https://mainnet.infura.io/v3/feb93462d08c4db093c63c120aebcb55",
        44787: "https://alfajores-forno.celo-testnet.org",
        42220: "https://forno.celo.org",
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
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
