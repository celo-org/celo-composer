const { Command } = require("commander");
const prompt = require("inquirer");
const shell = require("shelljs");
const chalk = require("chalk");
const ora = require("ora");
const emoji = require("node-emoji");
const { ensureDir, readdir } = require("fs-extra");

const BASE_URL = "https://github.com/celo-org/celo-composer/";

const createAsync = async (command) => {
  let { framework } = await prompt.prompt({
    type: "list",
    name: "framework",
    message: "Choose Framework?",
    default: "react",
    choices: [
      "React",
      "React Native (With Expo)",
      "React Native (without Expo)",
      "Flutter",
      "Angular",
    ],
  });

  var slug = "";

  switch (framework) {
    case "React":
      slug = "react-app";
      break;
    case "React Native (With Expo)":
      slug = "react-native-app-without-expo";
      break;
    case "React Native (without Expo)":
      slug = "react-native-app-without-expo";
      break;
    case "Flutter":
      slug = "flutter-app";
      break;
    case "Angular":
      slug = "angular-app";
    default:
      break;
  }

  let { name } = await prompt.prompt({
    type: "input",
    name: "name",
    message: "Project name : ",
  });

  if (slug) {
    const pwd = process.cwd();
    const outputDir = `${pwd}/${name}`;

    // Ensure the output directory exists
    await ensureDir(outputDir);
    await isOutputDirectoryEmpty(outputDir);

    // Showing the loader
    const spinner = loading("Celo Composer is generating your project...\n");

    // Shell commands to clone and trim the required directories
    shell.cd(pwd);
    shell.exec(
      `git clone --depth 2 --filter=blob:none --sparse ${BASE_URL} ${name}`
    );
    shell.cd(name);
    shell.exec(`git sparse-checkout set packages/${slug}`);
    shell.exec(`mv packages/${slug}/* .`);
    shell.exec("rm -rf packages");

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
