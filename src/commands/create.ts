import chalk from "chalk";
import { spawn } from "child_process";
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
  // Farcaster miniapp specific options
  miniappName?: string;
  miniappDescription?: string;
  miniappTags?: string;
  miniappTagline?: string;
}

interface PromptAnswers {
  projectName?: string;
  description?: string;
  templateType?: string;
  walletProvider?: string;
  contractFramework?: string;
  installDependencies?: boolean;
  installFoundry?: boolean;
  // Farcaster miniapp specific fields
  miniappName?: string;
  miniappDescription?: string;
  miniappTags?: string;
  miniappTagline?: string;
}

export async function createCommand(
  projectName?: string,
  options: CreateOptions = {}
): Promise<void> {
  try {
    console.log(chalk.blue.bold("\n🟨 Welcome to Celo Composer CLI!\n"));

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
                { name: "Minipay App", value: "minipay" },
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
                const templateType =
                  options.templateType || answers.templateType;
                return (
                  !options.walletProvider &&
                  templateType !== "farcaster-miniapp" &&
                  templateType !== "minipay"
                );
              },
            },
            {
              type: "list",
              name: "contractFramework",
              message:
                "Which smart contract development framework would you like to use?",
              choices: [
                { name: "Hardhat", value: "hardhat" },
                { name: "Foundry", value: "foundry" },
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
              name: "installFoundry",
              message:
                "Install Foundry dependencies? (This will run 'foundryup' if Foundry is not detected)",
              default: true,
              when: (answers: { contractFramework: string }) =>
                answers.contractFramework === "foundry",
            },
            {
              type: "confirm",
              name: "installDependencies",
              message: "Install dependencies?",
              default: true,
              when: !options.skipInstall,
            },
          ]);

    const finalProjectName =
      projectName || answers.projectName || "my-celo-app";
    const finalDescription =
      options.description ||
      answers.description ||
      "A new Celo blockchain project";
    const finalTemplateType =
      options.templateType || answers.templateType || "basic";

    // Farcaster miniapp specific prompts - only ask if template is farcaster-miniapp and values not provided via CLI
    let farcasterAnswers: {
      miniappName?: string;
      miniappDescription?: string;
      miniappTags?: string;
      miniappTagline?: string;
    } = {};

    if (finalTemplateType === "farcaster-miniapp" && !options.yes) {
      const farcasterPrompts = [];

      if (!options.miniappName) {
        farcasterPrompts.push({
          type: "input" as const,
          name: "miniappName" as const,
          message: "Miniapp display name:",
          default: finalProjectName
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        });
      }

      if (!options.miniappDescription) {
        farcasterPrompts.push({
          type: "input" as const,
          name: "miniappDescription" as const,
          message: "Miniapp description:",
          default: "A new Celo blockchain miniapp",
        });
      }

      if (!options.miniappTags) {
        farcasterPrompts.push({
          type: "input" as const,
          name: "miniappTags" as const,
          message: "Miniapp tags (comma-separated):",
          default: "mini-app,celo,blockchain",
        });
      }

      if (!options.miniappTagline) {
        farcasterPrompts.push({
          type: "input" as const,
          name: "miniappTagline" as const,
          message: "Miniapp tagline:",
          default: "Built on Celo",
        });
      }

      if (farcasterPrompts.length > 0) {
        farcasterAnswers = await inquirer.prompt(farcasterPrompts);
      }
    }

    const finalWalletProvider =
      options.walletProvider ||
      answers.walletProvider ||
      (finalTemplateType === "farcaster-miniapp"
        ? "none"
        : finalTemplateType === "minipay"
        ? "rainbowkit"
        : "rainbowkit");
    const finalContractFramework =
      options.contracts || answers.contractFramework || "none";
    const shouldInstall = options.skipInstall
      ? false
      : answers.installDependencies ?? true;

    // Farcaster miniapp specific values
    const finalMiniappName =
      options.miniappName ||
      farcasterAnswers.miniappName ||
      answers.miniappName ||
      finalProjectName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    const finalMiniappDescription =
      options.miniappDescription ||
      farcasterAnswers.miniappDescription ||
      answers.miniappDescription ||
      "A new Celo blockchain miniapp";
    const finalMiniappTags =
      options.miniappTags ||
      farcasterAnswers.miniappTags ||
      answers.miniappTags ||
      "mini-app,celo,blockchain";
    const finalMiniappTagline =
      options.miniappTagline ||
      farcasterAnswers.miniappTagline ||
      answers.miniappTagline ||
      "Built on Celo";

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

    // Conditionally install Foundry if selected
    if (finalContractFramework === "foundry" && answers.installFoundry) {
      const spinner = ora("Checking Foundry installation...").start();
      try {
        const isFoundryInstalled = await commandExists("forge");
        if (isFoundryInstalled) {
          spinner.succeed("Foundry is already installed.");
        } else {
          spinner.text = "Foundry not found. Installing via foundryup...";
          await installFoundry();
          spinner.succeed("Foundry installed successfully.");
        }
      } catch (error) {
        spinner.fail("Foundry installation failed.");
        console.error(error);
        process.exit(1);
      }
    }

    console.log(
      chalk.green(`\n✨ Creating project "${finalProjectName}"...\n`)
    );

    const spinner = ora("Generating project structure...").start();

    try {
      await generateProject({
        spinner,
        projectName: finalProjectName,
        description: finalDescription,
        templateType: finalTemplateType,
        walletProvider: finalWalletProvider,
        contractFramework: finalContractFramework,
        projectPath,
        installDependencies: shouldInstall,
        // Farcaster miniapp specific values
        miniappName: finalMiniappName,
        miniappDescription: finalMiniappDescription,
        miniappTags: finalMiniappTags,
        miniappTagline: finalMiniappTagline,
      });

      // If Foundry is the selected contract framework, install its dependencies
      if (finalContractFramework === "foundry") {
        const contractsPath = path.join(projectPath, "apps", "contracts");
        spinner.start("Installing Foundry dependencies...");
        try {
          await new Promise<void>((resolve, reject) => {
            const installProcess = spawn(
              "forge",
              ["install", "foundry-rs/forge-std", "--no-commit"],
              { cwd: contractsPath, stdio: "pipe" }
            );

            installProcess.on("close", (code) => {
              if (code === 0) {
                resolve();
              } else {
                reject(new Error(`'forge install' failed with code ${code}`));
              }
            });

            installProcess.on("error", (err) => {
              reject(err);
            });
          });
          spinner.succeed("Foundry dependencies installed successfully.");
        } catch (error) {
          spinner.fail("Failed to install Foundry dependencies.");
          console.error(error);
          // We don't exit here, just warn the user.
        }
      }

      console.log(chalk.green.bold("\n🎉 Your Celo project is ready!\n"));
      console.log(chalk.cyan("Next steps:"));
      console.log(chalk.white(`  cd ${finalProjectName}`));

      if (!shouldInstall) {
        console.log(chalk.white("  pnpm install"));
      }

      console.log(chalk.white("  pnpm dev"));
      console.log(
        chalk.gray(
          "\nYour project has been initialized with Git and an initial commit has been created."
        )
      );
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

// Helper function to check if a command exists
function commandExists(command: string): Promise<boolean> {
  return new Promise((resolve) => {
    const check = spawn("command", ["-v", command], { stdio: "ignore" });
    check.on("close", (code) => resolve(code === 0));
    check.on("error", () => resolve(false));
  });
}

// Helper function to install Foundry
function installFoundry(): Promise<void> {
  return new Promise((resolve, reject) => {
    const curl = spawn("curl", ["-L", "https://foundry.paradigm.xyz"]);
    const bash = spawn("bash", [], { stdio: ["pipe", "pipe", "pipe"] });

    curl.stdout.pipe(bash.stdin);

    let errorOutput = "";
    bash.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    bash.on("close", (code) => {
      if (code === 0) {
        // After installation, the script suggests adding foundry to the path.
        // We will run it directly from the installation location to avoid shell restarts.
        if (!process.env.HOME) {
          return reject(
            new Error(
              "HOME environment variable not set. Cannot find foundryup."
            )
          );
        }
        const foundryup = spawn(
          path.join(process.env.HOME, ".foundry", "bin", "foundryup")
        );
        foundryup.on("close", (exitCode) => {
          if (exitCode === 0) {
            resolve();
          } else {
            reject(new Error(`foundryup command failed with code ${exitCode}`));
          }
        });
      } else {
        reject(
          new Error(
            `Installation script failed with code ${code}: ${errorOutput}`
          )
        );
      }
    });

    curl.on("error", (err) => reject(err));
    bash.on("error", (err) => reject(err));
  });
}
