import { Alfajores, Celo } from "@/chains";
import type { Chain, Wallet } from "@rainbow-me/rainbowkit";
import { getWalletConnectConnector } from "@rainbow-me/rainbowkit";

// rainbowkit utils has it but doesn't export it :/
function isAndroid(): boolean {
    return (
        typeof navigator !== "undefined" && /android/i.test(navigator.userAgent)
    );
}

interface ValoraOptions {
    chains: Chain[];
    projectId: string;
}

export const Valora = ({
    chains = [Alfajores, Celo],
    projectId,
}: ValoraOptions): Wallet => ({
    id: "valora",
    name: "Valora",
    iconUrl:
        "https://registry.walletconnect.com/api/v1/logo/md/d01c7758d741b363e637a817a09bcf579feae4db9f5bb16f599fdd1f66e2f974",
    iconBackground: "#FFF",
    downloadUrls: {
        android:
            "https://play.google.com/store/apps/details?id=co.clabs.valora",
        ios: "https://apps.apple.com/app/id1520414263?mt=8",
        qrCode: "https://valoraapp.com/",
    },
    createConnector: () => {
        const connector = getWalletConnectConnector({
            chains,
            projectId,
        });
        return {
            connector,
            mobile: {
                getUri: async () => {
                    const { uri } = (await connector.getProvider()).connector;
                    return isAndroid()
                        ? uri
                        : // ideally this would use the WalletConnect registry, but this will do for now
                          `https://valoraapp.com/wc?uri=${encodeURIComponent(
                              uri
                          )}`;
                },
            },
            qrCode: {
                getUri: async () =>
                    (await connector.getProvider()).connector.uri,
                instructions: {
                    learnMoreUrl: "https://valoraapp.com/learn",
                    steps: [
                        {
                            description:
                                "The crypto wallet to buy, send, spend, earn, and collect NFTs on the Celo blockchain.",
                            step: "install",
                            title: "Open the Valora app",
                        },
                        {
                            description:
                                "After you scan, a connection prompt will appear for you to connect your wallet.",
                            step: "scan",
                            title: "Tap the scan button",
                        },
                    ],
                },
            },
        };
    },
});

export default Valora;
