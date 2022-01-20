import {
  Provider,
  chain,
  useAccount,
  useConnect,
  useNetwork,
  useBlockNumber,
  useContract,
  useContractRead,
  useContractWrite,
  useSigner
} from "wagmi";

import { useState } from "react";

import deployedContracts from "../../contracts/hardhat_contracts.json";

export default function App() {
  const [{ data: connectData, error: connectError }, connect] = useConnect();
  const [{ data: accountData }, disconnect] = useAccount();
  const [{ data: networkData, error: networkError, loading }, switchNetwork] =
    useNetwork();

  let storageContract = {
    address: "",
    abi: [],
  }

  console.log(networkData.chain)
  if(!loading) storageContract = getContractData(networkData?.chain, "Storage"); 
  console.log(storageContract);
  // let storageContract = getContractData(networkData?.chain, "Storage");

  if (accountData) {
    return (
      <div>
        <div>
          {accountData.ens?.name
            ? `${accountData.ens?.name} (${accountData.address})`
            : accountData.address}
        </div>
        <div>Connected to {networkData.chain?.name}</div>
        <div>Connected to {accountData.connector.name}</div>
        <button onClick={disconnect}>Disconnect</button>
        {storageContract ? (
          <Contract contract={storageContract} />
        ) : (
          <></>
        )}

      </div>
    );
  }

  return (
    <>
      <div>
        {connectData.connectors.map((x) => (
          <button key={x.id} onClick={() => connect(x)}>
            {x.name}
            {!x.ready && " (unsupported)"}
          </button>
        ))}

        {connectError && <div>{connectError?.message ?? "Failed to connect"}</div>}
      </div>
    </>
  );
}

const Contract = (props) => {
  const [{ data, error, loading }, getSigner] = useSigner()
  const [number, setNumber] = useState()

  let config = {
    addressOrName: props.contract.address,
    contractInterface: props.contract.abi,
  }

  const contract = useContract({...config, signerOrProvider: data})

  const retrieve = async () => {
    setNumber((await contract.retrieve()).toString())
  }

  return (
    <>
      <p>Contract Address: {contract.address}</p>
      <p>Contract number: {number}</p>
      <button onClick={() => contract.store(5)}>Store 5</button>
      <button onClick={retrieve}>Retrieve number</button>
    </>
  )
}

const getContractData = (network, name) => {
  return deployedContracts[network?.id]?.[
    network?.name?.toLocaleLowerCase()
  ].contracts[name];
};