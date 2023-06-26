const assert = require("assert");
const { createConversions } = require("./convert");

describe("util", () => {
  it("convert to joined", () => {
    const conversions = createConversions("foo-bar", "hoge-piyo");
    assert.deepEqual(conversions, [
      {
        from: "foo-bar",
        to: "hoge-piyo",
      },
      {
        from: "foo bar",
        to: "hoge piyo",
      },
      {
        from: "foobar",
        to: "hogepiyo",
      },
      {
        from: "fooBar",
        to: "hogePiyo",
      },
      {
        from: "FooBar",
        to: "HogePiyo",
      },
      {
        from: "foo_bar",
        to: "hoge_piyo",
      },
      {
        from: "FOO_BAR",
        to: "HOGE_PIYO",
      },
      {
        from: "foo-bar",
        to: "hoge-piyo",
      },
    ]);
  });
});
