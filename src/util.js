const core = require("@actions/core");

function toJson(obj) {
  return JSON.stringify(obj, null, 2);
}

function logJson(message, obj) {
  core.startGroup(message);
  core.info(toJson(obj));
  core.endGroup();
}

function ensurePrefix(prefix, str) {
  return str.startsWith(prefix) ? str : `${prefix}${str}`;
}

module.exports = {
  toJson,
  logJson,
  ensurePrefix,
};
