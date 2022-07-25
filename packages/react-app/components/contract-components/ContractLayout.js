import { useEffect, useState } from "react";

export function ContractLayout({ contractData }) {
  const [viewFunctions, setViewFunctions] = useState([]);
  const [stateFunctions, setStateFunctions] = useState([]);

  useEffect(() => {
    setViewFunctions(
      contractData.filter(
        (contract) =>
          contract.type === "function" && contract.stateMutability === "view"
      )
    );

    setStateFunctions(
      contractData.filter(
        (contract) =>
          contract.type === "function" &&
          ["nonpayable", "payable"].includes(contract.stateMutability)
      )
    );
    console.log(contractData);
  }, []);

  return (
    <>
      <h1>Hello</h1>
    </>
  );
}
