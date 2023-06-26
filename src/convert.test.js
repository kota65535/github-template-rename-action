const assert = require("assert");
const { toCamel, toJoined, toKebab, toPascal, toSnake } = require("./convert");

describe("util", () => {
  it("kebab to joined", () => {
    assert.equal(toJoined("foo-bar"), "foobar");
  });
  it("kebab to snake case", () => {
    assert.equal(toSnake("foo-bar"), "foo_bar");
  });
  it("kebab to camel case", () => {
    assert.equal(toCamel("foo-bar"), "fooBar");
  });
  it("kebab to pascal case", () => {
    assert.equal(toPascal("foo-bar"), "FooBar");
  });
  it("kebab to kebab", () => {
    assert.equal(toKebab("foo-bar"), "foo-bar");
  });
  it("snake to kebab", () => {
    assert.equal(toKebab("foo_bar"), "foo-bar");
  });
  it("camel to kebab", () => {
    assert.equal(toKebab("fooBar"), "foo-bar");
  });
  it("pascal to kebab", () => {
    assert.equal(toKebab("FooBar"), "foo-bar");
  });
});
