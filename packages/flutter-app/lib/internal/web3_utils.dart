/// Get block time by [chainId]
/// Returned time is in milliseconds (ms)
int getBlockTime(int chainId) {
  // TODO: specify more blocktime based from chains
  switch (chainId) {
    default:
      // for ethereum and related networks, default blocktime is 12 seconds
      return 12000;
  }
}

/// Get network name by [chainId]
String getNetworkName(int chainId) {
  // TODO: you can specify more chains
  switch (chainId) {
    case 1:
      return 'Ethereum Mainnet';
    case 3:
      return 'Ropsten Testnet';
    case 4:
      return 'Rinkeby Testnet';
    case 5:
      return 'Goerli Testnet';
    case 42:
      return 'Kovan Testnet';
    case 137:
      return 'Polygon Mainnet';
    case 44787:
      return 'Celo Alfajores Testnet';
    case 42220:
      return 'Celo Mainnet';
    default:
      return 'Unknown Chain';
  }
}
