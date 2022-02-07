import { useInput } from "../components";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { truncateAddress } from "../utils";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from '@mui/material/Link';

export function GreeterContract({ contractData }) {
  const { kit, address, network, performActions } = useContractKit();
  const [greeterValue, setGreeterValue] = useState();
  const [greeterInput, setGreeterInput] = useInput({ type: "text" });
  const [contractLink, setContractLink] = useState("");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const contract = contractData
    ? new kit.web3.eth.Contract(contractData.abi, contractData.address)
    : null;

  useEffect(() => {
    setContractLink(`${network.explorer}/address/${contractData.address}`);
  }, [network, contractData]);

  const setGreeter = async () => {
    try {
      await performActions(async (kit) => {
        const gasLimit = await contract.methods
          .setGreeting(greeterInput)
          .estimateGas();

        const result = await contract.methods
          .store(greeterInput)
          .send({ from: address, gasLimit });

        console.log(result);

        const variant = result.status == true ? "success" : "error";
        const url = `${network.explorer}/tx/${result.transactionHash}`;
        const action = (
          <a href={url} target="_blank" rel="noreferrer">
            View in Explorer
          </a>
        );
        enqueueSnackbar("Transaction sent", {
          variant,
          action,
        });
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getGreeter = async () => {
    try {
      const result = await contract.methods.greet().call();
      setGreeterValue(result);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Grid sx={{ m: 1 }} container justifyContent="center">
      <Grid item xs={6} sx={{ m: 2 }}>
        <Typography variant="h5">Greeter Contract:</Typography>
        <Link href={contractLink} target="_blank">{truncateAddress(contractData?.address)}</Link>
        <Divider sx={{ m: 1 }} />

        <Typography variant="h6">Write Contract</Typography>
        <Box sx={{ m: 1 }}>{setGreeterInput}</Box>
        <Button sx={{ m: 1 }} variant="contained" onClick={setGreeter}>
          Update Greeter Contract
        </Button>
        <Divider sx={{ m: 1 }} />

        <Typography variant="h6">Read Contract</Typography>
        <Typography sx={{ m: 1 }}>
          Greeter Contract Value: {greeterValue}
        </Typography>
        <Button sx={{ m: 1 }} variant="contained" onClick={setGreeter}>
          Read Greeter Contract
        </Button>
      </Grid>
    </Grid>
  );
}
