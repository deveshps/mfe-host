#!/usr/bin/env node

const { execSync } = require('child_process');

const runCommand = (command) => {
    try {
        execSync(`${command}`,{stdio:"inherit"});
    } catch(e) {
        console.error(`Failed to execute ${command}`,e)
        return false
    }
    return true
}

const repoName = process?.argv[2] || "mfe-host";
const secondRepoName = process?.argv[3] || "mfe-login";

// for host mfe

const gitCheckoutCommand = `git clone --depth 1 https://github.com/deveshps/mfe-host.git ${repoName}`;

const installDepsCommand = `cd ${repoName} && npm install`;

console.log("Cloning the repository with name ",repoName);

const checkOut = runCommand(gitCheckoutCommand);

const installedDeps = runCommand(installDepsCommand);

console.log("Installing dependencies for ",repoName);

console.log(`installedDeps for ${repoName}`,installedDeps)

// for login mfe 

const gitCheckoutCommandForMfeTwo = `git clone --depth 1 https://github.com/deveshps/mfe-login.git ${secondRepoName}`;

const installDepsCommand2 = `cd ${secondRepoName} && npm install`;

console.log("Cloning the repository with name ",secondRepoName);

const checkOutForMfeTwo = runCommand(gitCheckoutCommandForMfeTwo)

const installedDeps2 = runCommand(installDepsCommand2);

console.log("Installing dependencies for ",secondRepoName);

console.log(`installedDeps for ${secondRepoName}`,installedDeps2)


if(!checkOut || !checkOutForMfeTwo) process.exit(1); // (code : -1)


if(!installDepsCommand || !installDepsCommand2) process.exit(1) // (code : -1)

console.log("Congratulations! You are ready. Follow the following commands to start");
console.log(`cd ${repoName} && npm start`);

console.log(`cd ${secondRepoName} && npm start`);


//npm publish --access=public
