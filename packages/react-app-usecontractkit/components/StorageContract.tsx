
import { useInput, ButtonAppBar } from "../components";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useState } from "react";

function StorageContract({ contractData }) {
    const { kit, address, network, performActions } = useContractKit();
    const [storageValue, setStorageValue] = useState();
    const [storageInput, setStorageInput] = useInput({ type: "text" });
  
    const contract = contractData
      ? new kit.web3.eth.Contract(contractData.abi, contractData.address)
      : null;
  
    const setStorage = async () => {
      try {
        await performActions(async (kit) => {
          const gasLimit = await contract.methods
            .store(storageInput)
            .estimateGas();
          const result = await contract.methods
            .store(storageInput)
            .send({ from: address, gasLimit });
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