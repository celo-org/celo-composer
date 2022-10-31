const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    runtimeCaching,
    buildExcludes: [/middleware-manifest.json$/],
});

const nextConfig = withPWA({
    // next config
    webpack: (config) => {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        child_process: false,
        readline: false,
      };
      return config;
    }
});
module.exports = nextConfig;