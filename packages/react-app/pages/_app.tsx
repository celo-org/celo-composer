import React from 'react';
import "@celo-tools/use-contractkit/lib/styles.css";
import Head from "next/head";
import { SnackbarProvider } from "notistack";
import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";
import { Link } from "@mui/material";

import Discord from '../public/Discord'
import Github from '../public/Github'

import {
  Alfajores,
  Mainnet,
  ContractKitProvider,
} from "@celo-tools/use-contractkit";
import { AppProps } from "next/app";

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
        network={Alfajores}
        // networks={[Mainnet, Alfajores]}
      >
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <ApolloProvider client={client}>
            <div suppressHydrationWarning>
              {typeof window === "undefined" ? null : (
                <Component {...pageProps} />
              )}
              <footer style={{ textAlign: "center" }}>
                <Link
                  href="https://github.com/celo-org/celo-progressive-dapp-starter"
                  target="_blank"
                >
                  <Github style={{width: "40px", margin: "5px"}}/>
                </Link>
                <Link
                  href="https://discord.gg/cGCE9p9352"
                  target="_blank"
                >
                  <Discord style={{width: "40px", margin: "5px"}}/>
                </Link>
              </footer>
            </div>
          </ApolloProvider>
        </SnackbarProvider>
      </ContractKitProvider>
    </>
  );
}

export default MyApp;
