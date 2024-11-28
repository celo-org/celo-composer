<!-- THIS FILE CAN BE REMOVED, IT SERVES ONLY TO DEMO BEST PRACTICES -->
<script lang="ts">
	import { signMessage } from '@wagmi/core';
	// import { signMessage } from '@wagmi/core/dist/types/exports';
	import toast from 'svelte-french-toast';
	import { wagmiConfig } from '$lib/web3';

	let signature: string | undefined;
	let label: string = 'Sign Message';

	async function handleSign() {
		label = 'Signing...';
		signature = '_';

		try {
			const _signature = await signMessage(wagmiConfig, {
				message: 'WalletConnect message'
			});

			//@ts-expect-error Wagmi Type bug
			if (_signature !== 'null') {
				signature = _signature;
				toast.success('Message signed successfully');
			} else {
				toast.error('The signature was rejected');
				signature = '_ personal_sign';
			}
		} catch (error) {
			toast.error((error as Error).message);
		} finally {
			label = 'Sign Message';
		}
	}
</script>

<div class="card py-2">
	<div class="space-y-4">
		<h3 class="text-bold text-md">Sign Message</h3>
		<p class="text-left text-sm">
			Result: <span class="text-sm"> {signature ?? ''} </span>
		</p>
		<button class="btn variant-ghost-primary w-full" on:click={handleSign}>{label}</button>
	</div>
</div>
