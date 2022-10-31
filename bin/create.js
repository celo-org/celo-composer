const prompt = require("inquirer");
const shell = require("shelljs");
const chalk = require("chalk");
const ora = require("ora");
const emoji = require("node-emoji");
const { ensureDir, readdir } = require("fs-extra");

const BASE_URL = "https://github.com/celo-org/celo-composer/";

const createAsync = async (command) => {

  let availablePackages = [
    {
      name: "react-app",
      label: "React"
    },
    {
      name: "react-native-app",
      label: "React Native (With Expo)"
    },
    {
      name: "react-native-app-without-expo",
      label: "React Native (without Expo)"
    },
    {
      name: "flutter-app",
      label: "Flutter"
    },
    {
      name: "angular-app",
      label: "Angular"
    },
    {
      name: "hardhat",
      label: "Hardhat"
    },
    {
      name: "truffle",
      label: "Truffle (comming soon)"
    },
    {
      name: "subgraphs",
      label: "TheGraph"
    },
  ];
  let selectedPackages = [];

  let { fEFramework } = await prompt.prompt({
    type: "list",
    name: "fEFramework",
    message: "Choose front-end framework:",
    default: availablePackages[0].label,
    choices: [
      availablePackages[0].label,
      availablePackages[1].label,
      availablePackages[2].label,
      availablePackages[3].label,
      availablePackages[4].label
    ],
  });

  switch (fEFramework) {
    case availablePackages[0].label:
      selectedPackages.push(availablePackages[0].name);
      break;
    case availablePackages[1].label:
      selectedPackages.push(availablePackages[1].name);
      break;
    case availablePackages[2].label:
      selectedPackages.push(availablePackages[2].name);
      break;
    case availablePackages[3].label:
      selectedPackages.push(availablePackages[3].name);
      break;
    case availablePackages[4].label:
      selectedPackages.push(availablePackages[4].name);
    default:
      break;
  }

  let { scFramework } = await prompt.prompt({
    type: "list",
    name: "scFramework",
    message: "Choose smart-contract framework:",
    default: "Hardhat",
    choices: [
      availablePackages[5].label,
      availablePackages[6].label,
      "None"
    ],
  });

  switch (scFramework) {
    case availablePackages[5].label:
      selectedPackages.push(availablePackages[5].name);
      break;
    default:
      break;
  }

  let { indexingProtocol } = await prompt.prompt({
    type: "list",
    name: "indexingProtocol",
    message: "Create a subgraph:",
    default: "No",
    choices: [
      "Yes",
      "No"
    ],
  });

  switch (indexingProtocol) {
    case "Yes":
      selectedPackages.push(availablePackages[7].name);
      break;
    default:
      break;
  }

  let { projectName } = await prompt.prompt({
    type: "input",
    name: "projectName",
    message: "Project name: ",
  });

  if (selectedPackages.length > 0) {
    const pwd = process.cwd();
    const outputDir = `${pwd}/${projectName}`;

    // Ensure the output directory exists
    await ensureDir(outputDir);
    await isOutputDirectoryEmpty(outputDir);

    // Showing the loader
    const spinner = loading(`Generation custom Celo Composer project with the following packages: ${selectedPackages}...\n`);

    // Shell commands to clone and trim the required directories
    shell.cd(pwd);
    shell.exec(
      `git clone --depth 2 --filter=blob:none --sparse ${BASE_URL} ${projectName}`
    );
    shell.cd(projectName);

    let packageJson = {
      "name": `${projectName}`,
      "version": "1.0.0",
      "description": "Custom Celo Composer project.",
      "private": true,
      "author": "Celo",
      "license": "MIT",
      "scripts": {},
      "repository": {
        "type": "git",
        "url": "git+https://github.com/celo-org/celo-composer.git"
      },
      "bugs": {
        "url": "https://github.com/celo-org/celo-composer/issues"
      },
      "homepage": "https://github.com/celo-org/celo-composer/blob/main/README.md",
      "workspaces": {
        "packages": [
          "packages/*"
        ]
      },
      "keywords": [
        "celo-composer",
        "celo"
      ]
    };

    for (let x = 0; x < selectedPackages.length; x++) {

      // clone to local only the projects user wants
      const { stdout, stderr, code } = shell.exec(
        `git sparse-checkout add packages/${selectedPackages[x]}`, { silent: true }
      );

      // update name of each package.json project to work properly with monorepo
      let packageFile = shell.cat(`packages/${selectedPackages[x]}/package.json`);
      let projectPackage = JSON.parse(packageFile.stdout);
      projectPackage.name = `@${projectName}/${selectedPackages[x]}`;
      shell.echo(JSON.stringify(projectPackage, "", 4)).to(`packages/${selectedPackages[x]}/package.json`);

      // if project isn't web no need to netlify.toml
      if (selectedPackages[x] == availablePackages[1].name |
          selectedPackages[x] == availablePackages[2].name |
          selectedPackages[x] == availablePackages[3].name |
          selectedPackages[x] == availablePackages[4].name
          ) {
        shell.rm("netlify.toml");
      }

      // customize scripts for projects user wants
      if (selectedPackages[x] == availablePackages[0].name) {
        packageJson.scripts["react-dev"] = `yarn workspace @${projectName}/react-app dev`;
        packageJson.scripts["react-build"] = `yarn workspace @${projectName}/react-app build`;
        packageJson.scripts["react-start"] = `yarn workspace @${projectName}/react-app start`;
        packageJson.scripts["react-lint"] = `yarn workspace @${projectName}/react-app lint`;
      }

      if (selectedPackages[x] == availablePackages[1].name) {
        packageJson.scripts["react-native-start"] = `yarn workspace @${projectName}/react-native-app start`;
        packageJson.scripts["react-native-android"] = `yarn workspace @${projectName}/react-native-app android`;
        packageJson.scripts["react-native-ios"] = `yarn workspace @${projectName}/react-native-app ios`;
        packageJson.scripts["react-native-eject"] = `yarn workspace @${projectName}/react-native-app eject`;
        packageJson.scripts["react-native-test"] = `yarn workspace @${projectName}/react-native-app test`;
      }

      if (selectedPackages[x] == availablePackages[2].name) {
        packageJson.scripts["react-native-android"] = `yarn workspace @${projectName}/react-native-app-without-expo android`;
        packageJson.scripts["react-native-ios"] = `yarn workspace @${projectName}/react-native-app-without-expo ios`;
        packageJson.scripts["react-native-start"] = `yarn workspace @${projectName}/react-native-app-without-expo start`;
        packageJson.scripts["react-native-test"] = `yarn workspace @${projectName}/react-native-app-without-expo test`;
        packageJson.scripts["react-native-lint"] = `yarn workspace @${projectName}/react-native-app-without-expo lint`;
      }

      if (selectedPackages[x] == availablePackages[4].name) {
        packageJson.scripts["angular-ng"] = `yarn workspace @${projectName}/angular-app ng`;
        packageJson.scripts["angular-start"] = `yarn workspace @${projectName}/angular-app start`;
        packageJson.scripts["angular-build"] = `yarn workspace @${projectName}/angular-app build`;
        packageJson.scripts["angular-watch"] = `yarn workspace @${projectName}/angular-app watch`;
        packageJson.scripts["angular-test"] = `yarn workspace @${projectName}/angular-app test`;
      }

      if (selectedPackages[x] == availablePackages[5].name) {
        packageJson.scripts["hardhat-chain"] = `yarn workspace @${projectName}/hardhat chain`;
        packageJson.scripts["hardhat-test"] = `yarn workspace @${projectName}/hardhat test`;
        packageJson.scripts["hardhat-deploy"] = `yarn workspace @${projectName}/hardhat run deploy`;        
      }
      
      if (selectedPackages[x] == availablePackages[7].name) {
        packageJson.scripts["subgraph-get-abi"] = `yarn workspace @${projectName}/subgraphs get-abi`;
      }
      
    }

    shell.echo(JSON.stringify(packageJson, "", 4)).to("package.json");
    
    spinner.stopAndPersist({
      symbol: emoji.get("100"),
      text: chalk.green(" Done!"),
    });
  }
};

async function isOutputDirectoryEmpty(outputFolder, force = false) {
  const files = await readdir(outputFolder);
  // TODO: Add  --force option to overwrite existing files
  if (files.length > 0 && !force) {
    const { value } = await inquirer.prompt({
      name: "value",
      type: "confirm",
      message:
        "Output directory is not empty. Are you sure you want to continue?",
    });
    if (!value) {
      process.exit(1);
    }
  }
}

const loading = (message) => {
  return ora(message).start();
};

module.exports = {
  createAsync,
};
