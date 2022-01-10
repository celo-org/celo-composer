import { StableToken } from '@celo/contractkit';
import { ensureLeading0x } from '@celo/utils/lib/address';
import {
  Alfajores,
  Baklava,
  Mainnet,
  useContractKit,
} from '@celo-tools/use-contractkit';
import { BigNumber } from 'bignumber.js';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';

import { PrimaryButton, SecondaryButton, toast } from '../components';
import { TYPED_DATA } from '../utils';

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

const networks = [Alfajores, Baklava, Mainnet];

export default function Home(): React.ReactElement {
  const {
    kit,
    address,
    network,
    updateNetwork,
    connect,
    destroy,
    performActions,
    walletType,
  } = useContractKit();
  const [summary, setSummary] = useState(defaultSummary);
  const [sending, setSending] = useState(false);

  const fetchSummary = useCallback(async () => {
    if (!address) {
      setSummary(defaultSummary);
      return;
    }

    const [accounts, goldToken, cUSD, cEUR] = await Promise.all([
      kit.contracts.getAccounts(),
      kit.contracts.getGoldToken(),
      kit.contracts.getStableToken(StableToken.cUSD),
      kit.contracts.getStableToken(StableToken.cEUR),
    ]);

    const [summary, celo, cusd, ceur] = await Promise.all([
      accounts.getAccountSummary(address).catch((e) => {
        console.error(e);
        return defaultSummary;
      }),
      goldToken.balanceOf(address),
      cUSD.balanceOf(address),
      cEUR.balanceOf(address),
    ]);
    setSummary({
      ...summary,
      celo,
      cusd,
      ceur,
    });
  }, [address, kit]);

  const testSendTransaction = async () => {
    try {
      setSending(true);

      await performActions(async (k) => {
        const celo = await k.contracts.getGoldToken();
        await celo
          .transfer(
            // impact market contract
            '0x73D20479390E1acdB243570b5B739655989412f5',
            Web3.utils.toWei('0.00000001', 'ether')
          )
          .sendAndWaitForReceipt({ from: k.defaultAccount });
      });

      toast.success('sendTransaction succeeded');
      await fetchSummary();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSending(false);
    }
  };

  const testSignTypedData = async () => {
    setSending(true);
    try {
      await performActions(async (k) => {
        if (k.defaultAccount) {
          return await k.signTypedData(k.defaultAccount, TYPED_DATA);
        } else {
          throw new Error('No default account');
        }
      });
      toast.success('signTypedData succeeded');
    } catch (e) {
      toast.error((e as Error).message);
    }

    setSending(false);
  };

  const testSignPersonal = async () => {
    setSending(true);
    try {
      await performActions(async (k) => {
        if (!k.defaultAccount) {
          throw new Error('No default account');
        }
        return await k.connection.sign(
          ensureLeading0x(Buffer.from('Hello').toString('hex')),
          k.defaultAccount
        );
      });
      toast.success('sign_personal succeeded');
    } catch (e) {
      toast.error((e as Error).message);
    }

    setSending(false);
  };

  useEffect(() => {
    void fetchSummary();
  }, [fetchSummary]);

  return (
    <div>
      <Head>
        <title>use-contractkit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-screen-sm mx-auto py-10 md:py-20 px-4">
        <div className="font-semibold text-2xl">use-contractkit</div>
        <div className="text-gray-600 mt-2">
          A{' '}
          <a
            className="underline"
            href="https://reactjs.org/docs/hooks-intro.html"
            target="_blank"
            rel="noreferrer"
          >
            React hook
          </a>{' '}
          to ease connecting to the{' '}
          <a
            href="https://celo.org/"
            target="_blank"
            style={{ color: 'rgba(53,208,127,1.00)' }}
            rel="noreferrer"
          >
            Celo{' '}
            <svg
              data-name="Celo Rings"
              viewBox="0 0 950 950"
              className="inline h-4 w-4 mb-1"
            >
              <path
                data-name="Top Ring"
                d="M575 650c151.88 0 275-123.12 275-275S726.88 100 575 100 300 223.12 300 375s123.12 275 275 275zm0 100c-207.1 0-375-167.9-375-375S367.9 0 575 0s375 167.9 375 375-167.9 375-375 375z"
                fill="#35d07f"
              />
              <path
                data-name="Bottom Ring"
                d="M375 850c151.88 0 275-123.12 275-275S526.88 300 375 300 100 423.12 100 575s123.12 275 275 275zm0 100C167.9 950 0 782.1 0 575s167.9-375 375-375 375 167.9 375 375-167.9 375-375 375z"
                fill="#fbcc5c"
              />
              <path
                data-name="Rings Overlap"
                d="M587.39 750a274.38 274.38 0 0054.55-108.06A274.36 274.36 0 00750 587.4a373.63 373.63 0 01-29.16 133.45A373.62 373.62 0 01587.39 750zM308.06 308.06A274.36 274.36 0 00200 362.6a373.63 373.63 0 0129.16-133.45A373.62 373.62 0 01362.61 200a274.38 274.38 0 00-54.55 108.06z"
                fill="#ecff8f"
              />
            </svg>
          </a>{' '}
          network.
        </div>

        <div className="mt-6">
          <div className="mb-2 text-lg">Find it on:</div>
          <ul className="list-disc list-inside">
            <li>
              <a
                className="text-blue-500"
                target="_blank"
                href="https://www.npmjs.com/package/@celo-tools/use-contractkit"
                rel="noreferrer"
              >
                NPM
              </a>
            </li>
            <li>
              <a
                className="text-blue-500"
                target="_blank"
                href="https://github.com/celo-tools/use-contractkit"
                rel="noreferrer"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-6">
          <div className="mb-2 text-lg">Try it out</div>
          <div className="text-gray-600 mb-4">
            Connect to your wallet of choice and sign something for send a test
            transaction
            <br />
            <a target="_blank" className="text-blue-500" href="/wallet">
              Example wallet
            </a>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center space-x-8 mb-4">
              <select
                className="border border-gray-300 rounded px-4 py-2"
                value={network.name}
                onChange={async (e) => {
                  const newNetwork = networks.find(
                    (n) => n.name === e.target.value
                  );
                  if (newNetwork) {
                    await updateNetwork(newNetwork);
                  }
                }}
              >
                {Object.values(networks).map((n) => (
                  <option key={n.name} value={n.name}>
                    {n.name}
                  </option>
                ))}
              </select>
              {address ? (
                <SecondaryButton onClick={destroy}>Disconnect</SecondaryButton>
              ) : (
                <SecondaryButton
                  onClick={() =>
                    connect().catch((e) => toast.error((e as Error).message))
                  }
                >
                  Connect
                </SecondaryButton>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
              <PrimaryButton
                disabled={sending}
                onClick={testSendTransaction}
                className="w-full md:w-max"
              >
                Test sendTransaction
              </PrimaryButton>
              <PrimaryButton
                disabled={sending}
                onClick={testSignTypedData}
                className="w-full md:w-max"
              >
                Test signTypedData
              </PrimaryButton>
              <PrimaryButton
                disabled={sending}
                onClick={testSignPersonal}
                className="w-full md:w-max"
              >
                Test signPersonal
              </PrimaryButton>
            </div>

            {address && (
              <div className="w-64 md:w-96 space-y-4 text-gray-700">
                <div className="mb-4">
                  <div className="text-lg font-bold mb-2 text-gray-900">
                    Account summary
                  </div>
                  <div className="space-y-2">
                    <div>Wallet type: {walletType}</div>
                    <div>Name: {summary.name || 'Not set'}</div>
                    <div className="">Address: {truncateAddress(address)}</div>
                    <div className="">
                      Wallet address:{' '}
                      {summary.wallet
                        ? truncateAddress(summary.wallet)
                        : 'Not set'}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold mb-2 text-gray-900">
                    Balances
                  </div>
                  <div className="space-y-2">
                    <div>
                      CELO: {Web3.utils.fromWei(summary.celo.toFixed())}
                    </div>
                    <div>
                      cUSD: {Web3.utils.fromWei(summary.cusd.toFixed())}
                    </div>
                    <div>
                      cEUR: {Web3.utils.fromWei(summary.ceur.toFixed())}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}