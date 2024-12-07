<!-- THIS FILE CAN BE REMOVED, IT SERVES ONLY TO DEMO BEST PRACTICES -->
<script lang="ts">
	import { chainId, account } from 'lib/web3';
	// import { chainId, account } from '$lib/client';
</script>

<div class="w-full">
	{#if $account.address}
		<div class="card space-x-20 py-4">
			{#if $account.chain}
				<div class="grid grid-cols-2 text-center">
					<div>Chain ID: <span class="font-bold"> {$chainId}</span></div>

					<div>Chain Name: <span class="font-bold"> {$account.chain?.name}</span></div>
					<div>
						Chain Native Currency: <span class="font-bold">
							{$account.chain?.nativeCurrency.decimals}</span
						>
					</div>
					<div>
						Chain Native Decimals: <span class="font-bold">
							{$account.chain?.nativeCurrency.name}</span
						>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
