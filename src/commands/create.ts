import chalk from "chalk";
import { spawn } from "child_process";
import fs from "fs-extra";
import inquirer from "inquirer";
import ora from "ora";
import path from "path";
import { generateProject } from "../generators/project-generator.js";
import { validateProjectName } from "../utils/validation.js";

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

    // `-t` populates options.template; only the long `--template-type` sets
    // templateType. Several reads below checked just one of the two, which was
    // harmless while any flag skipped the prompts entirely and is not once they
    // run: the template question would re-ask, and finalTemplateType would fall
    // through to "basic" for a `-t minipay` that had no -y. Normalised once.
    const cliTemplateType = options.template || options.templateType;

    // Only -y skips the prompts.
    //
    // This used to skip them whenever ANY flag was present, so
    // `create myapp -d "hello"` silently produced basic + rainbowkit + hardhat
    // without asking a single question — and made -y redundant, since every
    // other flag already did what it does. The docs describe the opposite:
    // a flag bypasses the prompt "for those options", leaving the rest asked.
    //
    // The per-question `when:` clauses below already implement that, keyed on
    // the specific flag. They were simply never reached.
    const answers: PromptAnswers =
      options.yes
        ? ((): PromptAnswers => {
            const autoTemplateType =
              cliTemplateType || "basic";
            const autoWallet = options.walletProvider
              ? options.walletProvider
              : autoTemplateType === "farcaster-miniapp" ||
                autoTemplateType === "ai-chat"
              ? "none"
              : autoTemplateType === "minipay"
              ? "rainbowkit"
              : "rainbowkit";
            const autoContracts = options.contracts
              ? options.contracts
              : autoTemplateType === "farcaster-miniapp" ||
                autoTemplateType === "ai-chat"
              ? "none"
              : "hardhat";
            return {
              projectName: projectName || "my-celo-app",
              description:
                options.description || "A new Celo blockchain project",
              templateType: autoTemplateType,
              walletProvider: autoWallet,
              contractFramework: autoContracts,
              installDependencies: options.skipInstall ? false : true,
            };
          })()
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
                { name: "AI Agent Chat App", value: "ai-chat" },
              ],
              default: "basic",
              // `-t` populates options.template; only the long form sets
              // templateType. Checking one of the two asks again for a template
              // the user already chose.
              when: !cliTemplateType,
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
                  cliTemplateType || answers.templateType;
                return (
                  !options.walletProvider &&
                  templateType !== "farcaster-miniapp" &&
                  templateType !== "minipay" &&
                  templateType !== "ai-chat"
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
              when: (answers: { templateType?: string }): boolean => {
                const templateType =
                  cliTemplateType || answers.templateType;
                if (templateType === "ai-chat") return false;
                return !options.contracts;
              },
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
      cliTemplateType || answers.templateType || "basic";

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
      (finalTemplateType === "farcaster-miniapp" ||
      finalTemplateType === "ai-chat"
        ? "none"
        : finalTemplateType === "minipay"
        ? "rainbowkit"
        : "rainbowkit");
    let finalContractFramework = options.contracts || answers.contractFramework;
    if (!finalContractFramework) {
      finalContractFramework =
        finalTemplateType === "ai-chat" ||
        finalTemplateType === "farcaster-miniapp"
          ? "none"
          : "hardhat";
    }
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
      let foundryInstallFailed = false;
      if (finalContractFramework === "foundry") {
        const contractsPath = path.join(projectPath, "apps", "contracts");
        spinner.start("Installing Foundry dependencies...");
        try {
          await new Promise<void>((resolve, reject) => {
            // No `--no-commit`. Forge removed that flag — not committing is the
            // default now — and passing it makes the whole command fail with
            // "unexpected argument '--no-commit' found" on any current install.
            const installProcess = spawn(
              "forge",
              ["install", "foundry-rs/forge-std"],
              { cwd: contractsPath, stdio: "pipe" }
            );

            // Keep forge's own message. "exited with code 2" on its own tells
            // the user nothing about what to do next.
            let stderr = "";
            installProcess.stderr?.on("data", (chunk) => {
              stderr += String(chunk);
            });

            installProcess.on("close", (code) => {
              if (code === 0) {
                resolve();
              } else {
                reject(
                  new Error(
                    stderr.trim() || `'forge install' exited with code ${code}`
                  )
                );
              }
            });

            installProcess.on("error", (err: NodeJS.ErrnoException) => {
              reject(
                new Error(
                  err.code === "ENOENT"
                    ? "'forge' is not on PATH. Install Foundry first: https://getfoundry.sh"
                    : err.message
                )
              );
            });
          });
          spinner.succeed("Foundry dependencies installed successfully.");
        } catch (error) {
          // Loudly, and with the command that fixes it. A silent warning here
          // produced a project that could not compile at all: script/Counter.s.sol
          // and test/Counter.t.sol both import forge-std, so without lib/forge-std
          // `forge build` fails on every file.
          foundryInstallFailed = true;
          spinner.fail("Could not install Foundry dependencies.");
          console.error(
            chalk.red(
              `  ${error instanceof Error ? error.message : String(error)}`
            )
          );
          console.log(
            chalk.yellow(
              "\n  The project was generated, but it will NOT compile until forge-std is\n" +
                "  installed — both the script and the test import from it. Finish with:\n"
            )
          );
          console.log(
            chalk.white(
              `    cd ${finalProjectName}/apps/contracts && forge install foundry-rs/forge-std\n`
            )
          );
        }
      }

      console.log(
        foundryInstallFailed
          ? chalk.yellow.bold("\n⚠️  Your Celo project is generated, but incomplete.\n")
          : chalk.green.bold("\n🎉 Your Celo project is ready!\n")
      );
      console.log(chalk.cyan("Next steps:"));
      console.log(chalk.white(`  cd ${finalProjectName}`));

      if (!shouldInstall) {
        console.log(chalk.white("  pnpm install"));
      }

      if (foundryInstallFailed) {
        console.log(
          chalk.white("  cd apps/contracts && forge install foundry-rs/forge-std && cd ../..")
        );
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
