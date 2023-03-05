const core = require("@actions/core");
const main = require("./main");
const getInputs = require("./input");

try {
  const inputs = getInputs();
  main(inputs);
} catch (error) {
  core.setFailed(error.message);
}
