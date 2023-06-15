import React from "react";
import { useWeb3Modal, Web3Button } from "@web3modal/react-native";
import { ethers } from "ethers";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";

import type {
    AccountAction,
    FormattedRpcError,
    FormattedRpcResponse,
    RpcRequestParams,
} from "../types";
import { getFilterChanges, readContract } from "../utils/ContractUtil";
import {
    ethSign,
    sendTransaction,
    signMessage,
    signTransaction,
    signTypedData,
} from "../utils/MethodUtil";
import { RequestModal } from "./RequestModal";
import Button from "./Button";

export function BlockchainActions() {
    const [rpcResponse, setRpcResponse] = useState<FormattedRpcResponse>();
    const [rpcError, setRpcError] = useState<FormattedRpcError>();
    const { provider } = useWeb3Modal();

    const web3Provider = useMemo(
        () =>
            provider ? new ethers.providers.Web3Provider(provider) : undefined,
        [provider]
    );

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const onModalClose = () => {
        setModalVisible(false);
        setLoading(false);
        setRpcResponse(undefined);
        setRpcError(undefined);
    };

    const getEthereumActions = () => {
        const wrapRpcRequest =
            (
                method: string,
                rpcRequest: ({
                    web3Provider,
                    method,
                }: RpcRequestParams) => Promise<FormattedRpcResponse>
            ) =>
            async () => {
                if (!web3Provider) {
                    return;
                }

                setRpcResponse(undefined);
                setRpcError(undefined);
                setModalVisible(true);
                try {
                    setLoading(true);
                    const result = await rpcRequest({ web3Provider, method });
                    setRpcResponse(result);
                    setRpcError(undefined);
                } catch (error: any) {
                    console.error("RPC request failed:", error);
                    setRpcResponse(undefined);
                    setRpcError({ method, error: error?.message });
                } finally {
                    setLoading(false);
                }
            };

        const actions: AccountAction[] = [
            {
                method: "eth_sendTransaction",
                callback: wrapRpcRequest(
                    "eth_sendTransaction",
                    sendTransaction
                ),
            },
            {
                method: "eth_signTransaction",
                callback: wrapRpcRequest(
                    "eth_signTransaction",
                    signTransaction
                ),
            },
            {
                method: "personal_sign",
                callback: wrapRpcRequest("personal_sign", signMessage),
            },
            {
                method: "eth_sign (standard)",
                callback: wrapRpcRequest("eth_sign (standard)", ethSign),
            },
            {
                method: "eth_signTypedData",
                callback: wrapRpcRequest("eth_signTypedData", signTypedData),
            },
            {
                method: "read contract (mainnet)",
                callback: wrapRpcRequest("read contract", readContract),
            },
            {
                method: "filter contract (mainnet)",
                callback: wrapRpcRequest("filter contract", getFilterChanges),
            },
        ];
        return actions;
    };

    return (
        <>
            <FlatList
                data={getEthereumActions()}
                ListHeaderComponent={
                    <Web3Button
                        style={[
                            { backgroundColor: "black" },
                            {
                                paddingHorizontal: 15,
                                paddingVertical: 7,
                                marginTop: 10,
                                borderRadius: 5,
                            },
                        ]}
                    />
                }
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <Button
                        style={[
                            { backgroundColor: "black" },
                            {
                                paddingHorizontal: 15,
                                paddingVertical: 7,
                                marginTop: 10,
                                borderRadius: 5,
                            },
                        ]}
                        key={item.method}
                        onPress={() => item.callback(web3Provider)}
                    >
                        <Text style={styles.buttonText}>{item.method}</Text>
                    </Button>
                )}
            />
            <RequestModal
                rpcResponse={rpcResponse}
                rpcError={rpcError}
                isLoading={loading}
                isVisible={modalVisible}
                onClose={onModalClose}
            />
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#3396FF",
        borderRadius: 20,
        width: 200,
        height: 50,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.1)",
        marginTop: 4,
    },
    buttonText: {
        color: "white",
        fontWeight: "700",
    },
    modalContainer: {
        padding: 16,
        backgroundColor: "white",
        borderRadius: 8,
    },
    title: {
        fontWeight: "600",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontWeight: "bold",
        marginVertical: 4,
    },
    responseText: {
        fontWeight: "300",
    },
    listContent: {
        alignItems: "center",
    },
    web3Button: {
        width: 200,
    },
});
