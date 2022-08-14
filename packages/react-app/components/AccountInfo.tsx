import * as React from "react";
import {
  Divider,
  Grid,
  Typography,
  Link,
  ButtonGroup,
  Button,
  CircularProgress,
} from "@mui/material";

import { useCelo } from "@celo/react-celo";
import { useEffect, useState } from "react";
import { truncateAddress } from "@/utils";
import {utils as etherUtil, BigNumber} from "ethers";

import redstone from "redstone-api";
import web3 from "web3";

import AccountTable, { BaseCurrency } from "./AccountTable";

async function getPrices() {
  try {
    return {
      CELO: await redstone.getPrice("CELO"),
      EUR: await redstone.getPrice("EUR"),
      ETH: await redstone.getPrice("ETH"),
    };
  } catch (error) {
    console.log(error);
    return {
      CELO: 0,
      EUR: 0,
      ETH: 0,
    };
  }
}

export function AccountInfo() {
  const { kit, address, network } = useCelo();
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [baseCurrency, setBaseCurrency] = useState(BaseCurrency.USD);

  const [balance, setBalance] = useState({
    CELO: {
      raw: "0",
      base: 0,
      exchange: 1,
    },
    cEUR: {
      raw: "0",
      base: 0,
      exchange: 1,
    },
    cUSD: {
      raw: "0",
      base: 0,
      exchange: 1,
    },
    cREAL: {
      raw: "0",
    },
  });

  async function fetchBalance() {
    const { CELO, cUSD, cEUR, cREAL } = await kit.getTotalBalance(address);
    const celoAmount = etherUtil.formatUnits(CELO.toFixed());
    const ceurAmount = etherUtil.formatUnits(cEUR.toFixed());
    const cusdAmount = etherUtil.formatUnits(cUSD.toFixed());
    const crealAmount = etherUtil.formatUnits(cREAL.toFixed());
    const { CELO: celoUsdPrice, EUR: eurUsdPrice, ETH: ethUsdPrice } = await getPrices();
    const scale = (
      baseCurrency === BaseCurrency.USD
        ? 1
        : baseCurrency === BaseCurrency.EUR
          ? 1.0 / eurUsdPrice.value
          : baseCurrency === BaseCurrency.ETH
            ? 1.0 / ethUsdPrice.value
            : 1.0 / celoUsdPrice.value
    );

    setBalance({
      CELO: {
        raw: celoAmount,
        base: (celoUsdPrice.value * (+celoAmount) * scale),
        exchange: celoUsdPrice.value * scale
      },
      cEUR: {
        raw: ceurAmount,
        base: (eurUsdPrice.value * (+ceurAmount) * scale),
        exchange: eurUsdPrice.value * scale
      },
      cUSD: {
        raw: cusdAmount,
        base: (+cusdAmount * scale),
        exchange: scale
      },
      cREAL: {
        raw: crealAmount,
      }
    })
    setLoadingBalance(false)
  }

  useEffect(() => {
    if (address) {
      setLoadingBalance(true);
      fetchBalance();
    }
  }, [network, address, baseCurrency]);

  const addressLink = `${network.explorer}/address/${address}`;

  return (
    <Grid container justifyContent="left">
      <Grid item sm={12} xs={12} sx={{ m: 2 }}>
        <Typography variant="h5">Account Info: </Typography>
        {address && (
          <Link href={addressLink} target="_blank">
            {truncateAddress(address)}
          </Link>
        )}
        <Divider sx={{ m: 1 }} />
        <Typography variant="h6">Balance:</Typography>
          { loadingBalance ? <CircularProgress /> : (
              <AccountTable
                  rows={[
                      { token: BaseCurrency.CELO, balance: +balance.CELO.raw, value: +balance.CELO.base, exchange: balance.CELO.exchange, baseCurrency },
                      { token: BaseCurrency.USD, balance: +balance.cUSD.raw, value: +balance.cUSD.base, exchange: balance.cUSD.exchange, baseCurrency },
                      { token: BaseCurrency.EUR, balance: +balance.cEUR.raw, value: +balance.cEUR.base, exchange: balance.cEUR.exchange, baseCurrency }
                  ]}
              />
          )}
        <Typography variant="h6">Select base currency for display:</Typography>
        <ButtonGroup
          variant="outlined"
          aria-label="outlined primary button group"
        >
          {[
            BaseCurrency.USD,
            BaseCurrency.EUR,
            BaseCurrency.ETH,
            BaseCurrency.CELO,
          ].map((currency) => (
            <Button
              key={currency}
              onClick={() => setBaseCurrency(currency)}
              variant={currency === baseCurrency ? "contained" : undefined}
            >
              {currency}
            </Button>
          ))}
        </ButtonGroup>
        <Typography
          sx={{
            m: 1,
            marginLeft: 0,
            wordWrap: "break-word",
            fontSize: "0.7em",
          }}
        >
          * Value estimates from{" "}
          <a href="https://github.com/redstone-finance/redstone-api">
            Redstone API
          </a>
          . Actual values may vary slightly.
        </Typography>
      </Grid>
    </Grid>
  );
}
