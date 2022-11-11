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
  url: "https://celo.prg",
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
    locales: ["en"],
  },
  plugins: [
    [
      require.resolve("@cmfcmf/docusaurus-search-local"),
      {
        indexDocs: true,
        indexDocSidebarParentCategories: 1,
        indexBlog: false,
      },
    ],
    [
      "docusaurus-plugin-remote-content",
      {
        // options here
        name: "celo-composer", // used by CLI, must be path safe
        id: "main-readme",
        sourceBaseUrl:
          "https://raw.githubusercontent.com/celo-org/celo-composer/main/", // the base url for the markdown (gets prepended to all of the documents when fetching)
        outDir: "docs", // the base directory to output to.
        documents: ["README.md"], // the file names to download
        modifyContent(filename, content) {
          let newContent = content
            .replaceAll(
              "./images/readme/",
              "https://github.com/celo-org/celo-composer/blob/main/images/readme/"
            )
            .replaceAll(".png", ".png?raw=true")
            .replaceAll(
              "./packages/",
              "https://raw.githubusercontent.com/celo-org/celo-composer/main/packages/"
            );
          console.log("newContent", newContent);
          return newContent;
        },
        // performCleanup: false,
      },
    ],
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
            "https://github.com/celo-org/celo-composer/issues/new/choose/",
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Celo Composer",
        logo: {
          alt: "Celo Logo",
          src: "img/celo-logo.png",
        },
        items: [
          {
            type: "doc",
            docId: "introduction",
            position: "left",
            label: "Docs",
          },
          {
            href: "https://github.com/celo-org/celo-composer/",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Docs",
                to: "/docs",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.com/invite/atBpDfqQqX",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/CeloOrg",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/celo-org/celo-composer/",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Celo Foundation, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
