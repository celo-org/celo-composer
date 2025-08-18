"use client";

import { useActiveAccount } from "thirdweb/react";
import { useEffect, useState } from "react";

export function useWalletAddress(): string | undefined {
  const account = useActiveAccount();
  const [cookieAddress, setCookieAddress] = useState<string | undefined>();

  useEffect(() => {
    try {
      if (typeof document !== "undefined") {
        const cookieHeader = document.cookie || "";
        const cookies = Object.fromEntries(
          cookieHeader
            .split(";")
            .map((p) => p.trim())
            .filter(Boolean)
            .map((p) => {
              const idx = p.indexOf("=");
              const k = idx >= 0 ? p.slice(0, idx) : p;
              const v = idx >= 0 ? decodeURIComponent(p.slice(idx + 1)) : "";
              return [k, v] as const;
            })
        );
        const addr = cookies.walletAddress as string | undefined;
        if (addr && /^0x[a-fA-F0-9]{40}$/.test(addr)) {
          setCookieAddress(addr.toLowerCase());
        }
      }
    } catch {
      // ignore cookie parse errors
    }
  }, []);

  return account?.address?.toLowerCase() ?? cookieAddress;
}
