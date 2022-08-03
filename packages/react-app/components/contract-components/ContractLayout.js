import { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useCelo } from "@celo/react-celo";

import {
  ContractFields,
  ContractFuncTypeTag,
} from "@/components/contract-components";

//Sub Components Import
import Box from "@mui/material/Box";

export function ContractLayout({ contractName, contractData }) {
  const [viewFunctions, setViewFunctions] = useState([]);
  const [stateFunctions, setStateFunctions] = useState([]);
  const [contractFunctions, setContractFunctions] = useState([]);
  const { kit, network } = useCelo();
  const [contract, setContract] = useState({});

  useEffect(() => {
    const abi = contractData.abi;
    if (abi) {
      setViewFunctions(
        abi.filter(
          (contract) =>
            contract.type === "function" && contract.stateMutability === "view"
        )
      );

      setStateFunctions(
        abi.filter(
          (contract) =>
            contract.type === "function" &&
            ["nonpayable", "payable"].includes(contract.stateMutability)
        )
      );

      setContractFunctions([...viewFunctions, ...stateFunctions]);

      try {
        const contract = new kit.connection.web3.eth.Contract(
          contractData.abi,
          contractData.address
        );

        setContract(contract);
      } catch (error) {
        cnsole.log(error);
      }
    }
  }, [contractData]);

  return (
    <div>
      <h4>
        {contractName} deployed at{" "}
        <a
          target="_blank"
          href={`${network.explorer}/address/${contractData.address}`}
        >
          {contractData.address}
        </a>
      </h4>
      <div>
        {viewFunctions.map(
          ({ inputs, name, outputs, stateMutability }, key) => {
            return (
              <Accordion key={key}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={"panel" + key + "-content"}
                  id={"panel" + key + "-header"}
                >
                  <Typography mr={1}>{name}</Typography>
                  <ContractFuncTypeTag funcType={stateMutability} />
                </AccordionSummary>
                <AccordionDetails>
                  <ContractFields
                    funcName={name}
                    inputs={inputs}
                    outputs={outputs}
                    contract={contract}
                    stateMutability={stateMutability}
                  />
                </AccordionDetails>
              </Accordion>
            );
          }
        )}
        {stateFunctions.map(
          ({ inputs, name, outputs, stateMutability }, key) => {
            return (
              <Accordion key={key}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={"panel" + key + "-content"}
                  id={"panel" + key + "-header"}
                >
                  <Typography mr={1}>{name}</Typography>
                  <ContractFuncTypeTag funcType={stateMutability} />
                </AccordionSummary>
                <AccordionDetails>
                  <ContractFields
                    funcName={name}
                    inputs={inputs}
                    outputs={outputs}
                    contract={contract}
                    stateMutability={stateMutability}
                  />
                </AccordionDetails>
              </Accordion>
            );
          }
        )}
      </div>
    </div>
  );
}
