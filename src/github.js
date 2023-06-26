const { context } = require("@actions/github");
const { getOctokit } = require("@actions/github");

let octokit;

const initOctokit = (token) => {
  octokit = getOctokit(token);
};

const getRepo = async (owner, repo) => {
  owner ??= context.repo.owner;
  repo ??= context.repo.repo;
  const res = await octokit.rest.repos.get({
    owner,
    repo,
  });
  return res.data;
};

const addLabels = async (prNum, labels) => {
  const res = await octokit.rest.issues.addLabels({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: prNum,
    labels,
  });
  return res.data;
};

const createPr = async (title, head, base) => {
  const res = await octokit.rest.pulls.create({
    owner: context.repo.owner,
    repo: context.repo.repo,
    title,
    head,
    base,
  });
  return res.data;
};

const updatePr = async (prNum, title, head, base) => {
  const res = await octokit.rest.pulls.update({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: prNum,
    title,
    head,
    base,
  });
  return res.data;
};

const listPrs = async (head, base) => {
  const res = await octokit.rest.pulls.list({
    owner: context.repo.owner,
    repo: context.repo.repo,
    head: `${context.repo.owner}:${head}`,
    base,
  });
  return res.data;
};

module.exports = {
  initOctokit,
  getRepo,
  createPr,
  updatePr,
  listPrs,
  addLabels,
};
