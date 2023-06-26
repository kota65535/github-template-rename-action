const core = require("@actions/core");
const execa = require("execa");

const exec = (file, options) => {
  core.debug(`running command: ${file} ${(options || []).join(" ")}`);
  const res = execa.sync(file, options);
  core.debug(res.stdout);
  return res;
};

module.exports = {
  exec,
};
