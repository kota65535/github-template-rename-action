const core = require("@actions/core");

const getInputs = () => {
  const fromName = core.getInput("from-name");
  const toName = core.getInput("to-name");
  const githubToken = core.getInput("github-token");
  const commitMessage = core.getInput("commit-message");
  const ignorePaths = core.getInput("ignore-paths");

  const ret = {
    fromName,
    toName,
    githubToken,
    commitMessage,
    ignorePaths
  };
  console.info(ret);
  return ret;
};

module.exports = getInputs;
