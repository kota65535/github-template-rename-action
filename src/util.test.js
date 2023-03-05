const assert = require("assert");
const { toJoined, toSnake, toCamel, toPascal } = require("./util");

describe("util", () => {
  it("to joined", () => {
    expect();
    assert.equal(toJoined("foo-bar"), "foobar");
  });
  it("to snake case", () => {
    assert.equal(toSnake("foo-bar"), "foo_bar");
  });
  it("to camel case", () => {
    assert.equal(toCamel("foo-bar"), "fooBar");
  });
  it("to pascal case", () => {
    assert.equal(toPascal("foo-bar"), "FooBar");
  });
});
