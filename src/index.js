const core = require("@actions/core");
const { main } = require("./main");

try {
  main();
} catch (e) {
  core.setFailed(e.message);
}
