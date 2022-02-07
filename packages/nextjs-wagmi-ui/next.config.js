const withPWA = require("next-pwa");

module.exports = withPWA({
  // webpack: (config, { webpack }) => {
  //   config.resolve.fallback = {
  //     ...config.resolve.fallback,
  //     fs: false,
  //     net: false,
  //     child_process: false,
  //     readline: false,
  //   };
  //   config.plugins.push(
  //     new webpack.IgnorePlugin({ resourceRegExp: /^electron$/ })
  //   );
  //   return config;
  // },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
  },
});