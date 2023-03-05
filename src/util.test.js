const assert = require("assert");
const {toJoined, toSnake, toCamel, toPascal} = require("./util");

describe("util", () => {
  it("to joined", () => {
    assert.equal(toJoined("sample-basic"), "samplebasic")
  });
  it("to snake case", () => {
    assert.equal(toSnake("sample-basic"), "sample_basic")
  });
  it("to camel case", () => {
    assert.equal(toCamel("sample-basic"), "sampleBasic")
  });
  it("to pascal case", () => {
    assert.equal(toPascal("sample-basic"), "SampleBasic")
  });
});
