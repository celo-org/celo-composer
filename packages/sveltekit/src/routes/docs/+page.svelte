<script lang="ts">
	const essentialDocs: {
		title: string;
		link: string;
	}[] = [
		{
			title: 'Wagmi',
			link: 'https://wagmi.sh/'
		},
		{
			title: 'Wallet Connect',
			link: ''
		},
		{
			title: 'Celo Core Developers',
			link: 'https://docs.celo.org/'
		},

		{
			title: 'Solidity',
			link: 'https://docs.soliditylang.org/'
		},
		{
			title: 'Sveltekit',
			link: 'https://svelte.dev/docs/kit/introduction'
		}
	];
</script>

<div class="w-full flex justify-center">
	<div class="w-[80%] grid grid-cols-1 md:grid-cols-4 my-5">
		{#each essentialDocs as item}
			<a href={item.link} target="_blank" rel="noreferrer">
				<div
					class=" shadow-md w-full flex items-center justify-center py-10 gap-x-4 hover:shadow-xl"
				>
					<p class="text-sm font-bold">{item.title}</p>
				</div>
			</a>
		{/each}
	</div>
</div>
