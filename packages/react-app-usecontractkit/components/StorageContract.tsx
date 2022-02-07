import { useInput } from "../components";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export function StorageContract({ contractData }) {
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
    <Grid sx={{ m: 1 }} container justifyContent="center">
      <Box sx={{ m: 2 }} justifyContent="center">
        <Typography variant="h5">Storage Contract:</Typography>
        <Typography>{contractData?.address}</Typography>
        <Divider sx={{ m: 1 }} />
        <Typography variant="h6">Write Contract</Typography>
        <Box sx={{ m: 1 }}>{setStorageInput}</Box>
        <Button sx={{ m: 1 }} variant="contained" onClick={setStorage}>
          Update Storage Contract
        </Button>
        <Divider sx={{ m: 1 }} />
        <Typography variant="h6">Read Contract</Typography>
        <Typography sx={{ m: 1 }}>
          Storage Contract Value: {storageValue}
        </Typography>
        <Button sx={{ m: 1 }} variant="contained" onClick={getStorage}>
          Read Storage Contract
        </Button>
      </Box>
    </Grid>
  );
}
