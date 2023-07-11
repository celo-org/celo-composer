import {ethers} from 'ethers';

import CONTRACT_VALUES from '../constants/Contract';
import type {FormattedRpcResponse, RpcRequestParams} from '../types';

export const readContract = async ({
  web3Provider,
  method,
}: RpcRequestParams): Promise<FormattedRpcResponse> => {
  if (!web3Provider) {
    throw new Error('web3Provider not connected');
  }

  const contract = new ethers.Contract(
    CONTRACT_VALUES.contractAddress,
    CONTRACT_VALUES.readContractAbi,
    web3Provider,
  );

  // Read contract information
  const name = await contract.name();
  const symbol = await contract.symbol();
  const balance = await contract.balanceOf(CONTRACT_VALUES.balanceAddress);

  // Format the USDT for displaying to the user
  const formattedBalance = ethers.utils.formatUnits(balance, 6);

  return {
    method,
    address: CONTRACT_VALUES.contractAddress,
    valid: true,
    result: `name: ${name}, symbol: ${symbol}, balance: ${formattedBalance}`,
  };
};

export const getFilterChanges = async ({
  web3Provider,
  method,
}: RpcRequestParams): Promise<FormattedRpcResponse> => {
  if (!web3Provider) {
    throw new Error('web3Provider not connected');
  }

  const contract = new ethers.Contract(
    CONTRACT_VALUES.contractAddress,
    CONTRACT_VALUES.getFilterChangesAbi,
    web3Provider,
  );

  // Filter for all token transfers
  const filterFrom = contract.filters.Transfer?.(null, null);

  // List all transfers sent in the last 100 blocks
  const transfers = await contract.queryFilter(filterFrom!, -100);

  return {
    method,
    address: CONTRACT_VALUES.contractAddress,
    valid: true,
    result: `transfers in last 100 blocks: ${transfers.length}`,
  };
};
