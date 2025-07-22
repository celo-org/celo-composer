import chalk from "chalk";
import { exec } from "child_process";
import ora from "ora";
import { promisify } from "util";
import { PlopConfig, TemplateGenerator } from "./plop-generator";

const execAsync = promisify(exec);

export interface ProjectConfig {
  projectName: string;
  description: string;
  walletProvider: string;
  contractFramework: string;
  projectPath: string;
  installDependencies: boolean;
}

export async function generateProject(config: ProjectConfig): Promise<void> {
  const { projectName, description, walletProvider, contractFramework, projectPath, installDependencies } = config;

  // Use the professional template-driven generator
  const templateGenerator = new TemplateGenerator();

  const plopConfig: PlopConfig = {
    projectName,
    description,
    walletProvider,
    contractFramework,
    projectPath,
    installDependencies,
  };

  // Generate project using templates
  await templateGenerator.generateProject(plopConfig);

  // Install dependencies if requested
  if (installDependencies) {
    const spinner = ora("Installing dependencies...").start();
    try {
      await execAsync("pnpm install", { cwd: projectPath });
      spinner.succeed("Dependencies installed successfully!");
    } catch (error) {
      spinner.fail("Failed to install dependencies");
      console.log(
        chalk.yellow("You can install them manually later with: pnpm install")
      );
    }
  }
}
