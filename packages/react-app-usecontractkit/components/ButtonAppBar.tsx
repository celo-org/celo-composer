import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useContractKit } from "@celo-tools/use-contractkit";

export function ButtonAppBar() {
  const { address, network, connect, destroy } = useContractKit();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Celo Dapp Starter
          </Typography>
          {network && <Typography sx={{ mx: 2 }}>{network.name}</Typography>}
          {address && (
            <>
              <Typography sx={{ mx: 2 }}>{truncateAddress(address)}</Typography>
              <Button variant="outlined" color="inherit" onClick={destroy}>
                Disconnect
              </Button>
            </>
          )}
          {!address && (
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => connect().catch((e) => console.log(e))}
            >
              Connect wallet
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(38)}`;
}
