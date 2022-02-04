import { useState } from "react";

import { Card, Button } from "antd";
import "antd/dist/antd.css";

import deployedContracts from "../../hardhat/deployments/hardhat_contracts.json";
import { useContractKit } from "@celo-tools/use-contractkit";

import { useInput } from "../components";

export default function App() {
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

  const contracts =
    deployedContracts[network?.chainId?.toString()]?.[
      network?.name?.toLocaleLowerCase()
    ]?.contracts;

  console.log(kit);
  return (
    <div>
      {address && (
        <>
          <Button onClick={destroy}>Disconnect Wallet</Button>
          <p>Address: {address}</p>
          <p>
            Network: {network.name}, {network.chainId}
          </p>
          <div>
            {/* <GreeterContract contracts={contracts} /> */}
            <StorageContract contractData={contracts?.Storage} />
          </div>
        </>
      )}
      {!address && <Button onClick={connect}>Connect wallet</Button>}
    </div>
  );
}

function StorageContract({ contractData }) {
  const { kit, address, performActions } = useContractKit();
  const [storageValue, setStorageValue] = useState();
  const [storageInput, setStorageInput] = useInput({ type: "text" });

  const contract = contractData
    ? new kit.web3.eth.Contract(contractData.abi, contractData.address)
    : null;

  const setStorage = async () => {
    try {
      console.log(storageInput);
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

  return (
    <>
      <Card title="Storage" bordered={true} style={{ width: 500 }}>
        <p>
          {name} Contract Address: {contract?._address}
        </p>
        {setStorageInput}
        <Button onClick={setStorage}>Update Storage Contract</Button>
        <p>Storage Contract Value: {storageValue}</p>
        <Button onClick={getStorage}>Read Storage Contract</Button>
      </Card>
    </>
  );
}
