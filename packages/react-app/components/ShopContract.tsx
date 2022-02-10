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

export function ShopContract({ contractData }) {
  const { kit, address, network, performActions } = useContractKit();
  const [tokenInput, setTokenInput] = useInput({ type: "text" });
  const [contractLink, setContractLink] = useState("");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [itemCount, setItemCount] = useState("");
  const [newItem, setNewItem] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [itemIndex, setItemIndex] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemState, setItemState] = useState("");

  const contract = contractData
    ? new kit.web3.eth.Contract(contractData.abi, contractData.address)
    : null;

  useEffect(() => {
    if (contractData) {
      setContractLink(`${network.explorer}/address/${contractData.address}`);
    }
  }, [network, contractData]);

  const getItemCount = async () => {
    const itemCount = await contract.methods.skuCount().call();
    setItemCount(itemCount);
  };

  const addItem = async (e) => {
    e.preventDefault();
    try {
      await performActions(async (kit) => {
        const gasLimit = await contract.methods
          .addItem(newItemName, newItemPrice)
          .estimateGas();

        const result = await contract.methods
          .addItem(newItemName, newItemPrice)
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

  const buyItem = async (e) => {
    e.preventDefault();
    try {
      await performActions(async (kit) => {
        const gasLimit = await contract.methods
          .buyItem(itemIndex)
          .estimateGas();

        const result = await contract.methods
          .buyItem(itemIndex)
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

  const shipItem = async (e) => {
    e.preventDefault();
    try {
      await performActions(async (kit) => {
        const gasLimit = await contract.methods
          .shipItem(itemIndex)
          .estimateGas();

        const result = await contract.methods
          .shipItem(itemIndex)
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

  const viewName = async (e) => {
    e.preventDefault();
    const itemDetails = await contract.methods.fetchItem(itemIndex).call();
    const name = setItemName(itemDetails.name);
  };

  const viewPrice = async (e) => {
    e.preventDefault();
    const itemDetails = await contract.methods.fetchItem(itemIndex).call();
    const price = setItemPrice(itemDetails.price);
  };

  const viewState = async (e) => {
    e.preventDefault();
    const itemDetails = await contract.methods.fetchItem(itemIndex).call();
    const state = setItemState(itemDetails.state);
    console.log(state);
  };

  return (
    <Grid sx={{ m: 1 }} container justifyContent="center">
      <Grid item xs={6} sx={{ m: 2 }}>
        <Typography gutterBottom variant="h5" component="div">
          Shop Contract
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create, buy, and sell items with a simple shop.
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

        {/* View Item Count */}

        <Box pt={2}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Item Count
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View number of items available in the shop.
              </Typography>
              <Button
                style={buttonStyle}
                onClick={getItemCount}
                size="large"
                variant="contained"
              >
                Submit
              </Button>
              <Typography variant="body2" color="text.secondary">
                <b>Number of Items:</b> {itemCount}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Add Item */}

        <Box pt={1}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Add Item
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add item to the store.
              </Typography>
              <form noValidate autoComplete="off" onSubmit={addItem}>
                <TextField
                  onChange={(e) => setNewItemName(e.target.value)}
                  label="Name"
                  fullWidth
                  required
                  margin="normal"
                  variant="standard"
                />
                <TextField
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  label="Price"
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

        {/* Buy Item */}

        <Box pt={1}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Buy Item
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Purchase an item from the store by entering the item's index.
              </Typography>
              <form noValidate autoComplete="off" onSubmit={buyItem}>
                <TextField
                  onChange={(e) => setItemIndex(e.target.value)}
                  label="Index"
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

        {/* Buy Item */}

        <Box pt={1}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Ship Item
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ship an item from the store to the buyer using the item's index.
              </Typography>
              <form noValidate autoComplete="off" onSubmit={shipItem}>
                <TextField
                  onChange={(e) => setItemIndex(e.target.value)}
                  label="Index"
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

        {/* View Item */}

        <Box pt={1}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                View Name
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View item name by entering the item's index.
              </Typography>
              <form noValidate autoComplete="off" onSubmit={viewName}>
                <TextField
                  onChange={(e) => setItemIndex(e.target.value)}
                  label="Index"
                  fullWidth
                  required
                  margin="normal"
                  variant="standard"
                />
              </form>
              <Button
                style={buttonStyle}
                onClick={viewName}
                size="large"
                variant="contained"
              >
                Submit
              </Button>
              <Typography variant="body2" color="text.secondary">
                <b>Name:</b> {itemName}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box pt={1}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                View Price
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View item price by entering the item's index.
              </Typography>
              <form noValidate autoComplete="off" onSubmit={viewPrice}>
                <TextField
                  onChange={(e) => setItemIndex(e.target.value)}
                  label="Index"
                  fullWidth
                  required
                  margin="normal"
                  variant="standard"
                />
              </form>
              <Button
                style={buttonStyle}
                onClick={viewPrice}
                size="large"
                variant="contained"
              >
                Submit
              </Button>
              <Typography variant="body2" color="text.secondary">
                <b>Price:</b> {itemPrice}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box pt={1}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                View State
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View item state by entering the item's index.
              </Typography>
              <form noValidate autoComplete="off" onSubmit={viewState}>
                <TextField
                  onChange={(e) => setItemIndex(e.target.value)}
                  label="Index"
                  fullWidth
                  required
                  margin="normal"
                  variant="standard"
                />
              </form>
              <Button
                style={buttonStyle}
                onClick={viewState}
                size="large"
                variant="contained"
              >
                Submit
              </Button>
              <Typography variant="body2" color="text.secondary">
                <b>Status:</b> {itemState}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </Grid>
  );
}
