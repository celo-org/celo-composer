export const NETWORKS = {
  localhost: {
    name: "localhost",
    color: "#666666",
    chainId: 1337,
    blockExplorer: "",
    rpcUrl:
      "http://" +
      (global.window ? window.location.hostname : "localhost") +
      ":8545",
  },
  alfajores: {
    name: "alfajores",
    color: "#ff0000",
    chainId: 44787,
    rpcUrl: "https://alfajores-forno.celo-testnet.org",
    blockExplorer: "https://alfajores-blockscout.celo-testnet.org/",
  },
  celo: {
    name: "celo",
    color: "#00ff00",
    chainId: 42220,
    rpcUrl: "https://forno.celo.org",
    blockExplorer: "https://explorer.celo.org/",
  },
  accounts: [
    // list of private keys
    "0xf2f48ee19680706196e2e339e5da3491186e0c4c5030670656b0e0164837257d"
  ]
};
