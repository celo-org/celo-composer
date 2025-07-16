'use client';

import { useEffect, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { ArrowRightIcon, BeakerIcon, RocketLaunchIcon, CommandLineIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const features = [
  {
    name: 'Faucet',
    description: 'Get testnet tokens to start building',
    icon: BeakerIcon,
    href: 'https://faucet.celo.org/alfajores',
  },
  {
    name: 'Deploy',
    description: 'Launch your dApp on Celo',
    icon: RocketLaunchIcon,
    href: 'https://github.com/celo-org/celo-composer/blob/main/docs/DEPLOYMENT_GUIDE.md',
  },
  {
    name: 'Develop',
    description: 'Build with powerful tools',
    icon: CommandLineIcon,
    href: 'https://github.com/celo-org/celo-composer',
  },
];

export default function Home() {
  const [userAddress, setUserAddress] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [address, isConnected]);

  const getNetworkBadge = () => {
    // Celo Mainnet: 42220, Alfajores Testnet: 44787
    const isMainnet = chainId === 42220;
    return (
      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isMainnet 
          ? 'bg-success bg-opacity-10 text-success' 
          : 'bg-citrus bg-opacity-10 text-citrus'
      }`}>
        {isMainnet ? 'Mainnet' : 'Testnet'}
      </span>
    );
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden py-12">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-prosperity via-gypsum to-snow opacity-50" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-fig mb-4 bg-clip-text text-transparent bg-gradient-to-r from-forest to-fig">
          Welcome to Celo Composer
        </h1>
        
        <p className="text-lg sm:text-xl text-wood mb-6">
          Build. Deploy. Scale.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Link 
            href="https://docs.celo.org/developer"
            target="_blank"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-forest hover:bg-opacity-90 transition-all"
          >
            Get Started
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="https://docs.celo.org"
            target="_blank" 
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg text-forest border-2 border-forest hover:bg-forest hover:text-white transition-all"
          >
            Documentation
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {features.map((feature) => (
            <Link
              key={feature.name}
              href={feature.href}
              target="_blank"
              className="group relative bg-white bg-opacity-50 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center">
                <feature.icon className="h-8 w-8 text-forest mb-2 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="text-base font-semibold text-fig mb-1">{feature.name}</h3>
                <p className="text-sm text-wood">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Wallet Status */}
        {isConnected ? (
          <div className="text-sm text-wood bg-white bg-opacity-50 backdrop-blur-sm rounded-lg px-4 py-3 shadow-sm">
            <div className="flex items-center justify-center flex-wrap gap-2">
              <span>Connected:</span>
              <span className="font-mono text-forest">{userAddress}</span>
              {getNetworkBadge()}
            </div>
          </div>
        ) : (
          <div className="text-sm text-wood bg-white bg-opacity-50 backdrop-blur-sm rounded-lg px-4 py-3 shadow-sm">
            Connect your wallet to get started
          </div>
        )}
      </div>

      {/* Updated bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gypsum to-transparent" />
    </div>
  );
}
