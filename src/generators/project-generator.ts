import chalk from "chalk";
import { exec } from "child_process";
import fs from "fs-extra";
import ora from "ora";
import path from "path";
import { promisify } from "util";
import { PlopConfig, TemplateGenerator } from "./plop-generator";

const execAsync = promisify(exec);

export interface ProjectConfig {
  projectName: string;
  description: string;
  templateType: string;
  walletProvider: string;
  contractFramework: string;
  projectPath: string;
  installDependencies: boolean;
}

export async function generateProject(config: ProjectConfig): Promise<void> {
  const { projectName, description, templateType, walletProvider, contractFramework, projectPath, installDependencies } = config;

  // Use the professional template-driven generator
  const templateGenerator = new TemplateGenerator();

  const plopConfig: PlopConfig = {
    projectName,
    description,
    templateType,
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

  // Initialize Git repository and create initial commit
  const gitSpinner = ora("Initializing Git repository...").start();
  try {
    // Check if Git is installed
    try {
      await execAsync("git --version");
    } catch (error) {
      gitSpinner.warn("Git is not installed. Skipping Git initialization.");
      return;
    }

    // Initialize Git repository
    await execAsync("git init", { cwd: projectPath });
    
    // Create .gitignore if it doesn't exist
    const gitignorePath = path.join(projectPath, ".gitignore");
    if (!fs.existsSync(gitignorePath)) {
      const defaultGitignore = `# Dependencies
node_modules
.pnpm-store

# Build outputs
.next
dist
out

# Environment variables
.env*.local

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local development
.DS_Store
*.pem

# IDE
.idea
.vscode
*.swp
*.swo
`;
      await fs.writeFile(gitignorePath, defaultGitignore);
    }

    // Add all files and create initial commit
    await execAsync("git add .", { cwd: projectPath });
    await execAsync('git commit -m "Initial commit"', { 
      cwd: projectPath,
      env: { ...process.env, GIT_AUTHOR_NAME: "Celo Composer", GIT_AUTHOR_EMAIL: "composer@celo.org" }
    });

    gitSpinner.succeed("Git repository initialized with initial commit");
  } catch (error) {
    gitSpinner.fail("Failed to initialize Git repository");
    console.log(chalk.yellow("You can initialize Git manually later with: git init && git add . && git commit -m 'Initial commit'"));
  }
}
