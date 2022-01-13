import { StableToken } from "@celo/contractkit";
import { ensureLeading0x } from "@celo/utils/lib/address";

import {
  Alfajores,
  Baklava,
  Mainnet,
  useContractKit,
} from "@celo-tools/use-contractkit";

import {
  useContractLoader,
  useContractReader
} from "eth-hooks";

import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";

import { PrimaryButton, SecondaryButton, toast } from "../components";

const networks = [Alfajores, Baklava, Mainnet];

import externalContracts from "../contracts/external_contracts";
// contracts
import deployedContracts from "../contracts/hardhat_contracts.json";
import { useStaticJsonRPC } from "../hooks";

import { NETWORKS } from "../constants";

/// 📡 What chain are your contracts deployed to?
const initialNetwork = NETWORKS.alfajores; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

export default function Greet() {
  const {
    kit,
    address,
    network,
    updateNetwork,
    connect,
    destroy,
    performActions,
    walletType,
  } = useContractKit();

  const targetNetwork = NETWORKS[network.name.toLowerCase()];

  const provider = useStaticJsonRPC([
    targetNetwork,
  ]);

  const contractConfig = { deployedContracts: deployedContracts || {}, externalContracts: externalContracts || {} };
  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(contractConfig, provider);

  const log = () => {
    console.log(readContracts);
  };

  useEffect(() => {
    console.log(readContracts)
  })

  return (
    <>
      <div>
        {address && (
          <>
            <PrimaryButton onClick={destroy}>Disconnect Wallet</PrimaryButton>
            <p>Address: {address}</p>
            <p>Network: {network.name}</p>
          </>
        )}
        {!address && (
          <PrimaryButton onClick={connect}>Connect wallet</PrimaryButton>
        )}
      </div>
      <PrimaryButton onClick={log}>Log stuff</PrimaryButton>
    </>
  );
}
