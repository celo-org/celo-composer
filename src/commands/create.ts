/* eslint-disable perfectionist/sort-imports */
/* eslint-disable no-await-in-loop */
import { Command } from "@oclif/core";
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

  static override examples = ["<%= config.bin %> <%= command.id %>"];

  static override flags = {};

  public async run(): Promise<void> {
    // const { args, flags } = await this.parse(Create);

    const packages = ["react-app"];

    const { projectName } = await inquirer.prompt({
      filter(input: string) {
        return kebabCase(input.trim()); // Optional: Format the project name to kebab-case
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

    const { hardhatRequired } = await inquirer.prompt({
      default: true,

      message: "Do you want to use Hardhat?",
      name: "hardhatRequired",
      type: "confirm",
    });
    if (hardhatRequired) packages.push("hardhat");

    const { useTemplate } = await inquirer.prompt({
      default: false,
      message: "Do you want to use a template?",
      name: "useTemplate",
      type: "confirm",
    });

    let template = "";
    if (useTemplate) {
      const { templateName } = await inquirer.prompt({
        choices: ["Minipay", "Valora", "Social Connect", "Sveltekit + Wagmi"],
        default: "Minipay",
        message: "Which template do you want to use?",
        name: "templateName",
        type: "list",
      });
      template = templateName;
    }

    const { ownerName } = await inquirer.prompt({
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
