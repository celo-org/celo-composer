export function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(38)}`;
}

export function truncateTxHash(txId: string) {
  return `${txId.slice(0, 6)}...${txId.slice(-4)}`;
}

export function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}