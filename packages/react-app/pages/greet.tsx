import { StableToken } from "@celo/contractkit";
import { ensureLeading0x } from "@celo/utils/lib/address";

import {
  Alfajores,
  Baklava,
  Mainnet,
  useContractKit,
} from "@celo-tools/use-contractkit";

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
const initialNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)
const contractsToInit = ["Greeter", "Storage"];

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

  const [contracts, setContracts] = useState({});

  const initContracts = async (contractsToInit: Array<string>) => {
    let contracts = {};
    contractsToInit.map((name) => {
      let contractData =
        deployedContracts[targetNetwork.chainId][targetNetwork.name].contracts[
          name
        ];
      contracts[name] = new kit.web3.eth.Contract(
        contractData.abi,
        contractData.address
      );
    });
    setContracts(contracts);
    console.log("contracts", contracts);
  };

  const init = async () => {
    await connect();
    await initContracts(contractsToInit);
  };

  // Load in your local 📝 contract and read a value from it:

  const log = () => {};

  useEffect(() => {
    // console.log("deployed contracts", deployedContracts);
    console.log("network", targetNetwork);
    try {
    } catch {
      console.log("no contracts for network", targetNetwork);
    }
  });

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
          <PrimaryButton onClick={init}>Connect wallet</PrimaryButton>
        )}
      </div>

      <div>{}</div>
      <PrimaryButton onClick={log}>Log stuff</PrimaryButton>
      <p>
        <Contract
          name="Greeter"
          contracts={contracts}
        />
        <Contract
          name="Storage"
          contracts={contracts}
        />
      </p>
    </>
  );
}

function Contract({ name, contracts }) {

  return (
    <>
      <p>{name}</p>
      {contracts[name] && (
        <p>{contracts[name]._address}</p>
      )}
    </>
  );
}
