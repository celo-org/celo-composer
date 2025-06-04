/* eslint-disable perfectionist/sort-imports */
/* eslint-disable no-await-in-loop */
import { Command, Flags } from "@oclif/core";
import chalk from "chalk";
import { execa } from "execa";
import fs from "fs-extra";
import inquirer from "inquirer";
import kebabCase from "lodash.kebabcase";
import emoji from "node-emoji";
import { readdir } from "node:fs/promises";
import path from "node:path";
import ora from "ora";

import {
  BASE_URL,
  displayInstructions,
  getProjectJson,
  getTemplateUrl,
  packageNameMap,
} from "../utils/constant.js";

const requiredNodeVersion = 20;
const currentNodeVersion = process.versions.node.split(".")[0];

if (Number.parseInt(currentNodeVersion, 10) < requiredNodeVersion) {
  throw new Error(
    `Error: Node.js version ${requiredNodeVersion} or higher is required. You are using Node.js ${process.versions.node}.`
  );
}

export default class Create extends Command {
  static override args = {};

  static override description = "Create a new Celo Project";

  static override examples = [
    "<%= config.bin %> <%= command.id %>",
    '<%= config.bin %> <%= command.id %> --name my-celo-app --owner "John Doe" --hardhat --template Minipay',
    '<%= config.bin %> <%= command.id %> -n my-app -o "Jane Smith" --no-hardhat',
  ];

  static override flags = {
    name: Flags.string({
      char: "n",
      description: "Name of the project",
      required: false,
    }),
    owner: Flags.string({
      char: "o",
      description: "Project owner name",
      required: false,
    }),
    hardhat: Flags.boolean({
      description: "Include Hardhat in the project",
      required: false,
      allowNo: true,
    }),
    template: Flags.string({
      char: "t",
      description: "Template to use for the project",
      options: ["Minipay", "Valora"],
      required: false,
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Create);

    const packages = ["react-app"];

    // Detect if we're in inline mode (any flags provided) vs interactive mode
    const isInlineMode = !!(
      flags.name ||
      flags.owner ||
      flags.hardhat !== undefined ||
      flags.template
    );

    // Project name - use flag or prompt
    let projectName: string;
    if (flags.name) {
      projectName = kebabCase(flags.name.trim());

      // Validate project name
      const isValid = /^[\w-]+$/.test(projectName);
      if (!isValid) {
        this.error(
          "Project name must only contain letters, numbers, dashes, and underscores."
        );
      }
      if (projectName.trim() === "") {
        this.error("Project name cannot be empty.");
      }
    } else {
      const response = await inquirer.prompt({
        filter(input: string) {
          return kebabCase(input.trim());
        },
        message: "What is your project name: ",
        name: "projectName",
        type: "input",
        validate(input: string) {
          const valid = /^[\w-]+$/.test(input);
          if (!valid) {
            return "Project name must only contain letters, numbers, dashes, and underscores.";
          }

          if (input.trim() === "") {
            return "Project name cannot be empty.";
          }

          return true;
        },
      });
      projectName = response.projectName;
    }

    // Hardhat choice - use flag or prompt
    let hardhatRequired: boolean;
    if (flags.hardhat !== undefined) {
      hardhatRequired = flags.hardhat;
    } else {
      const response = await inquirer.prompt({
        default: true,
        message: "Do you want to use Hardhat?",
        name: "hardhatRequired",
        type: "confirm",
      });
      hardhatRequired = response.hardhatRequired;
    }
    if (hardhatRequired) packages.push("hardhat");

    // Template choice - use flag, skip in inline mode, or prompt in interactive mode
    let template = "";
    if (flags.template) {
      template = flags.template;
    } else if (isInlineMode) {
      // In inline mode, if no template is specified, default to no template
      template = "";
    } else {
      // Only prompt for template in interactive mode
      const { useTemplate } = await inquirer.prompt({
        default: false,
        message: "Do you want to use a template?",
        name: "useTemplate",
        type: "confirm",
      });

      if (useTemplate) {
        const { templateName } = await inquirer.prompt({
          choices: ["Minipay", "Valora"],
          default: "Minipay",
          message: "Which template do you want to use?",
          name: "templateName",
          type: "list",
        });
        template = templateName;
      }
    }

    // Owner name - use flag or prompt
    let ownerName: string;
    if (flags.owner) {
      ownerName = flags.owner.trim();
      if (ownerName === "") {
        this.error("Owner name cannot be empty.");
      }
    } else {
      const response = await inquirer.prompt({
        message: "Project Owner name: ",
        name: "ownerName",
        type: "input",
        validate(input: string) {
          if (input.trim() === "") {
            return "Owner name cannot be empty.";
          }

          return true;
        },
      });
      ownerName = response.ownerName;
    }

    const pwd = process.cwd();
    const outputDir = `${pwd}/${projectName}`;

    if (fs.existsSync(outputDir)) {
      this.error(`Project directory already exists: ${outputDir}`);
    }

    const spinner = loading(`Generating custom Celo Composer project...\n`);
    try {
      if (template === "") {
        await execa(
          "git",
          [
            "clone",
            "--depth",
            "2",
            "--filter=blob:none",
            "--sparse",
            BASE_URL,
            projectName,
          ],
          {
            cwd: pwd,
            shell: true,
            stdio: "ignore",
          }
        );

        const projectPackageJson = getProjectJson(projectName, ownerName);

        for (const pkg of packages) {
          const projectDir = path.join(pwd, projectName);
          await execa("git", ["sparse-checkout", "add", `packages/${pkg}`], {
            cwd: projectDir,
            shell: true,
            stdio: "ignore",
          });

          const packagePath = path.join(
            projectDir,
            "packages",
            pkg,
            "package.json"
          );

          const localPackageJson = await fs.readFile(packagePath, "utf8");
          const projectPackage = JSON.parse(localPackageJson);
          projectPackage.name = `@${projectName}/${pkg}`;
          projectPackage.author = ownerName;

          await fs.writeFile(
            packagePath,
            JSON.stringify(projectPackage, null, 2),
            "utf8"
          );

          for (const key of Object.keys(projectPackage.scripts)) {
            projectPackageJson.scripts[
              `${packageNameMap[pkg]}:${key}`
            ] = `yarn workspace @${projectName}/${pkg} ${key}`;
          }
        }

        const packageJsonContent = JSON.stringify(projectPackageJson, null, 2);
        const packageJsonPath = path.join(projectName, "package.json");
        await fs.writeFile(packageJsonPath, packageJsonContent, "utf8");
      } else {
        const templateURL = getTemplateUrl(template);
        await execa("git", ["clone", templateURL, projectName], {
          cwd: pwd,
          shell: true,
          stdio: "ignore",
        });

        const projectDir = path.join(pwd, projectName);
        const packageJsonPath = path.join(projectDir, "package.json");
        const packageData = await fs.readFile(packageJsonPath, "utf8");
        const packageJson = JSON.parse(packageData);
        packageJson.name = projectName;
        packageJson.author = ownerName;
        const updatedData = JSON.stringify(packageJson, null, 2);
        await fs.writeFile(packageJsonPath, updatedData, "utf8");
      }

      const gitDir = path.join(process.cwd(), projectName, ".git");
      await fs.remove(gitDir);
      await execa("git", ["init", "--quiet", "--initial-branch=main"], {
        cwd: path.join(process.cwd(), projectName),
        stdio: "ignore",
      });
      await execa("git", ["add", "."], {
        cwd: path.join(process.cwd(), projectName),
      });
      const commitMessage = "Initial commit";
      await execa("git", ["commit", "-m", commitMessage], {
        cwd: path.join(process.cwd(), projectName),
      });

      spinner.stopAndPersist({
        symbol: emoji.get("100"),
        text: chalk.green(" Done!"),
      });
      displayInstructions();
    } catch (error: unknown) {
      console.error(error);
      this.log("Error generating project");
    }
  }
}

export const isOutputDirectoryEmpty = async (outputFolder: string) => {
  const files = await readdir(outputFolder);
  if (files.length > 0) {
    throw new Error(
      `Output directory is not empty. Delete the contents or choose a different project name.`
    );
  }
};

export const loading = (message: string) => ora(message).start();
