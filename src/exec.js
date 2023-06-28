const core = require("@actions/core");
const execa = require("execa");

const exec = (file, options) => {
  core.info(`running command: ${file} ${(options || []).join(" ")}`);
  const res = execa.sync(file, options);
  core.info(res.stdout);
  return res;
};

module.exports = {
  exec,
};
