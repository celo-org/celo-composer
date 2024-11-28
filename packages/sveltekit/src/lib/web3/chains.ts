import { fallback, http, type Transport } from 'viem';
import type { ConfiguredChainId } from './client';
import { celo, celoAlfajores } from 'viem/chains';

export const chains = [celo, celoAlfajores] as const;
//#endregion
export const transports = chains.reduce(
	(acc, { id }) => {
		// const url = rpcUrls[id];
		const url = 'rpcUrls[id]';
		acc[id] = url ? fallback([http(url), http()]) : http();
		return acc;
	},
	{} as Record<ConfiguredChainId, Transport>
);
