import "@celo-tools/use-contractkit/lib/styles.css";
import "../styles/globals.css";
import Head from "next/head";

import {
  Alfajores,
  Mainnet,
  ContractKitProvider,
} from "@celo-tools/use-contractkit";
import { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps, router }: AppProps): React.ReactElement {
  return (
    <>
      <Head>
        <title>Celo DApp Starter</title>
        <meta name="description" content="Celo DApp Starter" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <ContractKitProvider
        dapp={{
          name: "use-contractkit demo",
          description: "A demo DApp to showcase functionality",
          url: "https://use-contractkit.vercel.app",
          icon: "https://use-contractkit.vercel.app/favicon.ico",
        }}
      >
        <Toaster
          position="top-right"
          toastOptions={{
            className: "w-72 md:w-96",
            style: {
              padding: "0px",
            },
          }}
        />
        <div suppressHydrationWarning>
          {typeof window === "undefined" ? null : <Component {...pageProps} />}
        </div>
      </ContractKitProvider>
    </>
  );
}

export default MyApp;
