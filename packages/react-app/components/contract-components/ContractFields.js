import { useEffect, useState } from "react";

import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "@mui/material";
import { useCelo } from "@celo/react-celo";
import { SnackbarAction, SnackbarKey, useSnackbar } from "notistack";

export function ContractFields({
  inputs,
  funcName,
  outputs,
  stateMutability,
  contract,
}) {
  const [params, setParams] = useState({});
  const [result, setResult] = useState("");
  const { kit, address, network, performActions } = useCelo();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    setParams({ ...params, ...{ [name]: value } });
  }

  function buttonColor(funcType) {
    switch (funcType) {
      case "nonpayable":
        return "secondary";
      case "payable":
        return "error";
      default:
        return "primary";
    }
  }

  function getReArrangedFuncArgs() {
    let orderedArgs = [];
    inputs.forEach((field) => {
      orderedArgs.push(params[field.name]);
    });

    return orderedArgs;
  }

  async function handleOnSubmit(e) {
    e.preventDefault();

    const args = getReArrangedFuncArgs();

    if (["view", "pure"].includes(stateMutability)) {
      try {
        const result = await contract.methods[funcName](...args).call();
        setResult(result);
      } catch (error) {
        enqueueSnackbar(
          e.message + " Check browser console for more details.",
          { variant: "error" }
        );
        console.log(e);
      }
    } else {
      try {
        await performActions(async (kit) => {
          const gasLimit = await contract.methods[funcName](
            ...args
          ).estimateGas();

          const result = await contract.methods[funcName](...args)
            //@ts-ignore
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
          enqueueSnackbar("Transaction processed", {
            variant,
            action,
          });
        });
      } catch (e) {
        enqueueSnackbar(
          e.message + " Check browser console for more details.",
          { variant: "error" }
        );
        console.log(e);
      }
    }
  }

  return (
    <>
      <form onSubmit={handleOnSubmit} autoComplete="off">
        {inputs.map((input, key) => {
          const name = input.name;
          return (
            <Box sx={{ display: "flex", flexWrap: "wrap" }} key={key}>
              <FormControl sx={{ m: 1 }}>
                <InputLabel htmlFor={name}>{name}</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  label={name}
                  name={name}
                  onChange={handleChange}
                  onKeyUp={handleChange}
                  required
                />
              </FormControl>
            </Box>
          );
        })}
        <FormControl sx={{ m: 1 }}>
          <Button
            variant="contained"
            color={buttonColor(stateMutability)}
            type="submit"
          >
            {["view", "pure"].includes(stateMutability) ? "Call" : "Transact"}
          </Button>
          {result && <Typography mt={1}>Response: {result}</Typography>}
        </FormControl>
      </form>
    </>
  );
}
