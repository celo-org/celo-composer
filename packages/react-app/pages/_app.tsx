import React from "react";
import "@celo-tools/use-contractkit/lib/styles.css";
import Head from "next/head";
import { SnackbarProvider } from "notistack";
import { ApolloProvider } from "@apollo/client";
import client from "@/apollo-client";
import { Alfajores, ContractKitProvider } from "@celo-tools/use-contractkit";
import { AppProps } from "next/app";
import { CustomThemeProvider } from "@/contexts/userTheme";

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <CustomThemeProvider>
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
            </div>
          </ApolloProvider>
        </SnackbarProvider>
      </ContractKitProvider>
    </CustomThemeProvider>
  );
}

export default MyApp;
