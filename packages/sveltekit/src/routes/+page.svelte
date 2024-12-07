<script lang="ts">
	import { Button, Wallet, Network, SignMessage } from 'components';
	import { account, modal, getBalance, disconnect } from 'lib/web3';
	import { browser } from '$app/environment';

	$: accountAddress = $account.address;
	// let accountAddress = $state($account.address);
	$: isMiniPay = false;

	if (browser) {
		if (window && window.ethereum) {
			// User has a injected wallet

			if (window.ethereum.isMiniPay) {
				// User is using Minipay
				isMiniPay = true;
				// Requesting account addresses
				let accounts = window.ethereum.request({
					method: 'eth_requestAccounts',
					params: []
				});

				// Injected wallets inject all available addresses,
				// to comply with API Minipay injects one address but in the form of array
				console.log(accounts[0]);
				// @ts-ignore
				// accountAddress = $account.address;
				accountAddress = accounts[0];
			}

			// User is not using MiniPay
		}
	}

	function connectWallet() {
		modal.open({ view: 'Connect' });
	}
</script>

<div class="md:md-0 w-full flex items-center justify-center">
	<div class="w-[75%] my-5 flex items-center justify-center flex-col">
		<div class="h1">There you go... a canvas for your next Celo project!</div>
		{#if $account.isConnected || isMiniPay}
			<a href="/dashboard" class="my-4"><p>Dashboard</p></a>
			<div class="pt-10 md:pt-0 mx-0 flex flex-col items-center justify-center">
				<Button onclick={disconnect} variant="destructive">Disconnect</Button>
				<p>Your address:</p>
				<p>{$account.address}</p>
				Extra wallet metadata available when present
				<Network />
				<Wallet />
				<!-- <Wallet />
				<SignMessage /> -->
			</div>
		{:else}
			<Button variant="secondary" onclick={connectWallet}>Connect</Button>
			<!-- <button on:click={}>Connect</button> -->
		{/if}
	</div>
</div>
