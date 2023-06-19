import {numberToHex, sanitizeHex, utf8ToHex} from '@walletconnect/encoding';
import {ethers, TypedDataDomain, TypedDataField} from 'ethers';
import {recoverAddress} from '@ethersproject/transactions';
import {hashMessage} from '@ethersproject/hash';
import type {Bytes, SignatureLike} from '@ethersproject/bytes';
import {getTypedDataExample} from '../constants/eip712';
import {_TypedDataEncoder} from 'ethers/lib/utils';
import type {FormattedRpcResponse, RpcRequestParams} from '../types';

export function verifyMessage(
  message: Bytes | string,
  signature: SignatureLike,
): string {
  return recoverAddress(hashMessage(message), signature);
}

function verifyTypedData(
  domain: TypedDataDomain,
  types: Record<string, Array<TypedDataField>>,
  value: Record<string, any>,
  signature: SignatureLike,
): string {
  return recoverAddress(
    _TypedDataEncoder.hash(domain, types, value),
    signature,
  );
}

const verifyEip155MessageSignature = (
  message: string,
  signature: string,
  address: string,
) => verifyMessage(message, signature).toLowerCase() === address.toLowerCase();

export const signMessage = async ({
  web3Provider,
  method,
}: RpcRequestParams): Promise<FormattedRpcResponse> => {
  if (!web3Provider) {
    throw new Error('web3Provider not connected');
  }
  const msg = 'Hello World'; // Message to sign
  const hexMsg = utf8ToHex(msg, true);
  const [address] = await web3Provider.listAccounts();
  if (!address) {
    throw new Error('No address found');
  }

  const signature = await web3Provider.send('personal_sign', [hexMsg, address]);
  const valid = verifyEip155MessageSignature(msg, signature, address);
  return {
    method,
    address,
    valid,
    result: signature,
  };
};

export const ethSign = async ({
  web3Provider,
  method,
}: RpcRequestParams): Promise<FormattedRpcResponse> => {
  if (!web3Provider) {
    throw new Error('web3Provider not connected');
  }
  const msg = 'hello world'; // Message to sign
  const hexMsg = utf8ToHex(msg, true);
  const [address] = await web3Provider.listAccounts();

  if (!address) {
    throw new Error('No address found');
  }

  const signature = await web3Provider.send('eth_sign', [address, hexMsg]);
  const valid = verifyEip155MessageSignature(msg, signature, address);
  return {
    method,
    address,
    valid,
    result: signature,
  };
};

export const signTypedData = async ({
  web3Provider,
  method,
}: RpcRequestParams): Promise<FormattedRpcResponse> => {
  if (!web3Provider) {
    throw new Error('web3Provider not connected');
  }

  const {chainId} = await web3Provider.getNetwork();
  const message = getTypedDataExample(chainId);

  const [address] = await web3Provider.listAccounts();

  if (!address) {
    throw new Error('No address found');
  }

  // eth_signTypedData params
  const params = [address, JSON.stringify(message)];

  // send message
  const signature = await web3Provider.send('eth_signTypedData', params);

  // Separate `EIP712Domain` type from remaining types to verify, otherwise `ethers.utils.verifyTypedData`
  // will throw due to "unused" `EIP712Domain` type.
  // See: https://github.com/ethers-io/ethers.js/issues/687#issuecomment-714069471

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    EIP712Domain,
    ...nonDomainTypes
  }: Record<string, TypedDataField[]> = message.types;

  const valid =
    verifyTypedData(
      message.domain,
      nonDomainTypes,
      message.message,
      signature,
    ).toLowerCase() === address?.toLowerCase();
  return {
    method,
    address,
    valid,
    result: signature,
  };
};

export const sendTransaction = async ({
  web3Provider,
  method,
}: RpcRequestParams): Promise<FormattedRpcResponse> => {
  if (!web3Provider) {
    throw new Error('web3Provider not connected');
  }

  // Get the signer from the UniversalProvider
  const signer = web3Provider.getSigner();

  const {chainId} = await web3Provider.getNetwork();

  // Transaction details
  const amount = ethers.utils.parseEther('0.0001');
  const address = '0x0000000000000000000000000000000000000000';
  const transaction = {
    to: address,
    value: amount,
    chainId,
  };

  // Send the transaction using the signer
  const txResponse = await signer.sendTransaction(transaction);
  const transactionHash = txResponse.hash;
  console.log('transactionHash is ' + transactionHash);

  // Wait for the transaction to be mined (optional)
  const receipt = await txResponse.wait();
  console.log('Transaction was mined in block:', receipt.blockNumber);

  return {
    method,
    address,
    valid: true,
    result: transactionHash,
  };
};

export const signTransaction = async ({
  web3Provider,
  method,
}: RpcRequestParams): Promise<FormattedRpcResponse> => {
  if (!web3Provider) {
    throw new Error('web3Provider not connected');
  }
  const [address] = await web3Provider.listAccounts();
  if (!address) {
    throw new Error('No address found');
  }

  const tx = {
    from: address,
    to: address,
    data: '0x',
    value: sanitizeHex(numberToHex(0)),
  };

  const signedTx = await web3Provider.send('eth_signTransaction', [tx]);

  return {
    method,
    address,
    valid: true,
    result: signedTx,
  };
};
