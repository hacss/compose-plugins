const { expect } = require("chai");
const compose = require("../index.js");

describe("compose function", () => {
  it("combines properties associated with each plugin", () => {
    const expected = ["margin-x", "margin-y", "padding-x", "padding-y"];

    const [ _, actual ] = compose(
      x => x,
      [ x => x, ["margin-x"] ],
      x => x,
      [ x => x, ["margin-y", "padding-x", "padding-y"] ],
    );

    expect(actual).to.deep.equal(expected);
  });

  it("composes functions from right to left", () => {
    const add = n => decls => {
      Object.keys(decls).forEach(key => decls[key] = decls[key] + n);
      return decls;
    };

    const mult = n => decls => {
      Object.keys(decls).forEach(key => decls[key] = decls[key] * n);
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
});
