type Chain = {
    id: number
    name: string
    nativeCurrency?: {
      decimals: 18
      name: string
      symbol: string
    }
    rpcUrls: string[]
    blockExplorers?: { name: string; url: string }[]
    testnet?: boolean
  }

export const Celo: Chain = {
    id: 42220,
    name: 'Celo',
    nativeCurrency: {
        decimals: 18,
        name: 'Celo',
        symbol: 'CELO'
    },
    rpcUrls: [
        'https://forno.celo.org',
    ],
    blockExplorers: [{
        name: 'Celo explorer',
        url: 'https://explorer.celo.org/'
    }],
    testnet: false
}

export const Alfajores: Chain = {
    id: 44787,
    name: 'Alfajores',
    nativeCurrency: {
        decimals: 18,
        name: 'Celo',
        symbol: 'CELO'
    },
    rpcUrls: [
        'https://alfajores-forno.celo-testnet.org',
    ],
    blockExplorers: [{
        name: 'Alfajores explorer',
        url: 'https://alfajores-blockscout.celo-testnet.org/'
    }],
    testnet: true
}

export const Localhost: Chain = {
    id: 1337,
    name: 'localhost',
    nativeCurrency: {
        decimals: 18,
        name: 'TETH',
        symbol: 'TETH'
    },
    rpcUrls: [
        "http://localhost:8545"
    ],
    testnet: true
}