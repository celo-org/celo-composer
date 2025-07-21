import { NodePlopAPI } from 'plop';
import path from 'path';

export default function (plop: NodePlopAPI): void {
  // Set the base path for templates
  plop.setDefaultInclude({ generators: true });

  // Configure the Celo project generator
  plop.setGenerator('celo-project', {
    description: 'Generate a new Celo blockchain project',
    prompts: [
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        validate: (input: string) => {
          if (!input || input.trim().length === 0) {
            return 'Project name is required';
          }
          if (!/^[a-zA-Z0-9_-]+$/.test(input.trim())) {
            return 'Project name can only contain letters, numbers, hyphens, and underscores';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description:',
        default: 'A new Celo blockchain project',
      },
    ],
    actions: [
      // Copy all template files from base template
      {
        type: 'addMany',
        destination: '{{destinationPath}}/',
        base: 'templates/base/',
        templateFiles: 'templates/base/**/*.hbs',
        globOptions: {
          dot: true,
        },
        verbose: true,
      },
    ],
  });

  // Add helper functions for templates
  plop.setHelper('kebabCase', (text: string) => {
    return text
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  });

  plop.setHelper('camelCase', (text: string) => {
    return text
      .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
      .replace(/^(.)/, (_, c) => c.toLowerCase());
  });

  plop.setHelper('pascalCase', (text: string) => {
    return text
      .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
      .replace(/^(.)/, (_, c) => c.toUpperCase());
  });
}
