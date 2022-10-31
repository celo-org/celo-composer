import * as React from "react";
import { Box, Button, Divider, Grid, Typography, Link } from "@mui/material";

import { useInput } from "@/hooks/useInput";
import { useCelo } from "@celo/react-celo";
import { useEffect, useState } from "react";
import { SnackbarAction, SnackbarKey, useSnackbar } from "notistack";
import { truncateAddress } from "@/utils";
import { Greeter } from "@local-contracts/types/Greeter";

export function GreeterContract({ contractData }) {
  const { kit, address, network, performActions } = useCelo();
  const [greeterValue, setGreeterValue] = useState<string | null>(null);
  const [greeterInput, setGreeterInput] = useInput({ type: "text" });
  const [contractLink, setContractLink] = useState<string>("");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const contract = contractData
    ? (new kit.connection.web3.eth.Contract(
        contractData.abi,
        contractData.address
      ) as any as Greeter)
    : null;

  useEffect(() => {
    if (contractData) {
      setContractLink(`${network.explorer}/address/${contractData.address}`);
    }
  }, [network, contractData]);

  const setGreeter = async () => {
    try {
      await performActions(async (kit) => {
        const gasLimit = await contract.methods
          .setGreeting(greeterInput as string)
          .estimateGas();

        const result = await contract.methods
          .setGreeting(greeterInput as string)
          //@ts-ignore
          .send({ from: address, gasLimit });

        console.log(result);

        const variant = result.status == true ? "success" : "error";
        const url = `${network.explorer}/tx/${result.transactionHash}`;
        const action: SnackbarAction = (key) => (
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
        enqueueSnackbar("Transaction processed", {
          variant,
          action,
        });
      });
    } catch (e) {
      enqueueSnackbar(e.message, {variant: 'error'});
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
      <Grid item sm={6} xs={12} sx={{ m: 2 }}>
        <Typography variant="h5">Greeter Contract:</Typography>
        {contractData ? (
          <Link href={contractLink} target="_blank">
            {truncateAddress(contractData?.address)}
          </Link>
        ) : (
          <Typography>No contract detected for {network.name}</Typography>
        )}
        <Divider sx={{ m: 1 }} />

        <Typography variant="h6">Write Contract</Typography>
        <Box sx={{ m: 1, marginLeft: 0 }}>{setGreeterInput}</Box>
        <Button sx={{ m: 1, marginLeft: 0 }} variant="contained" onClick={setGreeter}>
          Update Greeter Contract
        </Button>
        <Divider sx={{ m: 1 }} />

        <Typography variant="h6">Read Contract</Typography>
        <Typography sx={{ m: 1, marginLeft: 0, wordWrap: "break-word" }}>
          Greeter Contract Value: {greeterValue}
        </Typography>
        <Button sx={{ m: 1, marginLeft: 0 }} variant="contained" onClick={getGreeter}>
          Read Greeter Contract
        </Button>
      </Grid>
    </Grid>
  );
}
