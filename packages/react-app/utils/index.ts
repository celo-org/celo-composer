export function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(38)}`;
}

export function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}