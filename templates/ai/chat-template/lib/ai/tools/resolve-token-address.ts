import { tool } from "ai";
import { z } from "zod";
import { getAddress } from "viem";

// Canonical symbol-to-address mapping on Celo mainnet
const TOKEN_MAP = {
  CELO: "0x471EcE3750Da237f93B8E339c536989b8978a438",
  cUSD: "0x765de816845861e75a25fca122bb6898b8b1282a",
  cEURO: "0xd8763cba276a3738e6de85b4b3bf5fded6d6ca73",
  cREAL: "0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787",
  cKES: "0x456a3D042C0DbD3db53D5489e98dFb038553B0d0",
  PUSO: "0x105d4A9306D2E55a71d2Eb95B81553AE1dC20d7B",
  cCOP: "0x8A567e2aE79CA692Bd748aB832081C45de4041eA",
  USDT: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
  USDC: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
  USDGLO: "0x4F604735c1cF31399C6E711D5962b2B3E0225AD3",
  WETH: "0xD221812de1BD094f35587EE8E174B07B6167D9Af",
} as const;

const SUPPORTED = Object.keys(TOKEN_MAP).join(", ");

export const resolveTokenAddress = () =>
  tool({
    // Description is dynamic to inform the LLM about supported symbols
    description: `Resolve a Celo token symbol to its ERC-20 contract address on Celo mainnet. Supported symbols: ${SUPPORTED}.` ,
    // Accept either exact case (e.g., cUSD) or case-insensitive match
    inputSchema: z.object({
      symbol: z
        .string()
        .min(2)
        .max(12)
        .describe(`Token symbol to resolve. Examples: ${SUPPORTED}`),
    }),
    execute: async ({ symbol }) => {
      const entries = Object.entries(TOKEN_MAP) as Array<[
        keyof typeof TOKEN_MAP,
        string
      ]>;
      const found = entries.find(([sym]) => sym.toLowerCase() === symbol.toLowerCase());
      if (!found) {
        return {
          error: `Unsupported symbol: ${symbol}. Supported: ${SUPPORTED}`,
        } as const;
      }
      const [canonicalSymbol, addr] = found;
      // Return checksum address for display consistency
      const checksum = getAddress(addr as `0x${string}`);
      return {
        chain: "celo-mainnet",
        symbol: canonicalSymbol,
        address: checksum,
      } as const;
    },
  });
