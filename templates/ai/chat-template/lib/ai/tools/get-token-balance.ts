import { tool } from "ai";
import { z } from "zod";
import { createPublicClient, http, isAddress, formatUnits } from "viem";
import { celo } from "viem/chains";

const erc20Abi = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "balance", type: "uint256" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "decimals", type: "uint8" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "symbol", type: "string" }],
  },
] as const;

type Session = any;

interface GetTokenBalanceProps {
  session: Session;
}

export const getTokenBalance = ({ session }: GetTokenBalanceProps) =>
  tool({
    description:
      "Get ERC20 token balance for an address on Celo mainnet. Uses connected wallet by default.",
    inputSchema: z.object({
      token: z
        .string()
        .refine((val) => isAddress(val), { message: "Invalid token address" })
        .describe("ERC20 token contract address"),
      address: z
        .string()
        .refine((val) => isAddress(val), { message: "Invalid EVM address" })
        .describe("The wallet address to query")
        .optional(),
    }),
    execute: async ({ token, address }) => {
      const resolved = (address || session.user?.walletAddress) as
        | `0x${string}`
        | undefined;

      if (!resolved) {
        return {
          error:
            "No address provided and no connected wallet available. Please connect a wallet or provide an address.",
        } as const;
      }

      const client = createPublicClient({ chain: celo, transport: http() });

      const [raw, decimals, symbol] = await Promise.all([
        client.readContract({
          abi: erc20Abi,
          address: token as `0x${string}`,
          functionName: "balanceOf",
          args: [resolved],
        }) as Promise<bigint>,
        client.readContract({
          abi: erc20Abi,
          address: token as `0x${string}`,
          functionName: "decimals",
        }) as Promise<number>,
        client.readContract({
          abi: erc20Abi,
          address: token as `0x${string}`,
          functionName: "symbol",
        }) as Promise<string>,
      ]);

      const formatted = formatUnits(raw, decimals);

      return {
        chainId: client.chain.id,
        token,
        address: resolved,
        symbol,
        decimals,
        balanceWei: raw.toString(),
        balance: formatted,
      } as const;
    },
  });
