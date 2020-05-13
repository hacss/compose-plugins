const { expect } = require("chai");
const compose = require("../index.js");

describe("compose function", () => {
  it("combines properties associated with each plugin", () => {
    const expected = ["margin-x", "margin-y", "padding-x", "padding-y"];

    const [_, actual] = compose(
      x => x,
      [x => x, ["margin-x"]],
      x => x,
      [x => x, ["margin-y", "padding-x", "padding-y"]],
    );

    expect(actual).to.deep.equal(expected);
  });

  it("composes functions from right to left", () => {
    const add = n => decls => {
      Object.keys(decls).forEach(key => (decls[key] = decls[key] + n));
      return decls;
    };

    const mult = n => decls => {
      Object.keys(decls).forEach(key => (decls[key] = decls[key] * n));
      return decls;
    };

    const expected = {
      "margin-x": 37,
      "margin-y": 82,
    };

    const actual = compose(add(1), mult(3), add(2))[0]({
      "margin-x": 10,
      "margin-y": 25,
    });

    expect(actual).to.deep.equal(expected);
  });

  it("does not mutate declarations", () => {
    const add = n => decls => {
      Object.keys(decls).forEach(key => (decls[key] = decls[key] + n));
      return decls;
    };

    const decls = { foo: 1 };
    const result = compose(add(1), add(2), add(3))[0](decls);

    expect(decls.foo).to.equal(1);
    expect(result.foo).to.equal(7);
  });

  it("bypasses plugins that don't return declaration objects", () => {
    const plugins = [
      decls => decls,
      decls => null,
      decls => {
        delete decls["color"];
        return decls;
      },
    ];

    const actual = compose.apply(null, plugins)[0]({
      background: "white",
      color: "black",
    });
    expect(actual).to.deep.equal({ background: "white" });
  });

  it("deduplicates recognized properties", () => {
    const [_, properties] = compose(
      [x => x, ["padding-x"]],
      [x => x, ["padding-x"]],
    );
    expect(properties).to.deep.equal(["padding-x"]);
  });

  it("removes non-string properties", () => {
    const actual = compose([x => x, ["foo", 1]], [x => x, ["bar", false]])[1];
    expect(actual).to.deep.equal(["foo", "bar"]);
  });
});
