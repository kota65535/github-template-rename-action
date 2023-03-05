const assert = require("assert");
const main = require("./main");
const fs = require("fs");

describe("util", () => {
  it("to joined", () => {
    main({
      fromName: "foo-bar",
      toName: "baz",
      ignorePaths: ["src/*.test.js"],
    });
    const txt = fs.readFileSync(".github/workflows/test.txt", "utf-8");
    assert.equal(txt, "baz,baz,baz,Baz\n");
  });

  afterAll(() => {
    const data = "foo-bar,foo_bar,fooBar,FooBar\n";
    fs.writeFileSync(".github/workflows/test.txt", data, "utf-8");
  });
});
