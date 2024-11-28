import { writable } from 'svelte/store';
import type { EthereumClient } from '@web3modal/ethereum';
import type { Web3Modal } from '@web3modal/html';
import type { PublicClient } from '../node_modules/viem';

export const ethereumClient = writable<EthereumClient>();
export const web3Modal = writable<Web3Modal>();
export const publicClient = writable<PublicClient>();
