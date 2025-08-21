import { tool } from "ai";
import { z } from "zod";
import { createPublicClient, http, formatEther, isAddress } from "viem";
import { celo } from "viem/chains";

type Session = any;

interface GetBalanceProps {
  session: Session;
}

export const getBalance = ({ session }: GetBalanceProps) =>
  tool({
    description:
      "Get the CELO native token balance for an EVM address on Celo mainnet. Uses the connected wallet by default.",
    inputSchema: z.object({
      address: z
        .string()
        .refine((val) => isAddress(val), { message: "Invalid EVM address" })
        .describe("The wallet address to query")
        .optional(),
    }),
    execute: async ({ address }) => {
      const resolved = (address || session.user?.walletAddress) as
        | `0x${string}`
        | undefined;

      if (!resolved) {
        return {
          error:
            "No address provided and no connected wallet available. Please connect a wallet or provide an address.",
        };
      }

      const client = createPublicClient({
        chain: celo,
        transport: http(),
      });

      const balanceWei = await client.getBalance({ address: resolved });
      const balanceCelo = formatEther(balanceWei);

      return {
        address: resolved,
        chainId: client.chain.id,
        symbol: "CELO",
        balanceWei: balanceWei.toString(),
        balance: balanceCelo,
      };
    },
  });
