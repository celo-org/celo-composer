import { trimLeading0x } from '@celo/base';
import { newKitFromWeb3, StableToken } from '@celo/contractkit';
import { EIP712TypedData } from '@celo/utils/lib/sign-typed-data-utils';
import {
  AccountsProposal,
  CLIENT_EVENTS,
  ComputeSharedSecretProposal,
  DecryptProposal,
  PersonalSignProposal,
  Request,
  SessionProposal,
  SignTransactionProposal,
  SignTypedSignProposal,
  SupportedMethods,
} from '@celo/wallet-walletconnect-v1';
import { Alfajores } from '@celo-tools/use-contractkit';
import WalletConnect from '@walletconnect/client-v1';
import { BigNumber } from 'bignumber.js';
import Head from 'next/head';
import { createRef, useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import Web3 from 'web3';
import { TransactionConfig } from 'web3-core';

import { PrimaryButton } from '../components';

const WALLET_ID = 'test-wallet-clabs';

const web3 = new Web3(Alfajores.rpcUrl);
const kit = newKitFromWeb3(web3);
const account = web3.eth.accounts.privateKeyToAccount(
  'e2d7138baa3a5600ac37984e40981591d7cf857bcadd7dc6f7d14023a17b0787'
);
kit.addAccount(account.privateKey);
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const wallet = kit.getWallet()!;

const defaultSummary = {
  name: '',
  address: '',
  wallet: '',
  celo: new BigNumber(0),
  cusd: new BigNumber(0),
  ceur: new BigNumber(0),
};

function truncateAddress(address: string) {
  return `${address.slice(0, 8)}...${address.slice(36)}`;
}

export default function Wallet(): React.ReactElement {
  const inputRef = createRef<HTMLInputElement>();
  const [error, setError] = useState<string | null>(null);
  const [connector, setConnector] = useState<WalletConnect | null>(null);
  const [summary, setSummary] = useState(defaultSummary);
  const [approvalData, setApprovalData] = useState<{
    accept: () => void;
    reject: () => void;
    meta: {
      title: string;
      raw: unknown;
    };
  } | null>(null);

  const fetchSummary = useCallback(async () => {
    const [accounts, goldToken, cUSD, cEUR] = await Promise.all([
      kit.contracts.getAccounts(),
      kit.contracts.getGoldToken(),
      kit.contracts.getStableToken(StableToken.cUSD),
      kit.contracts.getStableToken(StableToken.cEUR),
    ]);

    const [summary, celo, cusd, ceur] = await Promise.all([
      accounts.getAccountSummary(account.address).catch((e) => {
        console.error(e);
        return defaultSummary;
      }),
      goldToken.balanceOf(account.address),
      cUSD.balanceOf(account.address),
      cEUR.balanceOf(account.address),
    ]);

    setSummary({
      ...summary,
      celo,
      cusd,
      ceur,
    });
  }, []);

  const connect = useCallback(() => {
    if (!inputRef.current) {
      return;
    }

    const uri = inputRef.current.value.trim();
    if (!uri || !uri.startsWith('wc:')) {
      setError('Bad wc uri, should be in the form of "wc:…"');
      return;
    }
    setError(null);

    // Create connector
    const _connector = new WalletConnect({
      uri,
      clientMeta: {
        description: 'WalletConnect Developer App',
        url: 'https://walletconnect.org',
        icons: ['https://walletconnect.org/walletconnect-logo.png'],
        name: 'WalletConnect',
      },
      storageId: WALLET_ID,
    });
    setConnector(_connector);
  }, [inputRef]);

  const approveConnection = useCallback(() => {
    if (!connector) return;
    connector.approveSession({
      chainId: Alfajores.chainId,
      accounts: [account.address],
      networkId: 0,
      rpcUrl: Alfajores.rpcUrl,
    });
    setApprovalData(null);
  }, [connector]);

  const rejectConnection = useCallback(async (): Promise<void> => {
    if (!connector) return;
    if (!connector.session?.connected) {
      connector.rejectSession({
        message: 'Test wallet rejected the connection manually',
      });
      setApprovalData(null);
    } else {
      await connector.killSession();
    }

    setConnector(null);
  }, [connector]);

  const reject = useCallback(
    (id: number, message: string) => {
      if (!connector) return;

      connector.rejectRequest({
        id,
        error: {
          message,
        },
      });
    },
    [connector]
  );

  const signTransaction = useCallback(
    async (id: number, params: TransactionConfig) => {
      if (!connector) return;

      await wallet
        .signTransaction({ ...params, chainId: Alfajores.chainId })
        .then((result) => {
          connector.approveRequest({
            id,
            result,
          });
        });

      setTimeout(() => void fetchSummary(), 5000);
      setApprovalData(null);
    },
    [connector, fetchSummary]
  );

  const personalSign = useCallback(
    async (id: number, message: string) => {
      if (!connector) return;

      const result = await wallet.signPersonalMessage(account.address, message);
      connector.approveRequest({
        id,
        result,
      });
      setApprovalData(null);
    },
    [connector]
  );

  const signTypedData = useCallback(
    async (id: number, data: EIP712TypedData) => {
      if (!connector) return;

      const result = await wallet.signTypedData(account.address, data);

      connector.approveRequest({
        id,
        result: result,
      });
      setApprovalData(null);
    },
    [connector]
  );

  const accounts = useCallback(
    (id: number) => {
      if (!connector) return;

      const result = wallet.getAccounts();
      connector.approveRequest({
        id,
        result,
      });
      setApprovalData(null);
    },
    [connector]
  );

  const decrypt = useCallback(
    async (id: number, data: string) => {
      if (!connector) return;

      const result = await wallet.decrypt(
        account.address,
        Buffer.from(data, 'hex')
      );

      connector.approveRequest({
        id,
        result: result,
      });
      setApprovalData(null);
    },
    [connector]
  );

  const computeSharedSecret = useCallback(
    async (id: number, publicKey: string) => {
      if (!connector) return;

      const result = await wallet.computeSharedSecret(
        account.address,
        publicKey
      );

      connector.approveRequest({
        id,
        result: result,
      });
      setApprovalData(null);
    },
    [connector]
  );

  const handleNewRequests = useCallback(
    (
      error: Error | null,
      payload:
        | AccountsProposal
        | SignTransactionProposal
        | PersonalSignProposal
        | SignTypedSignProposal
        | DecryptProposal
        | ComputeSharedSecretProposal
    ): void => {
      if (error) return setError(error.message);

      console.log('call_request', payload);
      let decodedMessage: string;

      switch (payload.method) {
        case SupportedMethods.accounts:
          return setApprovalData({
            accept: () => accounts(payload.id),
            reject: () =>
              reject(
                payload.id,
                `User rejected computeSharedSecret ${payload.id}`
              ),
            meta: {
              title: `Send all accounts of this wallet?`,
              raw: payload,
            },
          });
          break;
        case SupportedMethods.signTransaction:
          return setApprovalData({
            accept: () => signTransaction(payload.id, payload.params[0]),
            reject: () =>
              reject(payload.id, `User rejected transaction ${payload.id}`),
            meta: {
              // TODO: Find out how the value can be determined from the payload// eslint-disable-next-line
              // eslint-disable-next-line
              title: `Transfer ${payload.params[0].value} CELO from ${payload.params[0].from} to ${payload.params[0].to}`,
              raw: payload,
            },
          });
        case SupportedMethods.personalSign:
          decodedMessage = Buffer.from(
            trimLeading0x(payload.params[0]),
            'hex'
          ).toString('utf8');
          return setApprovalData({
            accept: () => personalSign(payload.id, payload.params[0]),
            reject: () =>
              reject(payload.id, `User rejected personalSign ${payload.id}`),
            meta: {
              title: `Sign this message: ${decodedMessage}`,
              raw: payload,
            },
          });
        case SupportedMethods.signTypedData:
          return setApprovalData({
            accept: () =>
              signTypedData(
                payload.id,
                JSON.parse(payload.params[1]) as EIP712TypedData
              ),
            reject: () =>
              reject(payload.id, `User rejected signTypedData ${payload.id}`),
            meta: {
              title: `Sign this typed data`,
              raw: payload,
            },
          });
        case SupportedMethods.decrypt:
          return setApprovalData({
            accept: () => decrypt(payload.id, payload.params[1]),
            reject: () =>
              reject(payload.id, `User rejected decrypt ${payload.id}`),
            meta: {
              title: `Decrypt this encrypted message`,
              raw: payload,
            },
          });
        case SupportedMethods.computeSharedSecret:
          return setApprovalData({
            accept: () => computeSharedSecret(payload.id, payload.params[1]),
            reject: () =>
              reject(
                payload.id,
                `User rejected computeSharedSecret ${payload.id}`
              ),
            meta: {
              title: `Compute a shared secret for this publickey ${payload.params[1]}`,
              raw: payload,
            },
          });
      }
    },
    [
      accounts,
      computeSharedSecret,
      decrypt,
      personalSign,
      reject,
      signTransaction,
      signTypedData,
    ]
  );

  useEffect(() => {
    void fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    if (!connector) return;

    connector.on(
      CLIENT_EVENTS.session_request,
      (error, payload: SessionProposal) => {
        if (error) return setError(error.message);

        setApprovalData({
          accept: approveConnection,
          reject: rejectConnection,
          meta: {
            title: `new connection from dApp ${payload.params[0].peerMeta.name}`,
            raw: payload,
          },
        });
      }
    );

    connector.on(
      CLIENT_EVENTS.connect,
      (error, payload: Request<unknown[]>) => {
        if (error) return setError(error.message);

        console.log(CLIENT_EVENTS.connect, payload);

        connector.on(
          CLIENT_EVENTS.disconnect,
          (error, payload: Request<unknown[]>) => {
            if (error) return setError(error.message);
            if (!connector) return;

            console.log(CLIENT_EVENTS.disconnect, payload);
            setConnector(null);
            setApprovalData(null);
          }
        );
      }
    );

    connector.on(
      CLIENT_EVENTS.session_update,
      (error, payload: Request<unknown[]>) => {
        if (error) return setError(error.message);

        console.log(CLIENT_EVENTS.session_update, payload);
      }
    );
    connector.on(
      CLIENT_EVENTS.wc_sessionRequest,
      (error, payload: Request<unknown[]>) => {
        if (error) return setError(error.message);

        console.log(CLIENT_EVENTS.wc_sessionRequest, payload);
      }
    );
    connector.on(
      CLIENT_EVENTS.wc_sessionUpdate,
      (error, payload: Request<unknown[]>) => {
        if (error) return setError(error.message);

        console.log(CLIENT_EVENTS.wc_sessionUpdate, payload);
      }
    );

    connector.on(CLIENT_EVENTS.call_request, handleNewRequests);
  }, [
    connector,
    approveConnection,
    handleNewRequests,
    rejectConnection,
    signTransaction,
  ]);

  return (
    <>
      <Head>
        <title>use-contractkit wallet</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-screen-sm mx-auto py-10 md:py-20 px-4">
        <div className="font-semibold text-2xl">use-contractkit wallet</div>

        <input
          style={{
            padding: 10,
            border: '1px solid #aaa',
            color: connector ? '#777' : '#000',
          }}
          ref={inputRef}
          type="text"
          placeholder={connector ? connector.uri : 'Paste your wc url here...'}
          disabled={!!connector}
        />
        <PrimaryButton
          onClick={() =>
            connector?.session.connected ? rejectConnection() : connect()
          }
        >
          {connector?.session.connected
            ? 'Disconnect'
            : connector
            ? 'Connecting…'
            : 'Connect'}
        </PrimaryButton>
        <div className={error ? '' : 'hidden'}>
          <span className="text-red-500">{error}</span>
        </div>
        <div className="w-64 md:w-96 space-y-4 text-gray-700">
          <div className="mb-4">
            <div className="text-lg font-bold mb-2 text-gray-900">
              Account summary
            </div>
            <div className="space-y-2">
              <div>
                walletconnect status:{' '}
                {connector?.session.connected
                  ? 'connected'
                  : connector
                  ? 'connecting…'
                  : 'disconnected'}
              </div>
              <div>Name: {summary.name || 'Not set'}</div>
              <div className="">
                Address: {truncateAddress(account.address)}
              </div>
              <div className="">
                Wallet address:{' '}
                {summary.wallet ? truncateAddress(summary.wallet) : 'Not set'}
              </div>
            </div>
          </div>
          <div>
            <div className="text-lg font-bold mb-2 text-gray-900">Balances</div>
            <div className="space-y-2">
              <div>CELO: {Web3.utils.fromWei(summary.celo.toFixed())}</div>
              <div>cUSD: {Web3.utils.fromWei(summary.cusd.toFixed())}</div>
              <div>cEUR: {Web3.utils.fromWei(summary.ceur.toFixed())}</div>
            </div>
          </div>
        </div>
        <Modal
          ariaHideApp={false}
          isOpen={!!approvalData}
          onRequestClose={approvalData?.reject}
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '90vw',
              maxHeight: '90vh',
            },
          }}
          contentLabel="Approve walletconnect request?"
        >
          <h2>
            Approve: <b>{approvalData?.meta.title}</b> ?
          </h2>
          <pre style={{ fontSize: 8 }}>
            {JSON.stringify(approvalData, null, 2)}
          </pre>
          <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
            <PrimaryButton
              onClick={approvalData?.reject}
              className="w-full md:w-max"
            >
              Reject
            </PrimaryButton>
            <PrimaryButton
              onClick={approvalData?.accept}
              className="w-full md:w-max"
            >
              Approve
            </PrimaryButton>
          </div>
        </Modal>
      </main>
    </>
  );
}