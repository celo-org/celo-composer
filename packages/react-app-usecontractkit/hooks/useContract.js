import { useState, useEffect, useCallback } from 'react';
import { useContractKit } from '@celo-tools/use-contractkit';
import deployedContracts from "../contracts/hardhat_contracts.json";

export const useContract = (abi, contractAddress) => {
  const { getConnectedKit, address, network } = useContractKit();
  const [contract, setContract] = useState(null);

  const getContract = useCallback(async () => {
    const kit = await getConnectedKit();

    setContract(new kit.web3.eth.Contract(abi, contractAddress));
  }, [getConnectedKit, abi, contractAddress]);

  useEffect(() => {
    if (address) getContract();
  }, [address, getContract, network]);

  return contract;
};

const getContractData = (network, name) => {
    return deployedContracts[network.chainId]?.[
      network?.name?.toLocaleLowerCase()
    ].contracts[name];
  };