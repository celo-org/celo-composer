"use client";

import type { ReactNode } from "react";
import { ThirdwebProvider } from "thirdweb/react";

export function ThirdwebClientProvider({ children }: { children: ReactNode }) {
  return <ThirdwebProvider>{children}</ThirdwebProvider>;
}
