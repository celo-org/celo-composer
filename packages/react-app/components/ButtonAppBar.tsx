import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { useContractKit } from "@celo-tools/use-contractkit";
import { truncateAddress } from '../utils'

export function ButtonAppBar() {
  const { address, network, connect, destroy } = useContractKit();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Celo Dapp Starter
          </Typography>
          {network && <Chip label={network.name} color="secondary" />}
          {address && (
            <>
              <Chip
                label={truncateAddress(address)}
                color="info"
                onDelete={destroy}
                sx={{mx:1}}
              />
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
