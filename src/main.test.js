const assert = require("assert");
const fs = require("fs");
const { rename } = require("./main");

describe("rename", () => {
  it("rename", () => {
    rename({
      fromName: "foo-bar",
      toName: "baz",
      ignorePaths: ["src/*.test.js", ".*/**/test.yml"],
      dryRun: true,
    });
    const txt = fs.readFileSync(".github/test.txt", "utf-8");
    assert.equal(txt, "baz,baz,baz,Baz\n");
  });

  afterAll(() => {
    const data = "foo-bar,foo_bar,fooBar,FooBar\n";
    fs.writeFileSync(".github/test.txt", data, "utf-8");
  });
});
