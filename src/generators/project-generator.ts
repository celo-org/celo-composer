import chalk from "chalk";
import { exec } from "child_process";
import fs from "fs-extra";
import { Ora } from "ora";
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
  spinner: Ora;
  // Farcaster miniapp specific fields
  miniappName?: string;
  miniappDescription?: string;
  miniappTags?: string;
  miniappTagline?: string;
}

export async function generateProject(config: ProjectConfig): Promise<void> {
  const {
    projectName,
    description,
    templateType,
    walletProvider,
    contractFramework,
    projectPath,
    installDependencies,
    spinner,
    miniappName,
    miniappDescription,
    miniappTags,
    miniappTagline,
  } = config;

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
    // Farcaster miniapp specific values
    miniappName,
    miniappDescription,
    miniappTags,
    miniappTagline,
  };

  // Generate project using templates
  await templateGenerator.generateProject(plopConfig);

  // Install dependencies if requested
  if (installDependencies) {
    spinner.text = "Installing dependencies...";
    try {
      await execAsync("pnpm install", { cwd: projectPath });
      spinner.succeed("Dependencies installed successfully!");
    } catch (error) {
      spinner.fail("Failed to install dependencies");
      console.log(
        chalk.yellow("You can install them manually later with: pnpm install")
      );
      // Restart spinner for the next step if installation fails
      spinner.start();
    }
  }

  // Initialize Git repository and create initial commit
  spinner.start("Initializing Git repository...");
  try {
    // Check if Git is installed
    try {
      await execAsync("git --version");
    } catch (error) {
      spinner.warn("Git is not installed. Skipping Git initialization.");
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
    await execAsync(`git config user.name "Celo Composer"`, {
      cwd: projectPath,
    });
    await execAsync(`git config user.email "support@celo.org"`, {
      cwd: projectPath,
    });

    await execAsync("git add -A", { cwd: projectPath });
    await execAsync(`git commit -m "feat: initial commit from Celo Composer"`, {
      cwd: projectPath,
    });
    spinner.succeed("Git repository initialized with initial commit");
  } catch (error) {
    spinner.fail("Failed to initialize Git repository");
    console.log(
      chalk.yellow(
        "You can initialize Git manually later with: git init && git add . && git commit -m 'Initial commit'"
      )
    );
  }
}
