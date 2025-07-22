import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import { generateProject } from '../generators/project-generator';
import { validateProjectName } from '../utils/validation';

interface CreateOptions {
  description?: string;
  wallet?: string;
  contracts?: string;  // Smart contract framework option
  skipInstall?: boolean;
  yes?: boolean;
}

export async function createCommand(projectName?: string, options: CreateOptions = {}): Promise<void> {
  try {
    console.log(chalk.blue.bold('\n🚀 Welcome to Celo Composer CLI!\n'));

    // If --yes flag is provided, skip all prompts and use defaults/flags
    const answers = options.yes ? {
      projectName: projectName || 'my-celo-app',
      description: options.description || 'A new Celo blockchain project',
      walletProvider: options.wallet || 'rainbowkit',
      contractFramework: options.contracts || 'hardhat',
      installDependencies: options.skipInstall ? false : true,
    } : await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What is your project name?',
        default: projectName || 'my-celo-app',
        validate: validateProjectName,
        when: !projectName,
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description:',
        default: options.description || 'A new Celo blockchain project',
        when: !options.description,
      },
      {
        type: 'list',
        name: 'walletProvider',
        message: 'Which wallet provider would you like to use?',
        choices: [
          { name: 'RainbowKit (Recommended)', value: 'rainbowkit' },
          { name: 'None (Skip wallet integration)', value: 'none' },
        ],
        default: 'rainbowkit',
        when: !options.wallet,
      },
      {
        type: 'list',
        name: 'contractFramework',
        message: 'Which smart contract development framework would you like to use?',
        choices: [
          { name: 'Hardhat (Recommended)', value: 'hardhat' },
          { name: 'None (Skip smart contract development)', value: 'none' },
        ],
        default: 'hardhat',
        when: !options.contracts,
      },
      {
        type: 'confirm',
        name: 'installDependencies',
        message: 'Install dependencies?',
        default: true,
        when: !options.skipInstall,
      },
    ] as any);

    const finalProjectName = projectName || answers.projectName;
    const finalDescription = options.description || answers.description;
    const finalWalletProvider = options.wallet || answers.walletProvider;
    const finalContractFramework = options.contracts || answers.contractFramework;
    const shouldInstall = options.skipInstall ? false : (answers.installDependencies ?? true);

    // Validate project name
    const validation = validateProjectName(finalProjectName);
    if (validation !== true) {
      console.error(chalk.red(`❌ ${validation}`));
      process.exit(1);
    }

    // Check if directory already exists
    const projectPath = path.resolve(process.cwd(), finalProjectName);
    if (await fs.pathExists(projectPath)) {
      console.error(chalk.red(`❌ Directory "${finalProjectName}" already exists!`));
      process.exit(1);
    }

    console.log(chalk.green(`\n✨ Creating project "${finalProjectName}"...\n`));

    const spinner = ora('Generating project structure...').start();

    try {
      await generateProject({
        projectName: finalProjectName,
        description: finalDescription,
        walletProvider: finalWalletProvider,
        contractFramework: finalContractFramework,
        projectPath,
        installDependencies: shouldInstall,
      });

      spinner.succeed('Project generated successfully!');

      console.log(chalk.green.bold('\n🎉 Your Celo project is ready!\n'));
      console.log(chalk.cyan('Next steps:'));
      console.log(chalk.white(`  cd ${finalProjectName}`));
      
      if (!shouldInstall) {
        console.log(chalk.white('  pnpm install'));
      }
      
      console.log(chalk.white('  pnpm dev'));
      console.log(chalk.gray('\nHappy coding! 🚀\n'));

    } catch (error) {
      spinner.fail('Failed to generate project');
      throw error;
    }

  } catch (error) {
    console.error(chalk.red('\n❌ Error creating project:'));
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}
