const inquirer = require("inquirer");
const shell = require("shelljs");
const chalk = require("chalk");
const ora = require("ora");
const emoji = require("node-emoji");
const { ensureDir, readdir } = require("fs-extra");
const Os = require("os");
const { join } = require("path");
const fs = require("fs");

const BASE_URL = "https://github.com/celo-org/celo-composer/";

const createAsync = async (command) => {
  if (command.template == "socialconnect") {
    let { projectName } = await inquirer.prompt({
      type: "input",
      name: "projectName",
      message: "Project name: ",
    });

    const pwd = process.cwd();
    shell.cd(pwd);
    shell.exec(
      `git clone https://github.com/celo-org/socialconnect-template.git ${projectName}`
    );
    shell.cd(projectName);
    const packageJsonPath = join(pwd, projectName, "package.json");
    fs.readFile(packageJsonPath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading the file:", err);
        return;
      }

      // Parse the JSON data
      const packageData = JSON.parse(data);

      // Modify the "name" field
      packageData.name = projectName; // Replace 'new-name' with your desired name

      // Convert the JSON data back to a string
      const updatedData = JSON.stringify(packageData, null, 2);

      // Write the updated data back to the package.json file
      fs.writeFile(packageJsonPath, updatedData, "utf8", (err) => {
        if (err) {
          console.error("Error writing to the file:", err);
          return;
        }
      });
    });
    shell.exec("rm -rf .git");
    shell.exec("git init --quiet --initial-branch=main");
    shell.exec("git add .");
    console.log(
      chalk.green(
        "\n\n🚀 Your starter project has been successfully created!\n"
      )
    );

    console.log("Before you start the project, please follow these steps:\n");

    console.log(chalk.cyan("1.") + " Rename the file:");
    console.log(chalk.yellow("   packages/react-app/.env.template"));
    console.log("   to");
    console.log(chalk.yellow("   packages/react-app/.env.local\n"));

    console.log(
      chalk.cyan("2.") +
        " Open the newly renamed " +
        chalk.yellow(".env.local") +
        " file and add all the required environment variables.\n"
    );

    console.log(
      "Once you've done that, you're all set to start your project!\n"
    );
    console.log(
      chalk.green(
        "Run `yarn install` and `yarn dev` from packages/react folder to start the project\n"
      )
    );

    console.log(
      chalk.green("Thank you for using Celo Composer!") +
        " If you have any questions or need further assistance, please refer to the README or reach out to our team.\n"
    );

    console.log(chalk.blue("Happy coding! 🎉\n\n"));

    return;
  } else if (command.template == "minipay") {
    let { projectName } = await inquirer.prompt({
      type: "input",
      name: "projectName",
      message: "Project name: ",
    });

    const pwd = process.cwd();
    shell.cd(pwd);
    shell.exec(
      `git clone https://github.com/celo-org/minipay-template.git ${projectName}`
    );
    shell.cd(projectName);
    const packageJsonPath = join(pwd, projectName, "package.json");
    fs.readFile(packageJsonPath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading the file:", err);
        return;
      }

      // Parse the JSON data
      const packageData = JSON.parse(data);

      // Modify the "name" field
      packageData.name = projectName; // Replace 'new-name' with your desired name

      // Convert the JSON data back to a string
      const updatedData = JSON.stringify(packageData, null, 2);

      // Write the updated data back to the package.json file
      fs.writeFile(packageJsonPath, updatedData, "utf8", (err) => {
        if (err) {
          console.error("Error writing to the file:", err);
          return;
        }
      });
    });
    shell.exec("rm -rf .git");
    shell.exec("git init --quiet --initial-branch=main");
    shell.exec("git add .");
    console.log(
      chalk.green(
        "\n\n🚀 Your starter project has been successfully created!\n"
      )
    );

    console.log("Before you start the project, please follow these steps:\n");

    console.log(chalk.cyan("1.") + " Rename the file:");
    console.log(chalk.yellow("   packages/react-app/.env.template"));
    console.log("   to");
    console.log(chalk.yellow("   packages/react-app/.env.local\n"));

    console.log(
      chalk.cyan("2.") +
        " Open the newly renamed " +
        chalk.yellow(".env.local") +
        " file and add all the required environment variables.\n"
    );

    console.log(
      "Once you've done that, you're all set to start your project!\n"
    );
    console.log(
      chalk.green(
        "Run `yarn install` and `yarn dev` from packages/react folder to start the project\n"
      )
    );

    console.log(
      chalk.green("Thank you for using Celo Composer!") +
        " If you have any questions or need further assistance, please refer to the README or reach out to our team.\n"
    );

    console.log(chalk.blue("Happy coding! 🎉\n\n"));
    return;
  }
  let availablePackages = {
    "react-app": "React",
    "react-native-app": "React Native (With Expo)",
    "react-native-app-without-expo": "React Native (without Expo)",
    "flutter-app": "Flutter",
    "angular-app": "Angular",
    hardhat: "Hardhat",
    subgraphs: "TheGraph",
  };

  let packageNameMap = {
    "react-app": "react-app",
    "react-native-app": "react-native-app",
    "react-native-app-without-expo": "react-native-app",
    "flutter-app": "flutter-app",
    "angular-app": "angular-app",
    hardhat: "hardhat",
    subgraphs: "subgraphs",
  };

  let selectedPackages = [];
  let selectedFELibrary = "";

  let { fEFramework } = await inquirer.prompt({
    type: "list",
    name: "fEFramework",
    message: "Choose front-end framework:",
    default: Object.values(availablePackages)[0],
    choices: [
      availablePackages["react-app"],
      availablePackages["react-native-app"],
      availablePackages["react-native-app-without-expo"],
      availablePackages["flutter-app"],
      availablePackages["angular-app"],
    ],
  });

  /**
   * Based on what fEFramework value is,
   * get its index in the object values array,
   * at the same index get its key and push it to selectedPackages.
   */

  selectedPackages.push(
    Object.keys(availablePackages)[
      Object.values(availablePackages).indexOf(fEFramework)
    ]
  );

  let { scFramework } = await inquirer.prompt({
    type: "list",
    name: "scFramework",
    message: "Choose smart-contract framework:",
    default: availablePackages["hardhat"],
    choices: [availablePackages["hardhat"], "None"],
  });

  if (scFramework !== "None") {
    selectedPackages.push(
      Object.keys(availablePackages)[
        Object.values(availablePackages).indexOf(scFramework)
      ]
    );
  }

  let { indexingProtocol } = await inquirer.prompt({
    type: "list",
    name: "indexingProtocol",
    message: "Create a subgraph:",
    default: "No",
    choices: ["Yes", "No"],
  });

  if (indexingProtocol === "Yes") {
    selectedPackages.push("subgraphs");
  }

  let { projectName } = await inquirer.prompt({
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
    const spinner = loading(
      `Generating custom Celo Composer project with the following packages: ${selectedPackages.join(
        ", "
      )}...\n`
    );

    // Shell commands to clone and trim the required directories
    shell.cd(pwd);
    shell.exec(
      `git clone --depth 2 --filter=blob:none --sparse ${BASE_URL} ${projectName}`
    );
    shell.cd(projectName);

    let packageJson = {
      name: `${projectName}`,
      version: "1.0.0",
      description: "Custom Celo Composer project.",
      private: true,
      author: "Celo",
      license: "MIT",
      scripts: {},
      repository: {
        type: "git",
        url: "git+https://github.com/celo-org/celo-composer.git",
      },
      bugs: {
        url: "https://github.com/celo-org/celo-composer/issues",
      },
      homepage: "https://github.com/celo-org/celo-composer/blob/main/README.md",
      workspaces: ["packages/*"],
      keywords: ["celo-composer", "celo"],
    };

    for (let x = 0; x < selectedPackages.length; x++) {
      let package = selectedPackages[x];

      // clone to local only the projects user wants
      shell.exec(`git sparse-checkout add packages/${package}`, {
        silent: true,
      });

      // if project isn't web no need to netlify.toml
      if (
        package == availablePackages["react-native-app"] ||
        package == availablePackages["react-native-app-without-expo"] ||
        package == availablePackages["flutter-app"]
      ) {
        shell.rm("netlify.toml");
      }

      // flutter project doesn't have package.json
      if (package != packageNameMap["flutter-app"]) {
        let localPackageJson = shell.cat(`packages/${package}/package.json`);
        let projectPackage = JSON.parse(localPackageJson);

        // Change the name of the project in package.json for the generated packages.
        projectPackage["name"] = `@${projectName}/${package}`;

        // write back the changes to the package.json
        shell
          .echo(JSON.stringify(projectPackage, "", 4))
          .to(`packages/${package}/package.json`);

        Object.keys(projectPackage.scripts).forEach((key) => {
          packageJson.scripts[
            `${packageNameMap[package]}:${key}`
          ] = `yarn workspace @${projectName}/${package} ${key}`;
        });
      }

      // update front-end web3 library
      if (package == packageNameMap["react-app"]) {
        let localPackageJson = shell.cat(`packages/${package}/package.json`);
        let projectPackage = JSON.parse(localPackageJson);

        shell
          .echo(JSON.stringify(projectPackage, "", 4))
          .to(`packages/${package}/package.json`);

        Object.keys(projectPackage.scripts).forEach((key) => {
          packageJson.scripts[
            `${packageNameMap[package]}:${key}`
          ] = `yarn workspace @${projectName}/${package} ${key}`;
        });
      }
    }
    /**
     * Getting all packages selected by the user
     * First list them via echo packages/\*\/
     * Some string manipulation so that packages looks like
     * eg:- ["react-app", "hardhat"] etc...
     */
    let packagesStdOut;
    if (isWindows) {
      let { stdout } = shell.exec("dir packages /b", {
        silent: true,
      });
      packagesStdOut = stdout;
    } else {
      let { stdout } = shell.exec("echo packages/*/", {
        silent: true,
      });
      packagesStdOut = stdout;
    }

    /**
     * Node 14 and below doens't support replaceAll
     */
    let packages;
    if (isWindows) {
      packages = packagesStdOut
        .replaceAll("\n", " ")
        .replaceAll("\r", "")
        .split(" ");
      // remove empty strings from array
      packages = packages.filter(function (el) {
        return el != null && el != "";
      });
    } else {
      // remove new line from packagesStdOut
      packages = packagesStdOut
        .replace(/packages\//g, "")
        .replace(/\//g, "")
        .replace(/\n/g, "")
        .split(" ");
    }

    shell.exec("rm -rf .git");
    shell.exec("git init --quiet --initial-branch=main");

    spinner.stopAndPersist({
      symbol: emoji.get("100"),
      text: chalk.green(" Done!"),
    });
    shell.echo(JSON.stringify(packageJson, "", 4)).to("package.json");
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

function isWindows() {
  return Os.platform() === "win32";
}

module.exports = {
  createAsync,
};
