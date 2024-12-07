import { ethers } from 'ethers';

export function formatEtherRounded(weiBalance: ethers.BigNumberish) {
	// Convert Wei to Ether using ethers.js
	const etherBalance = ethers.formatEther(weiBalance);

	// Round to 2 decimal places
	const roundedBalance = Math.round(parseFloat(etherBalance) * 100) / 100;

	return roundedBalance;
}
