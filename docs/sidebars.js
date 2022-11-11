// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: "doc",
      label: "Introduction",
      id: "README",
    },
    {
      type: "doc",
      label: "React",
      id: "frameworks/react-app/README",
    },
    {
      type: "doc",
      label: "React + TailwindCSS",
      id: "frameworks/react-app-tailwind/README",
    },
    {
      type: "doc",
      label: "React Native",
      id: "frameworks/react-native-app/README",
    },
    {
      type: "doc",
      label: "React Native w/o Expo",
      id: "frameworks/react-native-app-without-expo/README",
    },
    {
      type: "doc",
      label: "Flutter",
      id: "frameworks/flutter-app/README",
    },
    {
      type: "doc",
      label: "Angular",
      id: "frameworks/angular-app/README",
    },
    {
      type: "doc",
      label: "Hardhat",
      id: "frameworks/hardhat/README",
    },
    // {
    //   type: "doc",
    //   label: "Truffle",
    //   id: "frameworks/truffle/README",
    // },
    {
      type: "doc",
      label: "Subgraphs",
      id: "frameworks/subgraphs/README",
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
  ],
};

module.exports = sidebars;
