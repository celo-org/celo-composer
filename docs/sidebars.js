// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: "doc",
      label: "Introduction",
      id: "introduction",
    },
    {
      type: "category",
      label: "Getting Started",
      items: [
        {
          type: "doc",
          label: "Start building on Celo",
          id: "getting-started/index",
        },
        {
          type: "doc",
          label: "Setup for Celo Testnet",
          id: "getting-started/setup-for-celo-testnet",
        },
      ],
    },
    {
      type: "category",
      label: "Frameworks",
      items: [
        {
          type: "doc",
          label: "React",
          id: "frameworks/react",
        },
        {
          type: "doc",
          label: "React Taiwind",
          id: "frameworks/react-tailwind",
        },
        {
          type: "doc",
          label: "React Native",
          id: "frameworks/react-native",
        },
        {
          type: "doc",
          label: "React Native Expo",
          id: "frameworks/react-native-expo",
        },
        {
          type: "doc",
          label: "React Native Simple",
          id: "frameworks/react-native-simple",
        },
        {
          type: "doc",
          label: "Flutter",
          id: "frameworks/flutter",
        },
        {
          type: "doc",
          label: "Angular",
          id: "frameworks/angular",
        },
      ],
    },
    {
      type: "category",
      label: "Tools",
      items: [
        {
          type: "doc",
          label: "Hardhat",
          id: "tools/hardhat",
        },
        {
          type: "doc",
          label: "Truffle",
          id: "tools/truffle",
        },
        {
          type: "doc",
          label: "Subgraph",
          id: "tools/subgraph",
        },
      ],
    },
  ],
};

module.exports = sidebars;
