import { tool } from "ai";
import { z } from "zod";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

export const resolveENSName = () =>
  tool({
    description: "Resolve an ENS name to an address on Ethereum mainnet.",
    inputSchema: z.object({
      name: z.string().min(3).describe("ENS name, e.g. vitalik.eth"),
    }),
    execute: async ({ name }) => {
      const client = createPublicClient({ chain: mainnet, transport: http() });
      const address = await client.getEnsAddress({ name });
      if (!address) {
        return { name, address: null } as const;
      }
      return { name, address } as const;
    },
  });
