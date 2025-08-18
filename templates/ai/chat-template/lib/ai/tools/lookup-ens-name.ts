import { tool } from "ai";
import { z } from "zod";
import { createPublicClient, http, isAddress } from "viem";
import { mainnet } from "viem/chains";

export const lookupENSName = () =>
  tool({
    description: "Reverse-resolve an address to its primary ENS name on Ethereum mainnet.",
    inputSchema: z.object({
      address: z
        .string()
        .refine((v) => isAddress(v), { message: "Invalid EVM address" })
        .describe("The address to lookup"),
    }),
    execute: async ({ address }) => {
      const client = createPublicClient({ chain: mainnet, transport: http() });
      const name = await client.getEnsName({ address: address as `0x${string}` });
      return { address, name: name ?? null } as const;
    },
  });
