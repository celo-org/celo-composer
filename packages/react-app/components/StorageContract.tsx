import { useInput } from ".";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { truncateAddress } from "../utils";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export function StorageContract({ contractData }) {
  const { kit, address, network, performActions } = useContractKit();
  const [storageValue, setStorageValue] = useState();
  const [storageInput, setStorageInput] = useInput({ type: "text" });
  const [contractLink, setContractLink] = useState("");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const contract = contractData
    ? new kit.web3.eth.Contract(contractData.abi, contractData.address)
    : null;

  useEffect(() => {
    if (contractData) {
      setContractLink(`${network.explorer}/address/${contractData.address}`);
    }
  }, [network, contractData]);

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

        const variant = result.status == true ? "success" : "error";
        const url = `${network.explorer}/tx/${result.transactionHash}`;
        const action = (key) => (
          <>
            <Link href={url} target="_blank">
              View in Explorer
            </Link>
            <Button
              onClick={() => {
                closeSnackbar(key);
              }}
            >
              X
            </Button>
          </>
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

  const getStorage = async () => {
    try {
      const result = await contract.methods.retrieve().call();
      setStorageValue(result);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Grid sx={{ m: 1 }} container justifyContent="center">
      <Grid item xs={6} sx={{ m: 2 }}>
        <Typography variant="h5">Storage Contract:</Typography>
        {contractData ? (
          <Link href={contractLink} target="_blank">
            {truncateAddress(contractData?.address)}
          </Link>
        ) : (
          <Typography>No contract detected for {network.name}</Typography>
        )}
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
      </Grid>
    </Grid>
  );
}
