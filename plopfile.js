const path = require('path');

/**
 * Plop generator configuration for Celo Composer projects
 */
module.exports = function (plop) {
  // Set the base path for templates
  plop.setDefaultInclude({ generators: true });

  // Register Handlebars helpers
  plop.setHelper('eq', function (a, b) {
    return a === b;
  });

  plop.setHelper('ne', function (a, b) {
    return a !== b;
  });

  plop.setHelper('or', function (a, b) {
    return a || b;
  });

  plop.setHelper('and', function (a, b) {
    return a && b;
  });

  // Main project generator
  plop.setGenerator('celo-project', {
    description: 'Generate a new Celo project',
    prompts: [],
    actions: function (data) {
      const actions = [];
      const { projectName, description, walletProvider, contractFramework, projectPath } = data;

      // Base project structure
      actions.push({
        type: 'addMany',
        destination: projectPath,
        base: 'templates/base/',
        templateFiles: 'templates/base/**/*',
        globOptions: { dot: true },
        data: {
          projectName,
          description,
          walletProvider,
          contractFramework
        }
      });

      // Add wallet provider templates
      if (walletProvider === 'rainbowkit') {
        actions.push({
          type: 'addMany',
          destination: path.join(projectPath, 'apps/web/src'),
          base: 'templates/wallets/rainbowkit/',
          templateFiles: 'templates/wallets/rainbowkit/**/*',
          data: {
            projectName,
            description,
            walletProvider,
            contractFramework
          }
        });
      }

      // Add smart contract framework templates
      if (contractFramework === 'hardhat') {
        actions.push({
          type: 'addMany',
          destination: path.join(projectPath, 'apps/hardhat'),
          base: 'templates/contracts/hardhat/',
          templateFiles: 'templates/contracts/hardhat/**/*',
          globOptions: { dot: true },
          data: {
            projectName,
            description,
            walletProvider,
            contractFramework
          }
        });
      }

      return actions;
    }
  });
};
