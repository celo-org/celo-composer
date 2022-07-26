import { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

//Sub Components Import
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

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

  function buildInputFields(inputs, name, outputs) {
    return (
      <>
        {inputs.map((input, key) => {
          return (
            <FormControl sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-adornment-amount">
                {input.name}
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                label={input.name}
              />
            </FormControl>
          );
        })}
      </>
    );
  }

  return (
    <div>
      <h4>
        {contractName} deployed at <a href="#">{contractData.address}</a>
      </h4>
      <div>
        {viewFunctions.map(({ inputs, name, outputs }, key) => {
          return (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={"panel" + key + "-content"}
                id={"panel" + key + "-header"}
              >
                <Typography>
                  {name} <Chip label="view" size="small" color="primary" />
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  {buildInputFields(inputs, name, outputs)}
                </Box>
                <FormControl sx={{ m: 1 }}>
                  <Button variant="contained">Call</Button>
                </FormControl>
              </AccordionDetails>
            </Accordion>
          );
        })}
        {stateFunctions.map(
          ({ inputs, name, outputs, stateMutability }, key) => {
            return (
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={"panel" + key + "-content"}
                  id={"panel" + key + "-header"}
                >
                  <Typography>
                    {name}{" "}
                    {stateMutability === "nonpayable" ? (
                      <Chip label="nonpayable" size="small" color="secondary" />
                    ) : (
                      <Chip label="payable" size="small" color="error" />
                    )}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                    {buildInputFields(inputs, name, outputs)}
                  </Box>
                  <FormControl sx={{ m: 1 }}>
                    <Button
                      variant="contained"
                      color={
                        stateMutability === "nonpayable" ? "secondary" : "error"
                      }
                    >
                      Transact
                    </Button>
                  </FormControl>
                </AccordionDetails>
              </Accordion>
            );
          }
        )}
      </div>
    </div>
  );
}
