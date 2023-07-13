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


const gitCheckoutCommand = `git clone --depth 1 https://github.com/deveshps/mfe-host.git ${repoName}`;
const gitCheckoutCommandForMfeTwo = `git clone --depth 1 https://github.com/deveshps/mfe-login.git ${secondRepoName}`;

const installDepsCommand = `cd ${repoName} && npm install`;

const installDepsCommand2 = `cd ${secondRepoName} && npm install`;



console.log("Cloning the repository with name ",repoName,secondRepoName);
const checkOut = runCommand(gitCheckoutCommand);
const checkOutForMfeTwo = runCommand(gitCheckoutCommandForMfeTwo)

if(!checkOut || !checkOutForMfeTwo) process.exit(1); // (code : -1)

console.log("Installing dependencies for ",repoName,secondRepoName);

const installedDeps = runCommand(installDepsCommand);
const installedDeps2 = runCommand(installDepsCommand2);


if(!installDepsCommand || !installDepsCommand2) process.exit(1) // (code : -1)

console.log("Congratulations! You are ready. Follow the following commands to start");
console.log(`cd ${repoName} && npm start`);

console.log(`cd ${secondRepoName} && npm start`);


//npm publish --access=public
