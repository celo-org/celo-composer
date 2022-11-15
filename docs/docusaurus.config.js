// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Celo Composer",
  tagline:
    "Celo Composer is a starter project with all code needed to build, deploy, and upgrade a dapps on Celo.",
  // TODO: Update this to the URL of your site once docs are live.
  url: "https://celo.org",
  baseUrl: "/",
  onBrokenLinks: "ignore",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/celo-logo.png",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "Celo Org", // Usually your GitHub org/user name.
  projectName: "celo-composer", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"]
  },
  plugins: [
    [
      require.resolve("@cmfcmf/docusaurus-search-local"),
      {
        indexDocs: true,
        indexDocSidebarParentCategories: 1,
        indexBlog: false
      }
    ],
    // Main Readme
    [
      "docusaurus-plugin-remote-content",
      {
        name: "celo-composer-main-readme",
        sourceBaseUrl:
          "https://raw.githubusercontent.com/celo-org/celo-composer/readme-updates/",
        outDir: "docs",
        documents: ["README.md"],
        performCleanup: false
        // noRuntimeDownloads: true,
        // modifyContent(filename, content) {
        //   let newContent = content
        //     .replaceAll(
        //       "./images/readme/",
        //       "https://github.com/celo-org/celo-composer/blob/readme-updates/images/readme/"
        //     )
        // },
      }
    ],
    // React Readme
    [
      "docusaurus-plugin-remote-content",
      {
        name: "celo-composer-react-readme",
        sourceBaseUrl:
          "https://raw.githubusercontent.com/celo-org/celo-composer/readme-updates/packages/react-app/",
        outDir: "docs/frameworks/react-app",
        documents: ["README.md"],
        performCleanup: false
      }
    ],
    // React + Tailwind Readme
    [
      "docusaurus-plugin-remote-content",
      {
        name: "celo-composer-react-tailwind-readme",
        sourceBaseUrl:
          "https://raw.githubusercontent.com/celo-org/celo-composer/readme-updates/packages/react-app-tailwindcss/",
        outDir: "docs/frameworks/react-app-tailwind",
        documents: ["README.md"],
        performCleanup: false
      }
    ],

    // React Native Readme
    [
      "docusaurus-plugin-remote-content",
      {
        name: "celo-composer-react-native-app-readme",
        sourceBaseUrl:
          "https://raw.githubusercontent.com/celo-org/celo-composer/readme-updates/packages/react-native-app/",
        outDir: "docs/frameworks/react-native-app",
        documents: ["README.md"],
        performCleanup: false
      }
    ],
    // React Native w/o Expo Readme
    [
      "docusaurus-plugin-remote-content",
      {
        name: "celo-composer-react-native-app-without-expo-readme",
        sourceBaseUrl:
          "https://raw.githubusercontent.com/celo-org/celo-composer/readme-updates/packages/react-native-app-without-expo/",
        outDir: "docs/frameworks/react-native-app-without-expo",
        documents: ["README.md"],
        performCleanup: false
      }
    ],
    // Flutter Readme
    [
      "docusaurus-plugin-remote-content",
      {
        name: "celo-composer-flutter-app-readme",
        sourceBaseUrl:
          "https://raw.githubusercontent.com/celo-org/celo-composer/docs/packages/flutter-app/",
        outDir: "docs/frameworks/flutter-app",
        documents: ["README.md"],
        performCleanup: false
      }
    ],
    // Angular Readme
    [
      "docusaurus-plugin-remote-content",
      {
        name: "celo-composer-angular-app-readme",
        sourceBaseUrl:
          "https://raw.githubusercontent.com/celo-org/celo-composer/readme-updates/packages/angular-app/",
        outDir: "docs/frameworks/angular-app",
        documents: ["README.md"],
        performCleanup: false
      }
    ],
    // Hardhat Readme
    [
      "docusaurus-plugin-remote-content",
      {
        name: "celo-composer-hardhat-readme",
        sourceBaseUrl:
          "https://raw.githubusercontent.com/celo-org/celo-composer/readme-updates/packages/hardhat/",
        outDir: "docs/frameworks/hardhat",
        documents: ["README.md"],
        performCleanup: false
      }
    ],
    // Truffle Readme
    // [
    //   "docusaurus-plugin-remote-content",
    //   {
    //     name: "celo-composer-truffle-readme",
    //     sourceBaseUrl:
    //       "https://raw.githubusercontent.com/celo-org/celo-composer/readme-updates/packages/truffle/",
    //     outDir: "docs/frameworks/truffle",
    //     documents: ["README.md"],
    //     performCleanup: false,
    //   },
    // ],
    // Subgraphs Readme
    [
      "docusaurus-plugin-remote-content",
      {
        name: "celo-composer-subgraphs-readme",
        sourceBaseUrl:
          "https://raw.githubusercontent.com/celo-org/celo-composer/readme-updates/packages/subgraphs/",
        outDir: "docs/frameworks/subgraphs",
        documents: ["README.md"],
        performCleanup: false
      }
    ]
  ],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/celo-org/celo-composer/issues/new/choose/"
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Celo Composer",
        logo: {
          alt: "Celo Logo",
          src: "img/celo-logo.png"
        },
        items: [
          {
            type: "doc",
            docId: "README",
            position: "left",
            label: "Docs"
          },
          {
            href: "https://github.com/celo-org/celo-composer/",
            label: "GitHub",
            position: "right"
          }
        ]
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Docs",
                to: "/docs"
              }
            ]
          },
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.com/invite/atBpDfqQqX"
              },
              {
                label: "Twitter",
                href: "https://twitter.com/CeloOrg"
              }
            ]
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/celo-org/celo-composer/"
              }
            ]
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Celo Foundation, Inc. Built with Docusaurus.`
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      }
    })
};

module.exports = config;
