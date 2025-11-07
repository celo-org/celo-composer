#!/usr/bin/env node
import { Command } from 'commander';
import { createCommand } from './commands/create.js';
import getChalk from './utils/getChalk.js';

(async function main() {
  const chalk = await getChalk();
  
  const program = new Command();

  program
    .name('celo-composer')
    .description('CLI tool for generating customizable Celo blockchain starter kits')
    .version('1.0.0');

  program.on('command:*', () => {
    console.error(chalk.red('Invalid command: ' + program.args.join(' ')));
    console.log(chalk.yellow('See --help for a list of available commands.'));
    process.exit(1);
  });

  await program.parseAsync(process.argv);
})();
