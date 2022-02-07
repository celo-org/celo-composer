import { useState } from "react";

import { Card, Button } from "antd";
// import "antd/dist/antd.css";

import deployedContracts from "../../hardhat/deployments/hardhat_contracts.json";
import { useContractKit } from "@celo-tools/use-contractkit";

import { StorageContract, ButtonAppBar } from "../components";

export default function App() {
  const {
    kit,
    address,
    network,
  } = useContractKit();

  const contracts =
    deployedContracts[network?.chainId?.toString()]?.[
      network?.name?.toLocaleLowerCase()
    ]?.contracts;

  console.log(kit);
  return (
    <div>
      <ButtonAppBar/>
      {address && (
        <>
          <div>
            {/* <GreeterContract contracts={contracts} /> */}
            <StorageContract contractData={contracts?.Storage} />
          </div>
        </>
      )}
    </div>
  );
}
