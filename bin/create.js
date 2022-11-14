const inquirer = require("inquirer");
const shell = require("shelljs");
const chalk = require("chalk");
const ora = require("ora");
const emoji = require("node-emoji");
const { ensureDir, readdir } = require("fs-extra");

const BASE_URL = "https://github.com/celo-org/celo-composer/";

/**
 * Object all available templates to choose from.
 */
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

/**
 * All questions in one place
 * 1. Frontend Framework
 * 2. Smart Contract Framework
 * 3. Indexing?
 * 4. Project Name
 *
 * All of the repsonse will be available in promise resolve - answers as an array.
 */

let questions = [
    {
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
    },
    {
        type: "list",
        name: "scFramework",
        message: "Choose smart-contract framework:",
        default: availablePackages["hardhat"],
        choices: [
            availablePackages["hardhat"],
            availablePackages["truffle"],
            "None",
        ],
    },
    {
        type: "list",
        name: "indexingProtocol",
        message: "Create a subgraph:",
        default: "No",
        choices: ["Yes", "No"],
    },
    {
        type: "input",
        name: "projectName",
        message: "Project name: ",
    },
];

// Generate Project files based on selectedPackages
async function generatePackageJSON(selectedPackages, projectName) {
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

            packages.forEach((p) => {
                let localPackageJson = shell.cat(`packages/${p}/package.json`);
                let parsed = JSON.parse(localPackageJson);

                // Change the name of the project in package.json for the generated packages.
                parsed["name"] = `@${projectName}/${p}`;

                // write back the changes to the package.json
                shell
                    .echo(JSON.stringify(parsed, "", 4))
                    .to(`packages/${p}/package.json`);

                Object.keys(parsed.scripts).forEach((key) => {
                    packageJson.scripts[
                        `${p}:${key}`
                    ] = `yarn workspace @${projectName}/${p} ${key}`;
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
        shell.cd(pwd);
    }
}

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

// Based on answers provided prepare selectedPackages array.
async function prepareSelectedPackages(answers) {
    let selectedPackages = [];

    selectedPackages.push(
        Object.keys(availablePackages)[
            Object.values(availablePackages).indexOf(answers["fEFramework"])
        ]
    );

    selectedPackages.push(
        Object.keys(availablePackages)[
            Object.values(availablePackages).indexOf(answers["scFramework"])
        ]
    );

    if (answers["indexingProtocol"] === "Yes") {
        selectedPackages.push("subgraphs");
    }

    await generatePackageJSON(selectedPackages, answers["projectName"]);
}

// Modified in-order to receive answers programmatically in order to make this function testable.
const createAsync = async (answers = {}) => {
    let inquirerAnswers = await inquirer.prompt(questions, answers);
    await prepareSelectedPackages(inquirerAnswers);
};

const loading = (message) => {
    return ora(message).start();
};

module.exports = {
    createAsync,
};
