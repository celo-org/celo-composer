export type Currency = {
    decimals: number
    name: string
    symbol: string
}
  
export type BlockExplorer = {
    name: string
    url: string
}
  
export type Network = {
    id: number
    name: string,
    network: string,
    iconUrl: string,
    iconBackground: string,
    nativeCurrency: Currency
    rpcUrls: {
        default: string,
    },
    blockExplorers: {
      default: BlockExplorer,
      etherscan: BlockExplorer,
    },
    testnet: boolean,
}