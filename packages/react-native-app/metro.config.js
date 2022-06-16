// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const crypto = require.resolve("crypto-browserify");
const url = require.resolve("url/");

// Find the workspace root, this can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(__dirname, "../..");
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];
// 2. Let Metro know where to resolve packages, and in what order
config.resolver.nodeModulesPaths = [
	path.resolve(projectRoot, "node_modules"),
	path.resolve(workspaceRoot, "node_modules"),
];

module.exports = {
	...config,
	resolver: {
		extraNodeModules: {
			crypto,
			url,
			fs: require.resolve("expo-file-system"),
			http: require.resolve("stream-http"),
			https: require.resolve("https-browserify"),
			net: require.resolve("react-native-tcp"),
			os: require.resolve("os-browserify/browser.js"),
			path: require.resolve("path-browserify"),
			stream: require.resolve("readable-stream"),
			vm: require.resolve("vm-browserify"),
		},
	},
};
