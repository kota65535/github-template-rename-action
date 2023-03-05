const exec = require("./exec");
const micromatch = require("micromatch");
const path = require("path");
const fs = require("fs");
const { toJoined, toSnake, toCamel, toPascal } = require("./util");

function main(inputs) {
  const conversions = [
    {
      from: inputs.fromName,
      to: inputs.toName,
    },
    {
      from: toJoined(inputs.fromName),
      to: toJoined(inputs.toName),
    },
    {
      from: toSnake(inputs.fromName),
      to: toSnake(inputs.toName),
    },
    {
      from: toCamel(inputs.fromName),
      to: toCamel(inputs.toName),
    },
    {
      from: toPascal(inputs.fromName),
      to: toPascal(inputs.toName),
    },
  ];

  const cwd = process.cwd();

  const res = exec("git", ["ls-files"]);
  const trackedFiles = res.stdout.split("\n");
  const targetFiles = micromatch.not(trackedFiles, inputs.ignorePaths);
  console.info(targetFiles);

  // Replace file contents
  for (const t of targetFiles) {
    let s = fs.readFileSync(t, "utf-8");
    s = convert(conversions, s);
    conversions.forEach((c) => (s = s.replace(c.from, c.to)));
    fs.writeFileSync(t, s, "utf-8");
  }

  // Rename files and directories
  const targetFilesAndDirs = getDirsFromFiles(targetFiles);
  console.info(targetFilesAndDirs);

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
}

function convert(conversions, str) {
  conversions.forEach((c) => (str = str.replace(c.from, c.to)));
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

module.exports = main;
