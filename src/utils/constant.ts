import chalk from "chalk";

export const availablePackages = {
  hardhat: "Hardhat",
  "react-app": "React",
  subgraphs: "TheGraph",
};

export const packageNameMap = {
  hardhat: "hardhat",
  "react-app": "react-app",
  subgraphs: "subgraphs",
};

export const BASE_URL = "https://github.com/celo-org/celo-composer/";

export const getProjectJson = (projectName: string, author: string) => ({
  author,
  bugs: {
    url: "https://github.com/celo-org/celo-composer/issues",
  },
  description: "Custom Celo Composer project.",
  homepage: "https://github.com/celo-org/celo-composer/blob/main/README.md",
  keywords: ["celo-composer", "celo"],
  license: "MIT",
  name: `${projectName}`,
  private: true,
  repository: {
    type: "git",
    url: "git+https://github.com/celo-org/celo-composer.git",
  },
  resolutions: {
    "@wagmi/connectors": "5.7.7",
    "@wagmi/core": "2.16.7",
    "@walletconnect/utils": "^2.19.1",
    elliptic: "6.6.1",
    viem: "2.23.2",
    wagmi: "2.14.11",
  },
  scripts: {},
  version: "1.0.0",
  workspaces: ["packages/*"],
});

export const getTemplateUrl = (template: string) => {
  switch (template) {
    case "Minipay": {
      return "https://github.com/celo-org/minipay-template.git";
    }

    case "Valora": {
      return "https://github.com/celo-org/valora-template.git";
    }

    case "Social Connect": {
      return "https://github.com/celo-org/social-connect-template.git";
    }

    default: {
      return "https://github.com/celo-org/minipay-template.git";
    }
  }
};

export const displayInstructions = () => {
  console.log(
    chalk.green.bold(
      "\n🚀 Your starter project has been successfully created!\n"
    )
  );

  console.log(
    chalk.bold("Before you start the project, please follow these steps:\n")
  );

  console.log(chalk.cyan("1.") + " Rename the file:");
  console.log(chalk.yellow("   packages/react-app/.env.template"));
  console.log("   to");
  console.log(chalk.yellow("   packages/react-app/.env\n"));

  console.log(
    chalk.cyan("2.") +
      " Open the newly renamed " +
      chalk.yellow(".env") +
      " file and add all the required environment variables.\n"
  );

  console.log(
    chalk.bold("Once you've done that, you're all set to start your project!\n")
  );

  console.log(
    chalk.green.bold(
      "Run the following commands from the packages/react-app folder to start the project:\n"
    )
  );
  console.log(chalk.yellow("   yarn install"));
  console.log(chalk.yellow("   yarn dev\n"));

  console.log(
    chalk.green(
      "For detailed instructions on deploying the project using Vercel CLI, please refer to the Deployment Guide:"
    )
  );
  console.log(
    chalk.blue(
      "https://github.com/celo-org/celo-composer/blob/main/docs/DEPLOYMENT_GUIDE.md"
    )
  );

  console.log(
    chalk.green(
      "For adding UI components using ShadCN, please refer to the following guide:"
    )
  );
  console.log(
    chalk.blue(
      "https://github.com/celo-org/celo-composer/blob/main/docs/UI_COMPONENTS.md\n"
    )
  );

  console.log(
    chalk.green("Thank you for using Celo Composer!") +
      " If you have any questions or need further assistance, please refer to the README or reach out to our team.\n"
  );

  console.log(chalk.blue.bold("Happy coding! 🎉\n"));
};
