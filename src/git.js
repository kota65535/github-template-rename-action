const core = require("@actions/core");
const { exec } = require("./exec");

const extraHeaderKey = `http.https://github.com/.extraHeader`;

function listFiles() {
  const { stdout } = exec("git", ["ls-files"]);
  return stdout.split("\n").filter((s) => s);
}

function setUserAsBot() {
  exec("git", ["config", "user.email", "github-actions[bot]@users.noreply.github.com"]);
  exec("git", ["config", "user.name", "github-actions[bot]"]);
}

function getGitCredentials() {
  try {
    const { stdout } = exec("git", ["config", "--get", extraHeaderKey, "^AUTHORIZATION: basic"]);
    return stdout;
  } catch (e) {
    return "";
  }
}

function setGitCredentials(token) {
  if (!token) {
    return;
  }
  // cf. https://github.com/actions/checkout/blob/main/src/git-auth-helper.ts#L57
  const base64Token = Buffer.from(`x-access-token:${token}`, "utf8").toString("base64");
  core.setSecret(base64Token);
  exec("git", ["config", "--unset-all", extraHeaderKey, "^AUTHORIZATION: basic"]);
  exec("git", ["config", extraHeaderKey, `AUTHORIZATION: basic ${base64Token}`]);
}

function commitAndPush(message) {
  setUserAsBot();
  exec("git", ["add", "."]);
  try {
    exec("git", ["diff-index", "--cached", "--quiet", "HEAD"]);
    return;
  } catch (e) {
    // do nothing
  }
  exec("git", ["commit", "-m", message]);
  exec("git", ["push", "origin", "HEAD"]);
}

module.exports = {
  listFiles,
  getGitCredentials,
  setGitCredentials,
  commitAndPush,
};
