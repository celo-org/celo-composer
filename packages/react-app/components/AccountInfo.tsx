import * as React from "react";
import { Divider, Grid, Typography, Link } from "@mui/material";

import { useContractKit } from "@celo-tools/use-contractkit";
import { useEffect, useState } from "react";
import { truncateAddress } from "@/utils";

import redstone from "redstone-api"

export function AccountInfo() {
  const { kit, address, network } = useContractKit();
  const [balance, setBalance] = useState({
    CELO: {
      raw: '0', usd: '0'
    },
    cEUR: {
      raw: '0'
    },
    cUSD: {
      raw: '0'
    }
  });

  async function fetchBalance() {
    const { CELO, cUSD, cEUR } = await kit.getTotalBalance(address);
    const celoAmount = kit.web3.utils.fromWei(CELO.toString(), 'ether');
    const celoUsdPrice = await redstone.getPrice('CELO');

    setBalance({
      CELO: {
        raw: kit.web3.utils.fromWei(CELO.toString(), 'ether'),
        usd: (celoUsdPrice.value * (+celoAmount)).toString()
      },
      cEUR: {
        raw: kit.web3.utils.fromWei(cUSD.toString(), 'ether'),
      },
      cUSD: {
        raw: kit.web3.utils.fromWei(cEUR.toString(), 'ether'),
      }
    })
  }

  useEffect(() => {
    if (address) {
      fetchBalance()
    }
  }, [network, address])

  const addressLink = `${network.explorer}/address/${address}`

  return (
    <Grid sx={{ m: 1 }} container justifyContent="center">
      <Grid item sm={6} xs={12} sx={{ m: 2 }}>
        <Typography variant="h5">Account Info: </Typography>
        {address && (
          <Link href={addressLink} target="_blank">
            {truncateAddress(address)}
          </Link>
        )}
        <Divider sx={{ m: 1 }} />
        <Typography variant="h6">Balance:</Typography>
        <Typography sx={{ m: 1, marginLeft: 0, wordWrap: "break-word" }}>
          {`${balance.CELO.raw} CELO ($${balance.CELO.usd})`}
          <br />
          {`${balance.cUSD.raw} cUSD`}
          <br />
          {`${balance.cEUR.raw} cEUR`}
        </Typography>
      </Grid>
    </Grid>
  );
}
