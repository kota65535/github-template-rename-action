const assert = require("assert");
const fs = require("fs");
const { rename } = require("./main");

describe("rename", () => {
  it("rename 1", () => {
    rename({
      fromName: "foo-bar",
      toName: "baz",
      ignorePaths: ["src/*.test.js", ".*/**/test.yml"],
      dryRun: true,
    });
    const txt = fs.readFileSync(".github/test.txt", "utf-8");
    assert.equal(txt, "baz,baz,baz,Baz\n");
  });
  it("rename 2", () => {
    rename({
      fromName: "FooBar",
      toName: "hoge_piyo",
      ignorePaths: ["src/*.test.js", ".*/**/test.yml"],
      dryRun: true,
    });
    const txt = fs.readFileSync(".github/test.txt", "utf-8");
    assert.equal(txt, "hoge-piyo,hoge_piyo,hogePiyo,HogePiyo\n");
  });

  afterEach(() => {
    const data = "foo-bar,foo_bar,fooBar,FooBar\n";
    fs.writeFileSync(".github/test.txt", data, "utf-8");
  });
});
