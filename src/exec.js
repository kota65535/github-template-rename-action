const execa = require("execa");
const core = require("@actions/core");

const exec = (file, options) => {
  core.info(`running command: ${file} ${(options || []).join(" ")}`);
  const res = execa.sync(file, options);
  if (res.failed) {
    throw new Error(`command failed: ${file} ${options}`);
  }
  return res;
};

module.exports = exec;
