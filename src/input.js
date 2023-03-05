const core = require("@actions/core");
const { getOctokit } = require("@actions/github");
const { context } = require("@actions/github");

const getInputs = async () => {
  let fromName = core.getInput("from-name");
  let toName = core.getInput("to-name");
  const githubToken = core.getInput("github-token");
  const commitMessage = core.getInput("commit-message");
  const dryRun = core.getInput("dry-run") === "true";
  const ignorePaths = core
    .getInput("ignore-paths")
    .split("\n")
    .filter((f) => f);

  if (!(fromName && toName)) {
    const octokit = getOctokit(githubToken);
    const res = await octokit.rest.repos.get({
      owner: context.repo.owner,
      repo: context.repo.repo,
    });
    console.log(res);
    if (!fromName) {
      fromName = res.data.template_repository.name;
    }
    if (!toName) {
      toName = res.data.name;
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
  console.info(ret);
  return ret;
};

module.exports = {
  getInputs,
};
