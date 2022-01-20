import { Card, Input } from "antd";
import "antd/dist/antd.css";
import {
  Alfajores,
  Baklava,
  Mainnet,
  Localhost,
  useContractKit,
  useProviderOrSigner,
} from "@celo-tools/use-contractkit";
import { useCallback, useEffect, useState } from "react";
import { useContract } from "../hooks/useContract";
import { PrimaryButton, SecondaryButton, toast, useInput } from "../components";

const networks = [Alfajores, Baklava, Mainnet, Localhost];
// contracts
import deployedContracts from "../contracts/hardhat_contracts.json";

/// 📡 What chain are your contracts deployed to?
const initialNetwork = Localhost; // <-- select your target frontend network (localhost, alfajores, mainnet)
let localhostAccounts;

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
    getConnectedKit,
    feeCurrency,
  } = useContractKit();
  const [contracts, setContracts] = useState([]);

  let greeterContract, storageContract;

  const getContractData = (network, name) => {
    return deployedContracts[network.chainId]?.[
      network?.name?.toLocaleLowerCase()
    ].contracts[name];
  };

  let storageContractData = getContractData(network, "Storage");
  let greeterContractData = getContractData(network, "Greeter");

  try{
    storageContract = useContract(
      storageContractData.abi,
      storageContractData.address
    );
    greeterContract = useContract(
      greeterContractData.abi,
      greeterContractData.address
    );
  }
  catch(e){
    console.log(e);
  }

  // Load in your local 📝 contract and read a value from it:
  const log = async () => {
    console.log(network)
    console.log(localhostAccounts);
    console.log("greeter c", greeterContract);
    console.log("storage c", storageContract);
  };

  const getAccounts = useCallback(async () => {
    const kit = await getConnectedKit();
    if (network.name === Localhost.name) {
      localhostAccounts = await kit.web3.eth.getAccounts();
    }
  }, [network, getConnectedKit]);

  useEffect(() => {
    getAccounts();
    console.log('network updated', network)
  }, [network, getAccounts]);

  return (
    <>
      <div>
        {address && (
          <>
            <PrimaryButton onClick={destroy}>Disconnect Wallet</PrimaryButton>
            <p>Address: {address}</p>
            <p>
              Network: {network.name}, {network.chainId}
            </p>
            <div>
              {/* <Contract name="Greeter" contracts={contracts} /> */}
              <Storage contract={storageContract} />
            </div>
          </>
        )}
        {!address && (
          <PrimaryButton onClick={connect}>Connect wallet</PrimaryButton>
        )}
      </div>

      <div>{}</div>
      <PrimaryButton onClick={log}>Log stuff</PrimaryButton>
    </>
  );
}

function Storage({ contract }) {
  const { address, performActions } = useContractKit();
  const [storageValue, setStorageValue] = useState();
  const [storageInput, setStorageInput] = useInput({ type: "text" });

  console.log(contract)

  const setStorage = async () => {
    try {
      await performActions(async (kit) => {
        console.log("pf address", address);
        const result = await contract.methods
          .store(storageInput)
          .send({ from: address });
        console.log(result);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getStorage = async () => {
    try {
      const result = await contract.methods.retrieve().call();
      setStorageValue(result);
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {}, []);

  return (
    <>
      <Card title="Storage" bordered={true} style={{ width: 500 }}>
        <p>
          {name} Contract Address: {contract?._address}
        </p>
        {setStorageInput}
        <PrimaryButton onClick={setStorage}>
          Update Storage Contract
        </PrimaryButton>
        <p>Storage Contract Value: {storageValue}</p>
        <PrimaryButton onClick={getStorage}>
          Read Storage Contract
        </PrimaryButton>
      </Card>
    </>
  );
}

function Contract({ name, contracts }) {
  const [methods, setMethods] = useState([]);

  const getMethods = () => {
    let m = [];
    console.log(contracts);
    if (Object.keys(contracts).length === 0) return;
    for (const [key, value] of Object.entries(contracts?.[name]?.methods)) {
      if (key.includes("(") && key.includes(")")) {
        m.push({ name: key, fx: value });
      }
    }
    setMethods(m);
    console.log("methods", m);
  };

  const handleMethod = async (method) => {
    console.log(method);
    console.log(await method.fx.call().call());
  };

  useEffect(() => {
    getMethods();
  }, [contracts]);

  return (
    <>
      <Card title={name} bordered={false} style={{ width: 300 }}>
        <p>Address: {contracts?.[name]?._address}</p>
        {methods.map((method) => (
          <div>
            <PrimaryButton onClick={() => handleMethod(method)}>
              {method.name}
            </PrimaryButton>
          </div>
        ))}
      </Card>
    </>
  );
}
