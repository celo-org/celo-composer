"use client";

import { useAccount, useBalance } from "wagmi";
import { celo, celoSepolia } from "wagmi/chains";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Stablecoins to show, per chain.
 *
 * Keyed by chain id on purpose. The wallet config ships both Celo Mainnet and
 * Celo Sepolia, so a component that hardcodes mainnet addresses issues balance
 * reads against contracts that do not exist on the testnet — which returns
 * zero rather than an error, and looks like an empty wallet. That is the first
 * thing someone testing against the faucet would hit.
 *
 * Exported so the rest of your app can reuse the same addresses instead of
 * copying them.
 *
 * Every symbol and decimal count below was read from the contract by calling
 * `symbol()`, `name()` and `decimals()` on the chain named, not copied from a
 * table. Two of them surprise people:
 *
 *   - `0x765DE8…282a` reports **USDm** ("Mento Dollar"). It is the token long
 *     known as cUSD, renamed on chain. MiniPay's own UI still says cUSD.
 *   - Both Tether contracts report **USD₮**, with U+20AE, not the ASCII "USDT".
 *
 * Mainnet and Sepolia carry the same three tokens, so a balance panel that
 * works against the faucet shows the same rows in production.
 */
export const TOKENS_BY_CHAIN: Record<
  number,
  { symbol: string; address: `0x${string}` }[]
> = {
  [celo.id]: [
    { symbol: "USDm", address: "0x765DE816845861e75A25fCA122bb6898B8B1282a" }, // 18 decimals, formerly cUSD
    { symbol: "USDC", address: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C" }, // 6 decimals
    { symbol: "USD₮", address: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e" }, // 6 decimals
  ],
  [celoSepolia.id]: [
    { symbol: "USDm", address: "0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b" }, // 18 decimals
    { symbol: "USDC", address: "0x01C5C0122039549AD1493B8220cABEdD739BC44E" }, // 6 decimals
    { symbol: "USD₮", address: "0xd077A400968890Eacc75cdc901F0356c943e4fDb" }, // 6 decimals
  ],
};

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
 * Displays the connected wallet address, its native CELO balance, and the
 * stablecoin balances known for the connected chain.
 *
 * wagmi's `useBalance` handles decimal formatting — `formatted` is always in
 * human-readable units regardless of the token's decimal count.
 */
export function UserBalance() {
  const { address, isConnected, chainId } = useAccount();

  if (!isConnected || !address) {
    return null;
  }

  const tokens = chainId ? TOKENS_BY_CHAIN[chainId] : undefined;

  return (
    <Card className="w-full max-w-md mx-auto mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Connected Wallet</CardTitle>
        <p className="text-sm text-muted-foreground truncate pt-1">{address}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 pt-2 border-t">
          <BalanceDisplay address={address} symbol="CELO" token={undefined} />
          {tokens?.map((token) => (
            <BalanceDisplay
              key={token.address}
              address={address}
              token={token.address}
              symbol={token.symbol}
            />
          ))}
        </div>
        {tokens === undefined && (
          // Silence here would read as "you have no tokens" rather than "this
          // app does not know this network".
          <p className="text-xs text-muted-foreground pt-2 border-t">
            No token list for chain {chainId}. Add it to{" "}
            <code>TOKENS_BY_CHAIN</code> to show balances here.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
