const core = require("@actions/core");
const { getGitCredentials, setGitCredentials } = require("./git");
const { getInputs } = require("./input");
const { rename } = require("./rename");

async function main() {
  const inputs = await getInputs();
  const creds = getGitCredentials();
  setGitCredentials(inputs.githubToken);
  try {
    await rename(inputs);
  } finally {
    // Restore credentials
    setGitCredentials(creds);
  }
  core.setOutput("pr-branch", inputs.prBranch);
}

module.exports = {
  main,
};
