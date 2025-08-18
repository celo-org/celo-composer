"use client";

import { createThirdwebClient } from "thirdweb";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "";

if (!clientId && typeof window !== "undefined") {
  // eslint-disable-next-line no-console
  console.warn(
    "Missing NEXT_PUBLIC_THIRDWEB_CLIENT_ID. Add it to your environment to enable wallet connections."
  );
}

export const client = createThirdwebClient({ clientId });
