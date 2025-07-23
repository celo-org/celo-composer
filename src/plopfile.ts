import { NodePlopAPI } from "plop";
import path from "path";

module.exports = function (plop: NodePlopAPI): void {
  // Set the base path for templates
  plop.setDefaultInclude({ generators: true });

  // Configure the Celo project generator
  plop.setGenerator("celo-project", {
    description: "Generate a new Celo blockchain project",
    prompts: [
      {
        type: "input",
        name: "projectName",
        message: "Project name:",
        validate: (input: string) => {
          if (!input || input.trim().length === 0) {
            return "Project name is required";
          }
          if (!/^[a-zA-Z0-9_-]+$/.test(input.trim())) {
            return "Project name can only contain letters, numbers, hyphens, and underscores";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "description",
        message: "Project description:",
        default: "A new Celo blockchain project",
      },
    ],
    actions: [
      // Copy all template files from base template
      {
        type: "addMany",
        destination: "{{projectPath}}/",
        base: path.join(__dirname, "../templates/base/"),
        templateFiles: path.join(__dirname, "../templates/base/**/*.hbs"),
        globOptions: {
          dot: true,
        },
        verbose: true,
      },
      // Copy all static assets (images, etc.)
      {
        type: "addMany",
        destination: "{{projectPath}}/",
        base: path.join(__dirname, "../templates/base/"),
        templateFiles: [path.join(__dirname, "../templates/base/**/*"), "!" + path.join(__dirname, "../templates/base/**/*.hbs")],
        globOptions: {
          dot: true,
        },
        verbose: true,
      },
      // Conditionally add RainbowKit wallet components
      {
        type: "addMany",
        destination: "{{projectPath}}/apps/web/src/components/",
        base: path.join(__dirname, "../templates/wallets/rainbowkit/"),
        templateFiles: path.join(__dirname, "../templates/wallets/rainbowkit/*.tsx.hbs"),
        skip: (data: any) => {
          if (data.walletProvider !== "rainbowkit") {
            return "Skipping RainbowKit - different wallet provider selected";
          }
          return false;
        },
        verbose: true,
      },
      // Conditionally add Hardhat smart contract development
      {
        type: "addMany",
        destination: "{{projectPath}}/apps/hardhat/",
        base: path.join(__dirname, "../templates/contracts/hardhat/"),
        templateFiles: path.join(__dirname, "../templates/contracts/hardhat/**/*.hbs"),
        globOptions: {
          dot: true,
        },
        skip: (data: any) => {
          if (data.contractFramework !== "hardhat") {
            return "Skipping Hardhat - different contract framework selected";
          }
          return false;
        },
        verbose: true,
      },
    ],
  });

  // Add helper functions for templates
  plop.setHelper("kebabCase", (text: string) => {
    return text
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/\s+/g, "-")
      .toLowerCase();
  });

  plop.setHelper("camelCase", (text: string) => {
    return text
      .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
      .replace(/^(.)/, (_, c) => c.toLowerCase());
  });

  plop.setHelper("pascalCase", (text: string) => {
    return text
      .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
      .replace(/^(.)/, (_, c) => c.toUpperCase());
  });

  // Helper to check if wallet provider equals a value
  plop.setHelper("eq", (a: any, b: any) => a === b);
}
