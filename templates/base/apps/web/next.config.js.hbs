/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')

    // Optional dependencies the wallet stack imports but a web build never uses.
    //
    // wagmi's connectors pull in @base-org/account, which pulls in
    // @coinbase/cdp-sdk. That SDK declares @x402/core, @x402/evm,
    // @x402/extensions and @x402/svm as OPTIONAL peer dependencies — so a
    // package manager correctly does not install them — and then imports them
    // STATICALLY. webpack resolves static imports at build time, so a default
    // scaffold fails with "Can't resolve '@x402/evm/upto/client'" before any of
    // your own code is reached.
    //
    // Only the ones genuinely absent are stubbed. Install them to use CDP's
    // x402 support and this loop stops matching, so they bundle normally.
    // @metamask/sdk does the same with its React Native storage backend.
    //
    // Stubbed through resolve.alias rather than externals: a bare string in
    // externals becomes a global variable reference, and a scoped package name
    // is not a valid identifier — that turns the warning into an unparseable
    // module and fails the build outright.
    const optionalPeers = [
      '@x402/core',
      '@x402/evm',
      '@x402/extensions',
      '@x402/svm',
      '@react-native-async-storage/async-storage',
    ]
    for (const pkg of optionalPeers) {
      try {
        require.resolve(pkg)
      } catch {
        config.resolve.alias = { ...config.resolve.alias, [pkg]: false }
      }
    }

    return config
  },
};

module.exports = nextConfig;
