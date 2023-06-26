const assert = require("assert");
const fs = require("fs");
const { createConversions } = require("./convert");
const { listFiles } = require("./git");
const { ignoreFiles, replaceFiles, renameFiles } = require("./rename");

describe("replace files", () => {
  it("1", () => {
    let files = listFiles();
    [files] = ignoreFiles(files, ["README.md", "src/*.test.js", ".*/**/test.yml"]);
    const conversions = createConversions("foo-bar", "baz");
    replaceFiles(files, conversions);
    const txt = fs.readFileSync(".github/test.txt", "utf-8");
    assert.equal(txt, "baz,baz,baz,Baz\n");
  });
  it("2", () => {
    let files = listFiles();
    [files] = ignoreFiles(files, ["README.md", "src/*.test.js", ".*/**/test.yml"]);
    const conversions = createConversions("FooBar", "HogePiyo");
    replaceFiles(files, conversions);
    const txt = fs.readFileSync(".github/test.txt", "utf-8");
    assert.equal(txt, "hoge-piyo,hoge_piyo,hogePiyo,HogePiyo\n");
  });

  afterEach(() => {
    const data = "foo-bar,foo_bar,fooBar,FooBar\n";
    fs.writeFileSync(".github/test.txt", data, "utf-8");
  });
});

describe("rename files", () => {
  it("1", () => {
    let files = listFiles();
    [files] = ignoreFiles(files, ["README.md", "src/*.test.js", ".*/**/test.yml"]);
    const conversions = createConversions("test", "baz");
    renameFiles(files, conversions);
    assert.equal(fs.existsSync(".github/baz.txt"), true);
  });

  afterEach(() => {
    fs.renameSync(".github/baz.txt", ".github/test.txt");
  });
});
