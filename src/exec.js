const execa = require("execa");
const core = require("@actions/core");

const exec = (file, options) => {
  core.info(`running command: ${file} ${(options || []).join(" ")}`);
  return execa.sync(file, options);
};

module.exports = {
  exec,
};
