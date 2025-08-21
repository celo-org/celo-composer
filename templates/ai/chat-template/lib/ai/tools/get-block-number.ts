import { tool } from "ai";
import { z } from "zod";
import { createPublicClient, http } from "viem";
import { celo } from "viem/chains";

export const getBlockNumber = () =>
  tool({
    description: "Get the latest block number on Celo mainnet.",
    inputSchema: z.object({}),
    execute: async () => {
      const client = createPublicClient({ chain: celo, transport: http() });
      const blockNumber = await client.getBlockNumber();
      return {
        chainId: client.chain.id,
        blockNumber: blockNumber.toString(),
      };
    },
  });
