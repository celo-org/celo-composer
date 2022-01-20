import { useCallback, useEffect, useState } from "react";
import { Web3HttpProvider } from "web3";

const createProvider = async url => {
  // const p = new ethers.providers.StaticJsonRpcProvider(url);
  const web3 = new Web3HttpProvider(url);

  return web3;
};

export default function useStaticJsonRPC(urlArray) {
  const [provider, setProvider] = useState(null);

  const handleProviders = useCallback(async () => {
    try {
      const p = await Promise.race(urlArray.map(createProvider));
      const _p = await p;

      setProvider(_p);
    } catch (error) {
      // todo: show notification error about provider issues
      console.log(error);
    }
  });

  useEffect(() => {
    handleProviders();
  }, [JSON.stringify(urlArray)]);

  return provider;
}