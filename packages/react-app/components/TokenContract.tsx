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
  const [contractLink, setContractLink] = useState("");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [tokenBalance, setTokenBalance] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [tokenInitialSupply, setTokenInitialSupply] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenTotal, setTokenTotal] = useState("");
  const [tokenBalanceOf, setTokenBalanceOf] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [tokenTransferValue, setTokenTransferValue] = useState("");
  const [mintAddress, setMintAddress] = useState("");
  const [mintValue, setMintValue] = useState("");
  const [burnAddress, setBurnAddress] = useState("");
  const [burnValue, setBurnValue] = useState("");

  const contract = contractData
    ? new kit.web3.eth.Contract(contractData.abi, contractData.address)
    : null;

  useEffect(() => {
    if (contractData) {
      setContractLink(`${network.explorer}/address/${contractData.address}`);
    }
  }, [network, contractData]);

  const getTokenName = async () => {
    const tokenName = await contract.methods.name().call();
    setTokenName(tokenName);
  };

  const getTokenSymbol = async () => {
    const tokenSymbol = await contract.methods.symbol().call();
    setTokenSymbol(tokenSymbol);
  };

  const getTokenInitialSupply = async () => {
    const tokenInitialSupply = await contract.methods.initialSupply().call();
    const converted = ethers.utils.formatUnits(
      tokenInitialSupply.toString(),
      tokenDecimals
    );
    setTokenInitialSupply(converted);
  };

  const getTokenDecimals = async () => {
    const tokenDecimals = await contract.methods.decimals().call();
    setTokenDecimals(tokenDecimals);
  };

  const getTokenTotal = async () => {
    const tokenTotal = await contract.methods.totalSupply().call();
    const convertedTotal = ethers.utils.formatUnits(tokenTotal.toString(), tokenDecimals);
    setTokenTotal(convertedTotal);
  };

  const getBalance = async () => {
    const tokenBalance = await contract.methods.balance().call();
    const converted = ethers.utils.formatUnits(tokenBalance.toString(), tokenDecimals);
    setTokenBalance(converted);
  };

  const getTokenBalanceOf = async (e) => {
    e.preventDefault();
    const tokenBalanceOf = await contract.methods.balanceOf(newAddress).call();
    const converted = ethers.utils.formatUnits(tokenBalanceOf.toString(), tokenDecimals);
    setTokenBalanceOf(converted);
  };

  const mintTokens = async (e) => {
    e.preventDefault();
    console.log(mintAddress);
    console.log(mintValue);
    try {
      await performActions(async (kit) => {
        const gasLimit = await contract.methods
          .mint(mintAddress, mintValue)
          .estimateGas();

        const result = await contract.methods
          .mint(mintAddress, mintValue)
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

  const burnTokens = async (e) => {
    e.preventDefault();
    console.log(burnAddress);
    console.log(burnValue);
    try {
      await performActions(async (kit) => {
        const gasLimit = await contract.methods
          .burn(burnAddress, burnValue)
          .estimateGas();

        const result = await contract.methods
          .burn(burnAddress, burnValue)
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

  const transferTokens = async (e) => {
    e.preventDefault();
    try {
      await performActions(async (kit) => {
        const gasLimit = await contract.methods
          .transfer(newAddress, tokenTransferValue)
          .estimateGas();

        const result = await contract.methods
          .transfer(newAddress, tokenTransferValue)
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

  return (
    <Grid sx={{ m: 1 }} container justifyContent="center">
      <Grid item xs={6} sx={{ m: 2 }}>
        <Typography gutterBottom variant="h5">
          Token Contract
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create and manage your own token on Celo.
        </Typography>
        {contractData ? (
          <Link href={contractLink} target="_blank">
            {truncateAddress(contractData?.address)}
          </Link>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No contract detected for {network.name}
          </Typography>
        )}

        {/* Token Name */}

        <Box pt={2}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography gutterBottom variant="h5">
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
              <Typography gutterBottom variant="h5">
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
              <Typography gutterBottom variant="h5">
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
              <Typography gutterBottom variant="h5">
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
              <Typography gutterBottom variant="h5">
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
              <Typography gutterBottom variant="h5">
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
              <Typography gutterBottom variant="h5">
                Token Balance Of
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
                <b>Token balance of:</b> {tokenBalanceOf}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Mint */}

        <Box pt={1}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography gutterBottom variant="h5">
                Mint Tokens
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Increase token supply by minting new tokens to a specific
                address.
              </Typography>
              <form noValidate autoComplete="off" onSubmit={mintTokens}>
                <TextField
                  onChange={(e) => setMintAddress(e.target.value)}
                  label="Address"
                  fullWidth
                  required
                  margin="normal"
                  variant="standard"
                />
                <TextField
                  onChange={(e) => setMintValue(e.target.value)}
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

        {/* Burn */}

        <Box pt={1}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography gutterBottom variant="h5">
                Burn Tokens
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Decrease token supply by burning existing tokens from a specific
                address.
              </Typography>
              <form noValidate autoComplete="off" onSubmit={burnTokens}>
                <TextField
                  onChange={(e) => setBurnAddress(e.target.value)}
                  label="Address"
                  fullWidth
                  required
                  margin="normal"
                  variant="standard"
                />
                <TextField
                  onChange={(e) => setBurnValue(e.target.value)}
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

        {/* Transfer */}

        <Box pt={1}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography gutterBottom variant="h5">
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
