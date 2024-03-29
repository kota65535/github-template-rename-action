const core = require("@actions/core");
const { getRepo, initOctokit } = require("./github");
const { logJson } = require("./util");

const getInputs = async () => {
  let fromName = core.getInput("from-name");
  let toName = core.getInput("to-name");
  const ignorePaths = core
    .getInput("paths-ignore")
    .split("\n")
    .filter((f) => f);
  const commitMessage = core.getInput("commit-message");
  let githubToken = core.getInput("github-token");
  const defaultGithubToken = core.getInput("default-github-token");
  const prBranch = core.getInput("pr-branch");
  let prBase = core.getInput("pr-base-branch");
  const prTitle = core.getInput("pr-title");
  const prLabels = core
    .getInput("pr-labels")
    .split("\n")
    .filter((f) => f);
  const dryRun = core.getInput("dry-run") === "true";

  githubToken = githubToken || process.env.GITHUB_TOKEN || defaultGithubToken;
  if (!githubToken) {
    throw new Error("No GitHub token provided");
  }

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
  if (!prBase) {
    prBase = repo.default_branch;
  }

  const ret = {
    fromName,
    toName,
    ignorePaths,
    commitMessage,
    githubToken,
    prBranch,
    prBase,
    prTitle,
    prLabels,
    dryRun,
  };
  logJson("inputs", ret);
  return ret;
};

module.exports = {
  getInputs,
};
