const inquirer = require("inquirer");
const shell = require("shelljs");
const chalk = require("chalk");
const ora = require("ora");
const emoji = require("node-emoji");
const { ensureDir, readdir } = require("fs-extra");

const BASE_URL = "https://github.com/celo-org/celo-composer/";

const createAsync = async (command) => {
    let availablePackages = {
        "react-app": "React (with examples, requires hardhat deploy)",
        "react-app-tailwindcss": "React with Tailwindcss (blank boilerplate)",
        "react-native-app": "React Native (With Expo)",
        "react-native-app-without-expo": "React Native (without Expo)",
        "flutter-app": "Flutter",
        "angular-app": "Angular",
        hardhat: "Hardhat",
        truffle: "Truffle",
        subgraphs: "TheGraph",
    };

    let selectedPackages = [];

    let { fEFramework } = await inquirer.prompt({
        type: "list",
        name: "fEFramework",
        message: "Choose front-end framework:",
        default: Object.values(availablePackages)[0],
        choices: [
            availablePackages["react-app"],
            availablePackages["react-app-tailwindcss"],
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
        choices: [
            availablePackages["hardhat"],
            availablePackages["truffle"],
            "None",
        ],
    });

    selectedPackages.push(
        Object.keys(availablePackages)[
            Object.values(availablePackages).indexOf(scFramework)
        ]
    );

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
            homepage:
                "https://github.com/celo-org/celo-composer/blob/main/README.md",
            workspaces: {
                packages: ["packages/*"],
            },
            keywords: ["celo-composer", "celo"],
        };

        for (let x = 0; x < selectedPackages.length; x++) {
            // clone to local only the projects user wants
            const { stdout, stderr, code } = shell.exec(
                `git sparse-checkout add packages/${selectedPackages[x]}`,
                { silent: true }
            );

            // flutter project doesn't have package.json
            if (selectedPackages[x] != availablePackages["flutter-app"]) {
                // update name of each package.json project to work properly with monorepo
                let packageFile = shell.cat(
                    `packages/${selectedPackages[x]}/package.json`
                );
                let projectPackage = JSON.parse(packageFile.stdout);
                projectPackage.name = `@${projectName}/${selectedPackages[x]}`;
            }

            // if project isn't web no need to netlify.toml
            if (
                selectedPackages[x] == availablePackages["react-native-app"] ||
                selectedPackages[x] ==
                    availablePackages["react-native-app-without-expo"] ||
                selectedPackages[x] == availablePackages["flutter-app"]
            ) {
                shell.rm("netlify.toml");
            }

            /**
             * Getting all packages selected by the user
             * First list them via echo packages/\*\/
             * Some string manipulation so that packages looks like
             * eg:- ["react-app", "hardhat"] etc...
             */

            let packages = shell
                .exec("echo packages/*/", { silent: true })
                .replaceAll("packages/", "")
                .replaceAll("/", "")
                .replaceAll("\n", "")
                .split(" ");

            /**
             * For every package selected by user,
             * we read package.json of every package,
             * extract all the scripts inside it
             * and write respective scripts in the main package.json file.
             *
             * If react-app has start, dev, build etc... scripts
             * all of them will be add as react-app:start, react-app:dev, react-app:build etc...
             */

            packages.forEach((package) => {
                let localPackageJson = shell.cat(
                    `packages/${package}/package.json`
                );
                let parsed = JSON.parse(localPackageJson);
                Object.keys(parsed.scripts).forEach((key) => {
                    packageJson.scripts[
                        `${package}:${key}`
                    ] = `yarn workspace @${projectName}/${package} ${key}`;
                });
            });
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

module.exports = {
    createAsync,
};
