import type { NextConfig } from 'next';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
  webpack: (config) => {
    const optionalPeers = [
      '@x402/core',
      '@x402/evm',
      '@x402/extensions',
      '@x402/svm',
      '@react-native-async-storage/async-storage',
    ];
    for (const pkg of optionalPeers) {
      try {
        require.resolve(pkg);
      } catch {
        config.resolve.alias = { ...config.resolve.alias, [pkg]: false };
      }
    }
    return config;
  },
};

export default nextConfig;
