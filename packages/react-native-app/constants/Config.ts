export const providerMetadata = {
    name: "Celo Composer",
    description: "Celo Composer build on Celo",
    url: "https://celo.org/",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const sessionParams = {
    namespaces: {
        eip155: {
            methods: [
                "eth_sendTransaction",
                "eth_signTransaction",
                "eth_sign",
                "personal_sign",
                "eth_signTypedData",
            ],
            chains: ["eip155:1"],
            events: ["chainChanged", "accountsChanged"],
            rpcMap: {},
        },
    },
};
