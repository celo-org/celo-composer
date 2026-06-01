"use client";

import { useAccount, useBalance } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const cUSD_ADDRESS = "0x765de816845861e75a25fca122bb6898b8b1282a";
const USDC_ADDRESS = "0xcebA9300f2b948710d2653dD7B07f33A8B32118C";
const USDT_ADDRESS = "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e";

function BalanceDisplay({ address, token, symbol }: { address: `0x${string}`, token?: `0x${string}`, symbol: string }) {
  const { data, isLoading } = useBalance({
    address,
    token,
  });

  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">{symbol}</span>
      <span className="font-medium">
        {isLoading ? "Loading..." : `${parseFloat(data?.formatted || '0').toFixed(4)}`}
      </span>
    </div>
  );
}

/**
 * Displays the connected wallet address and token balances for CELO, cUSD, USDC, and USDT.
 *
 * Token decimals reference:
 *   - cUSD  (0x765DE816845861e75A25fCA122bb6898B8B1282a): 18 decimals
 *   - USDC  (0xcebA9300f2b948710d2653dD7B07f33A8B32118C): 6 decimals
 *   - USDT  (0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e): 6 decimals
 *
 * wagmi's `useBalance` handles decimal formatting — the `formatted` field is
 * always in human-readable units regardless of the token's decimal count.
 */
export function UserBalance() {
  const { address, isConnected } = useAccount();

  if (!isConnected || !address) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Connected Wallet</CardTitle>
        <p className="text-sm text-muted-foreground truncate pt-1">{address}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 pt-2 border-t">
          <BalanceDisplay address={address} symbol="CELO" token={undefined} />
          <BalanceDisplay address={address} token={cUSD_ADDRESS} symbol="cUSD" />
          <BalanceDisplay address={address} token={USDC_ADDRESS} symbol="USDC" />
          <BalanceDisplay address={address} token={USDT_ADDRESS} symbol="USDT" />
        </div>
      </CardContent>
    </Card>
  );
}
