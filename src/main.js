const micromatch = require("micromatch");
const path = require("path");
const fs = require("fs");
const { toJoined, toSnake, toCamel, toPascal, toKebab } = require("./util");
const { getGitCredentials, setGitCredentials, listFiles, commitAndPush } = require("./git");
const { getInputs } = require("./input");

async function main() {
  const creds = getGitCredentials();
  const inputs = await getInputs();
  try {
    rename(inputs);
  } finally {
    setGitCredentials(creds);
  }
}

function rename(inputs) {
  setGitCredentials(inputs.githubToken);

  const trackedFiles = listFiles();
  const targetFiles = micromatch.not(trackedFiles, inputs.ignorePaths);
  console.info(`${targetFiles.length} files`);

  const conversions = getConversions(inputs);
  console.info("conversions:", conversions);

  // Replace file contents
  for (const t of targetFiles) {
    let s = fs.readFileSync(t, "utf-8");
    s = convert(conversions, s);
    fs.writeFileSync(t, s, "utf-8");
  }

  // Get directories where the files are located
  const targetFilesAndDirs = getDirsFromFiles(targetFiles);
  console.info(`${targetFilesAndDirs.length} files and directories`);

  // Rename files and directories
  const cwd = process.cwd();
  for (const t of targetFilesAndDirs) {
    const fromBase = path.basename(t);
    const fromDir = path.dirname(t);
    const toBase = convert(conversions, fromBase);
    const toDir = convert(conversions, fromDir);
    if (fromBase !== toBase) {
      process.chdir(toDir);
      fs.renameSync(fromBase, toBase);
      process.chdir(cwd);
    }
  }

  if (!inputs.dryRun) {
    commitAndPush(inputs.commitMessage);
  } else {
    console.info("Skip commit & push because dry-run is true");
  }
}

function getConversions(inputs) {
  const fromName = toKebab(inputs.fromName);
  const toName = toKebab(inputs.toName);
  return [
    {
      from: fromName,
      to: toName,
    },
    {
      from: toJoined(fromName),
      to: toJoined(toName),
    },
    {
      from: toSnake(fromName),
      to: toSnake(toName),
    },
    {
      from: toCamel(fromName),
      to: toCamel(toName),
    },
    {
      from: toPascal(fromName),
      to: toPascal(toName),
    },
  ];
}

function convert(conversions, str) {
  conversions.forEach((c) => (str = str.replaceAll(c.from, c.to)));
  return str;
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
