import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
    metaMaskWallet,
    walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { Valora } from "@/wallets";

import type { Chain } from "@rainbow-me/rainbowkit";

export default function connectors({
    chains,
    appName,
    projectId,
}: {
    chains: Chain[];
    projectId: string;
    appName?: string;
}) {
    return connectorsForWallets([
        {
            groupName: "Celo Only",
            wallets: [Valora({ chains, projectId })],
        },
        {
            groupName: "Supports Celo",
            wallets: [
                metaMaskWallet({ chains, projectId }),
                walletConnectWallet({ chains, projectId }),
            ],
        },
    ]);
}
