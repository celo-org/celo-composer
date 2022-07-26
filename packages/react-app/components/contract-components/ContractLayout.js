import { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  ContractFields,
  ContractFuncTypeTag,
} from "@/components/contract-components";

//Sub Components Import
import Box from "@mui/material/Box";

export function ContractLayout({ contractName, contractData }) {
  const [viewFunctions, setViewFunctions] = useState([]);
  const [stateFunctions, setStateFunctions] = useState([]);

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
    }
  }, []);

  return (
    <div>
      <h4>
        {contractName} deployed at <a href="#">{contractData.address}</a>
      </h4>
      <div>
        {viewFunctions.map(
          ({ inputs, name, outputs, stateMutability }, key) => {
            return (
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={"panel" + key + "-content"}
                  id={"panel" + key + "-header"}
                >
                  <Typography>
                    {name} <ContractFuncTypeTag funcType="view" />
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ContractFields
                    inputs={inputs}
                    name={name}
                    outputs={outputs}
                    stateMutability={stateMutability}
                  />
                </AccordionDetails>
              </Accordion>
            );
          }
        )}
        {/* {stateFunctions.map(
          ({ inputs, name, outputs, stateMutability }, key) => {
            return (
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={"panel" + key + "-content"}
                  id={"panel" + key + "-header"}
                >
                  <Typography>
                    {name} <ContractFuncTypeTag funcType={stateMutability} />
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                    <ContractFields
                      inputs={inputs}
                      name={name}
                      outputs={outputs}
                      stateMutability={stateMutability}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          }
        )} */}
      </div>
    </div>
  );
}
