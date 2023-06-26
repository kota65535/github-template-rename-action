const fs = require("fs");
const path = require("path");
const core = require("@actions/core");
const micromatch = require("micromatch");
const { convert, createConversions } = require("./convert");
const {
  commit,
  createBranch,
  getDiffCommits,
  getGitCredentials,
  listFiles,
  push,
  reset,
  setGitCredentials,
} = require("./git");
const { addLabels, createPr, listPrs, updatePr } = require("./github");
const { getInputs } = require("./input");
const { ensurePrefix, logJson } = require("./util");

async function main() {
  const inputs = await getInputs();
  const creds = getGitCredentials();
  setGitCredentials(inputs.githubToken);
  try {
    await rename(inputs);
  } finally {
    // Restore credentials
    setGitCredentials(creds);
  }
  core.setOutput("pr-branch", inputs.prBranch);
}

async function rename(inputs) {
  reset();

  let files = listFiles();
  let ignored;
  [files, ignored] = ignoreFiles(files, inputs.ignorePaths);
  logJson(`ignored ${ignored.length} files`, ignored);

  const conversions = createConversions(inputs.fromName, inputs.toName);
  logJson("conversions", conversions);

  replaceFiles(files, conversions);
  files = renameFiles(files, inputs.fromName, inputs.toName);
  logJson(`replaced & renamed ${files.length} files`, files);

  const prBaseWithRemote = ensurePrefix("origin/", inputs.prBase);

  // Checkout PR branch
  createBranch(inputs.prBranch, prBaseWithRemote);
  commit(files, "renamed");

  if (inputs.dryRun) {
    core.info("Skip creating PR because dry-run is true");
    return;
  }

  // Push
  push();

  // Create PR if there is any commit
  if (getDiffCommits(prBaseWithRemote, inputs.prBranch).length > 0) {
    await createOrUpdatePr(inputs);
  }
}

function replaceFiles(files, conversions) {
  const existingFiles = files.filter((f) => fs.existsSync(f));

  // Replace file contents
  for (const f of existingFiles) {
    const s = fs.readFileSync(f, "utf8");
    const converted = convert(conversions, s);
    if (s !== converted) {
      fs.writeFileSync(f, converted, "utf8");
    }
  }
}

function renameFiles(files, conversions) {
  // Get directories where the files are located
  const filesAndDirs = getDirsFromFiles(files);
  const existingFilesAndDirs = filesAndDirs.filter((f) => fs.existsSync(f));

  // Rename files and directories
  const cwd = process.cwd();
  for (const f of existingFilesAndDirs) {
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

  return files.map((f) => convert(conversions, f));
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

async function createOrUpdatePr(inputs) {
  const prs = await listPrs(inputs.prBranch, inputs.prBase);
  let prNum;
  if (prs.length) {
    prNum = prs[0].number;
    core.info(`updating existing PR #${prNum}`);
    await updatePr(prNum, inputs.prTitle, inputs.prBranch, inputs.prBase);
  } else {
    core.info("creating PR");
    const res = await createPr(inputs.prTitle, inputs.prBranch, inputs.prBase);
    prNum = res.number;
  }
  if (inputs.prLabels.length > 0) {
    await addLabels(prNum, inputs.prLabels);
  }
}

module.exports = {
  main,
  rename,
};
