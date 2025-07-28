import chalk from "chalk";
import fs from "fs-extra";
import inquirer from "inquirer";
import ora from "ora";
import path from "path";
import { generateProject } from "../generators/project-generator";
import { validateProjectName } from "../utils/validation";

interface CreateOptions {
  description?: string;
  template?: string;
  templateType?: string;
  walletProvider?: string;
  contracts?: string; // Smart contract framework option
  skipInstall?: boolean;
  yes?: boolean;
}

interface PromptAnswers {
  projectName?: string;
  description?: string;
  templateType?: string;
  walletProvider?: string;
  contractFramework?: string;
  installDependencies?: boolean;
}

export async function createCommand(
  projectName?: string,
  options: CreateOptions = {}
): Promise<void> {
  try {
    console.log(chalk.blue.bold("\n🚀 Welcome to Celo Composer CLI!\n"));

    // If --yes flag is provided, skip all prompts and use defaults/flags
    // Check if any CLI options are provided (auto-mode)
    const hasCliOptions = !!(
      options.description ||
      options.template ||
      options.templateType ||
      options.walletProvider ||
      options.contracts ||
      options.skipInstall ||
      options.yes
    );

    const answers: PromptAnswers =
      options.yes || hasCliOptions
        ? {
            projectName: projectName || "my-celo-app",
            description: options.description || "A new Celo blockchain project",
            templateType: options.template || options.templateType || "basic",
            walletProvider: options.walletProvider || "rainbowkit",
            contractFramework: options.contracts || "none",
            installDependencies: options.skipInstall ? false : true,
          }
        : await inquirer.prompt([
            {
              type: "input",
              name: "projectName",
              message: "What is your project name?",
              default: projectName || "my-celo-app",
              validate: validateProjectName,
              when: !projectName,
            },
            {
              type: "input",
              name: "description",
              message: "Project description:",
              default: options.description || "A new Celo blockchain project",
              when: !options.description,
            },
            {
              type: "list",
              name: "templateType",
              message: "Which template would you like to use?",
              choices: [
                { name: "Basic Template", value: "basic" },
                { name: "Farcaster Miniapp", value: "farcaster-miniapp" },
              ],
              default: "basic",
              when: !options.templateType,
            },
            {
              type: "list",
              name: "walletProvider",
              message: "Which wallet provider would you like to use?",
              choices: [
                { name: "RainbowKit", value: "rainbowkit" },
                { name: "Thirdweb", value: "thirdweb" },
                { name: "None (Skip wallet integration)", value: "none" },
              ],
              default: "rainbowkit",
              when: (answers: { templateType?: string }): boolean => {
                const templateType = options.templateType || answers.templateType;
                return !options.walletProvider && templateType !== "farcaster-miniapp";
              },
            },
            {
              type: "list",
              name: "contractFramework",
              message:
                "Which smart contract development framework would you like to use?",
              choices: [
                { name: "Hardhat (Recommended)", value: "hardhat" },
                {
                  name: "None (Skip smart contract development)",
                  value: "none",
                },
              ],
              default: "hardhat",
              when: !options.contracts,
            },
            {
              type: "confirm",
              name: "installDependencies",
              message: "Install dependencies?",
              default: true,
              when: !options.skipInstall,
            },
          ]);

    const finalProjectName = projectName || answers.projectName || "my-celo-app";
    const finalDescription = options.description || answers.description || "A new Celo blockchain project";
    const finalTemplateType = options.templateType || answers.templateType || "basic";
    const finalWalletProvider =
      options.walletProvider || answers.walletProvider || (finalTemplateType === "farcaster-miniapp" ? "none" : "rainbowkit");
    const finalContractFramework =
      options.contracts || answers.contractFramework || "none";
    const shouldInstall = options.skipInstall
      ? false
      : answers.installDependencies ?? true;

    // Validate project name
    const validation = validateProjectName(finalProjectName);
    if (validation !== true) {
      console.error(chalk.red(`❌ ${validation}`));
      process.exit(1);
    }

    // Check if directory already exists
    const projectPath = path.resolve(process.cwd(), finalProjectName);
    if (await fs.pathExists(projectPath)) {
      console.error(
        chalk.red(`❌ Directory "${finalProjectName}" already exists!`)
      );
      process.exit(1);
    }

    console.log(
      chalk.green(`\n✨ Creating project "${finalProjectName}"...\n`)
    );

    const spinner = ora("Generating project structure...").start();

    try {
      await generateProject({
        projectName: finalProjectName,
        description: finalDescription,
        templateType: finalTemplateType,
        walletProvider: finalWalletProvider,
        contractFramework: finalContractFramework,
        projectPath,
        installDependencies: shouldInstall,
      });

      spinner.succeed("Project generated successfully!");

      console.log(chalk.green.bold("\n🎉 Your Celo project is ready!\n"));
      console.log(chalk.cyan("Next steps:"));
      console.log(chalk.white(`  cd ${finalProjectName}`));

      if (!shouldInstall) {
        console.log(chalk.white("  pnpm install"));
      }

      console.log(chalk.white("  pnpm dev"));
      console.log(chalk.gray("\nYour project has been initialized with Git and an initial commit has been created."));
      console.log(chalk.gray("Happy coding! 🚀\n"));
    } catch (error) {
      spinner.fail("Failed to generate project");
      throw error;
    }
  } catch (error) {
    console.error(chalk.red("\n❌ Error creating project:"));
    console.error(
      chalk.red(error instanceof Error ? error.message : String(error))
    );
    process.exit(1);
  }
}
