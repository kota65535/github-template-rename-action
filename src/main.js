const path = require("path");
const fs = require("fs");
const core = require("@actions/core");
const micromatch = require("micromatch");
const { createConversions, convert } = require("./convert");
const { getGitCredentials, setGitCredentials, listFiles, commitAndPush } = require("./git");
const { getInputs } = require("./input");
const { logJson } = require("./util");

async function main() {
  const inputs = await getInputs();
  const creds = getGitCredentials();
  setGitCredentials(inputs.githubToken);
  try {
    rename(inputs);
  } finally {
    // Restore credentials
    setGitCredentials(creds);
  }
}

function rename(inputs) {
  let files = listFiles();
  let ignored;
  [files, ignored] = ignoreFiles(files, inputs.ignorePaths);
  logJson(`ignored ${ignored.length} files`, ignored);
  logJson(`replacing ${files.length} files`, files);

  const conversions = createConversions(inputs.fromName, inputs.toName);
  logJson("conversions", conversions);

  // Replace file contents
  for (const f of files) {
    const s = fs.readFileSync(f, "utf8");
    const converted = convert(conversions, s);
    if (s !== converted) {
      fs.writeFileSync(f, converted, "utf8");
    }
  }

  // Get directories where the files are located
  const filesAndDirs = getDirsFromFiles(files);
  logJson(`renaming ${filesAndDirs.length} files and directories`, filesAndDirs);

  // Rename files and directories
  const cwd = process.cwd();
  for (const f of filesAndDirs) {
    const fromBase = path.basename(f);
    const fromDir = path.dirname(f);
    const toBase = convert(conversions, fromBase);
    const toDir = convert(conversions, fromDir);
    if (fromBase !== toBase) {
      process.chdir(toDir);
      fs.renameSync(fromBase, toBase);
      process.chdir(cwd);
    }
  }

  if (!inputs.dryRun) {
    const sha = commitAndPush(inputs.commitMessage);
    core.setOutput("commit-hash", sha);
  } else {
    core.info("Skip commit & push because dry-run is true");
  }
}

function ignoreFiles(files, ignorePaths) {
  if (ignorePaths.length) {
    return [micromatch.not(files, ignorePaths), micromatch(files, ignorePaths)];
  } else {
    return [files, []];
  }
}

function getDirsFromFiles(files) {
  let ret = [];
  let dirList = [];
  const dirSet = new Set();
  for (const f of files) {
    let dir = f;
    while (true) {
      dir = path.dirname(dir);
      if (dir === ".") {
        break;
      }
      if (!dirSet.has(dir)) {
        dirList.push(dir);
      }
      dirSet.add(dir);
    }
    dirList.reverse();
    ret = ret.concat(dirList);
    dirList = [];
    ret.push(f);
  }
  return ret;
}

module.exports = {
  main,
  rename,
};
