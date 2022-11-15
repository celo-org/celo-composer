// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: "doc",
      label: "Introduction",
      id: "README"
    },
    {
      type: "category",
      label: "React + Nextjs",
      items: [
        {
          type: "doc",
          label: "Installation and Setup",
          id: "frameworks/react-app/installation-and-setup"
        },
        {
          type: "doc",
          label: "Deploying your Contract",
          id: "frameworks/react-app/deploying-your-contract"
        },
        {
          type: "doc",
          label: "Verifying your Contract",
          id: "frameworks/react-app/verifying-your-contract"
        }
      ]
      // id: "frameworks/react-app/README",
    },
    {
      type: "doc",
      label: "React + TailwindCSS",
      id: "frameworks/react-app-tailwind/README"
    },
    {
      type: "doc",
      label: "React Native",
      id: "frameworks/react-native-app/README"
    },
    {
      type: "doc",
      label: "React Native w/o Expo",
      id: "frameworks/react-native-app-without-expo/README"
    },
    {
      type: "doc",
      label: "Flutter",
      id: "frameworks/flutter-app/README"
    },
    {
      type: "doc",
      label: "Angular",
      id: "frameworks/angular-app/README"
    },
    {
      type: "doc",
      label: "Hardhat",
      id: "frameworks/hardhat/README"
    },
    {
      type: "doc",
      label: "Subgraphs",
      id: "frameworks/subgraphs/README"
    },
    {
      type: "category",
      label: "Getting Started",
      items: [
        {
          type: "doc",
          label: "Start building on Celo",
          id: "getting-started/index"
        },
        {
          type: "doc",
          label: "Setup for Celo Testnet",
          id: "getting-started/setup-for-celo-testnet"
        }
      ]
    }
  ]
};

module.exports = sidebars;
