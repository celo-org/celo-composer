"use client";

import { ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { celo } from "thirdweb/chains";

import { client } from "@/lib/thirdweb";
import { useEffect } from "react";
import { useWalletAddress } from "@/hooks/use-wallet-address";
import { fetchWithErrorHandlers } from "@/lib/utils";

export function WalletConnect() {
  const walletWithAuth = inAppWallet({
    auth: { options: ["google"] },
  });

  const walletAddress = useWalletAddress();

  useEffect(() => {
    if (!walletAddress) return;

    // Persist wallet to DB on connect
    fetchWithErrorHandlers("/api/wallet", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ walletAddress }),
    }).catch((err) => {
      // Non-blocking failure; log for debugging
      // eslint-disable-next-line no-console
      console.error("Failed to upsert wallet:", err);
    });
  }, [walletAddress]);

  return <ConnectButton client={client} wallets={[walletWithAuth]} chain={celo} />;
}
