/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const execSyncWrapper = (command) => {
  let stdout = null;
  try {
    stdout = execSync(command).toString().trim();
  } catch (error) {
    console.error(error);
  }
  return stdout;
};

const tag = execSyncWrapper("git describe --always");
const commit = execSyncWrapper("git log -1");
const branch = execSyncWrapper("git rev-parse --abbrev-ref HEAD");
const hash = execSyncWrapper("git rev-parse HEAD");

const folderPath = path.resolve("src", "utils", "Git");
const filePath = path.resolve(folderPath, "generatedGitInfo.json");
const contents = JSON.stringify({
  tag,
  commit,
  branch,
  hash,
});

if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
}

fs.writeFileSync(filePath, contents);
