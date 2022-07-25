import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { useCelo } from "@celo/react-celo";
import { truncateAddress, getWindowDimensions } from "@/utils";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { useThemeContext } from "@/contexts/userTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Polling } from "@/components";

function AccountDetails() {
  const { address, network, connect, destroy } = useCelo();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {network && <Chip label={network.name} color="secondary" />}
      {address && (
        <>
          <Chip
            label={truncateAddress(address)}
            color="info"
            onDelete={destroy}
            sx={{ mx: 1 }}
          />
          {!isMobile ? (
            <Button variant="outlined" color="inherit" onClick={destroy}>
              Disconnect
            </Button>
          ) : (
            ""
          )}
        </>
      )}
      {!address && (
        <Button
          color="inherit"
          variant="outlined"
          onClick={() => connect().catch(e => console.log(e))}
        >
          Connect wallet
        </Button>
      )}

    </>
  )
}

export function Header() {
  const { theme: themeContext, setTheme } = useThemeContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ flexGrow: 1 }}>
      {isMobile ? (
        <>
          <AppBar position="static">
            <Toolbar sx={{ gap: { md: 2, xs: 0.5 } }}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Celo Composer
              </Typography>
              <ThemeSwitcher
                sx={{ m: 1 }}
                onChange={e => setTheme(e.target.checked)}
                checked={themeContext}
              />
            </Toolbar>
          </AppBar>
          <AppBar color="primary" sx={{ top: "auto", bottom: 0 }}>
            <Toolbar sx={{ gap: { md: 2, xs: 0.5 } }}>
              <AccountDetails />
              <Polling/>
            </Toolbar>
          </AppBar>
        </>
      ) : (
        <AppBar position="static">
          <Toolbar sx={{ gap: { md: 2, xs: 0.5 } }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Celo Composer
            </Typography>
            <AccountDetails />
            <ThemeSwitcher
              sx={{ m: 1 }}
              onChange={e => setTheme(e.target.checked)}
              checked={themeContext}
            />
          </Toolbar>
        </AppBar>
      )}
    </Box>
  );
}
