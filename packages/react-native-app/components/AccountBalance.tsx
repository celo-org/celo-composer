import { Text, View } from "./Themed";
import { newKit } from "@celo/contractkit";
import { useEffect, useState } from "react";
import { useWalletConnect } from "@walletconnect/react-native-dapp";

const AccountBalance = () => {
    let connector = useWalletConnect();
    const [balances, setBalances] = useState<any>(null);

    useEffect(() => {
        (async () => {
            let kit = newKit("https://alfajores-forno.celo-testnet.org");
            let balances = await kit.getTotalBalance(connector.accounts[0]);
            console.log(balances.CELO);
            Object.keys(balances).map((balance) =>
                console.log(balance, balances[balance].toString())
            );
            setBalances(balances);
        })();
    }, [connector]);

    return (
        <View>
            {balances
                ? Object.keys(balances).map((key) => (
                      <Text>{`${key}: ${balances[key]}`}</Text>
                  ))
                : null}
        </View>
    );
};

export default AccountBalance;
