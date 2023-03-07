const core = require("@actions/core");
const { initOctokit, getRepo } = require("./github");
const { logJson } = require("./util");

const getInputs = async () => {
  let fromName = core.getInput("from-name");
  let toName = core.getInput("to-name");
  const ignorePaths = core
    .getInput("paths-ignore")
    .split("\n")
    .filter((f) => f);
  const commitMessage = core.getInput("commit-message");
  const dryRun = core.getInput("dry-run") === "true";

  let githubToken = core.getInput("github-token");
  const defaultGithubToken = core.getInput("default-github-token");

  githubToken = githubToken || process.env.GITHUB_TOKEN || defaultGithubToken;
  if (!githubToken) {
    throw new Error("No GitHub token provided");
  }

  if (!(fromName && toName)) {
    initOctokit(githubToken);
    const repo = await getRepo();
    if (!fromName) {
      if (!repo.template_repository) {
        throw new Error("Could not get template repository. Try GitHub personal access token for github-token input");
      }
      fromName = repo.template_repository.name;
    }
    if (!toName) {
      toName = repo.name;
    }
  }

  const ret = {
    fromName,
    toName,
    githubToken,
    commitMessage,
    ignorePaths,
    dryRun,
  };
  logJson("inputs", ret);
  return ret;
};

module.exports = {
  getInputs,
};
