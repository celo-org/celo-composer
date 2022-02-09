import { useInput } from ".";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { truncateAddress } from "../utils";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { ethers } from "ethers";

const buttonStyle = {
  marginLeft: "0px",
  marginRight: "5px",
  marginTop: "20px",
  marginBottom: "20px",
};

export function TokenContract({ contractData }) {
  const { kit, address, network, performActions } = useContractKit();
  const [tokenInput, setTokenInput] = useInput({ type: "text" });
  const [contractLink, setContractLink] = useState("");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [tokenBalance, setTokenBalance] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState("");
  const [tokenInitialSupply, setTokenInitialSupply] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenTotal, setTokenTotal] = useState("");
  const [tokenBalanceOf, setTokenBalanceOf] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [tokenTransferValue, setTokenTransferValue] = useState("");

  const contract = contractData
    ? new kit.web3.eth.Contract(contractData.abi, contractData.address)
    : null;

  useEffect(() => {
    if (contractData) {
      setContractLink(`${network.explorer}/address/${contractData.address}`);
    }
  }, [network, contractData]);

  const setToken = async () => {
    try {
      await performActions(async (kit) => {
        const gasLimit = await contract.methods.store(tokenInput).estimateGas();

        const result = await contract.methods
          .store(tokenInput)
          .send({ from: address, gasLimit });

        console.log(result);

        const variant = result.status == true ? "success" : "error";
        const url = `${network.explorer}/tx/${result.transactionHash}`;
        const action = (key) => (
          <>
            <Link href={url} target="_blank" component="div">
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

  const getTokenName = async () => {
    const tokenName = await contract.methods.name().call();
    setTokenName(tokenName);
  };

  const getTokenSymbol = async () => {
    const tokenSymbol = await contract.methods.symbol().call();
    setTokenSymbol(tokenSymbol);
  };

  const getTokenInitialSupply = async () => {
    const tokenInitialSupply = await contract.methods
      .initialSupply()
      .call()
      .then((result) => {
        return ethers.utils.formatUnits(result, 18);
      });
    setTokenInitialSupply(tokenInitialSupply);
  };

  const getTokenDecimals = async () => {
    const tokenDecimals = await contract.methods.decimals().call();
    setTokenDecimals(tokenDecimals.toString());
  };

  const getTokenTotal = async () => {
    const tokenTotal = await contract.methods.totalSupply().call();
    const convertedTotal = ethers.utils.formatUnits(tokenTotal.toString(), 18);
    setTokenTotal(convertedTotal);
  };

  const getBalance = async () => {
    const tokenBalance = await contract.methods
      .balance()
      .call()
      .then((result) => {
        return ethers.utils.formatUnits(result, 18);
      });
    setTokenBalance(tokenBalance);
  };

  const getTokenBalanceOf = async (e) => {
    e.preventDefault();
    console.log(address);
    const tokenBalanceOf = await contract.methods
      .balanceOf(address)
      .call()
      .then((result) => {
        return ethers.utils.formatUnits(result, 18);
      });
    setTokenBalanceOf(tokenBalanceOf);
  };

  const transferTokens = async (e) => {
    e.preventDefault();
    let tx = await contract.methods
      .transfer(newAddress, tokenTransferValue)
      .call();
    let receipt = await tx.wait();
    console.log("receipt", receipt);
  };

  return (
    <Grid sx={{ m: 1 }} container justifyContent="center">
      <Grid item xs={6} sx={{ m: 2 }}>
        <Typography gutterBottom variant="h5" component="div">
          Token Contract
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create and manage your own token on Celo.
        </Typography>
        {contractData ? (
          <Link href={contractLink} target="_blank" component="div">
            {truncateAddress(contractData?.address)}
          </Link>
        ) : (
          <Typography component="div" variant="body2" color="text.secondary">
            No contract detected for {network.name}
          </Typography>
        )}

        {/* Token Name */}

        <Box pt={2}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Token Name
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reads the name of the deployed token.
              </Typography>
              <Button
                style={buttonStyle}
                onClick={getTokenName}
                size="large"
                variant="contained"
              >
                Submit
              </Button>
              <Typography variant="body2" color="text.secondary">
                <b>Name:</b> {tokenName}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Token Symbol */}

        <Box pt={1}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Token Symbol
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reads the symbol of the deployed token.
              </Typography>
              <Button
                style={buttonStyle}
                variant="contained"
                onClick={getTokenSymbol}
                size="large"
              >
                Submit
              </Button>
              <Typography variant="body2" color="text.secondary">
                <b>Symbol:</b> {tokenSymbol}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Total Tokens */}

        <Box pt={1}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Total Tokens
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reads the total number of tokens in the supply.
              </Typography>
              <Button
                style={buttonStyle}
                onClick={getTokenTotal}
                size="large"
                variant="contained"
              >
                Submit
              </Button>
              <Typography variant="body2" color="text.secondary">
                <b>Total:</b> {tokenTotal}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Token Decimals */}

        <Box pt={1}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Token Decimals
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reads the number of decimals of the deployed token.
              </Typography>
              <Button
                style={buttonStyle}
                onClick={getTokenDecimals}
                size="large"
                variant="contained"
              >
                Submit
              </Button>
              <Typography variant="body2" color="text.secondary">
                <b>Decimals:</b> {tokenDecimals}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Initial Supply */}

        <Box pt={1}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Initial Supply
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reads the initial supply of the deployed token.
              </Typography>
              <Button
                onClick={getTokenInitialSupply}
                size="large"
                style={buttonStyle}
                variant="contained"
              >
                Submit
              </Button>
              <Typography variant="body2" color="text.secondary">
                <b>Initial Supply:</b> {tokenInitialSupply}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Current Balance */}

        <Box pt={1}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Token Balance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reads the total balance of the calling address.
              </Typography>
              <Button
                style={buttonStyle}
                onClick={getBalance}
                size="large"
                variant="contained"
              >
                Submit
              </Button>
              <Typography variant="body2" color="text.secondary">
                <b>Token Balance:</b> {tokenBalance}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Address Balance */}

        <Box pt={1}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Address Balance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reads the balance of the given address.
              </Typography>
              <form noValidate autoComplete="off" onSubmit={getTokenBalanceOf}>
                <TextField
                  onChange={(e) => setNewAddress(e.target.value)}
                  label="Address"
                  fullWidth
                  required
                  margin="normal"
                  variant="standard"
                />
                <Button
                  style={buttonStyle}
                  variant="contained"
                  type="submit"
                  size="large"
                >
                  Submit
                </Button>
              </form>
              <Typography variant="body2" color="text.secondary">
                <b>Address balance:</b> {tokenBalanceOf}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Transfer */}

        <Box pt={1}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Transfer Balance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Transfers value from one address to another.
              </Typography>
              <form noValidate autoComplete="off" onSubmit={transferTokens}>
                <TextField
                  onChange={(e) => setNewAddress(e.target.value)}
                  label="Address"
                  fullWidth
                  required
                  margin="normal"
                  variant="standard"
                />
                <TextField
                  onChange={(e) => setTokenTransferValue(e.target.value)}
                  label="Value"
                  fullWidth
                  required
                  margin="normal"
                  variant="standard"
                />
                <Button
                  style={buttonStyle}
                  variant="contained"
                  type="submit"
                  size="large"
                >
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </Grid>
  );
}
