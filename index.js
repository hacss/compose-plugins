var clone = function (x) {
  return JSON.parse(JSON.stringify(x));
};

var validDecls = function (x, fallback) {
  if (!x) {
    return fallback;
  }

  if (typeof x !== "object") {
    return fallback;
  }

  if (x instanceof Array) {
    return fallback;
  }

  for (var key in x) {
    switch (typeof x[key]) {
      case "string":
      case "number":
      case "boolean":
        continue;
      default:
        return fallback;
    }
  }

  return x;
};

var getFn = function (x) {
  if (!x) {
    return function (x) {
      return x;
    };
  }

  if (typeof x[0] === "function") {
    return x[0];
  }
  if (typeof x === "function") {
    return x;
  }
  return function (x) {
    return x;
  };
};

var composePlugins = function (a, b) {
  return [
    function (decls) {
      var resb = validDecls(getFn(b)(clone(decls)), decls);
      var resa = validDecls(getFn(a)(clone(resb)), resb);
      return resa;
    },
    []
      .concat((a || [])[1] || [])
      .concat((b || [])[1] || [])
      .reduce(function (xs, x) {
        return xs.indexOf(x) === -1 && typeof x === "string"
          ? xs.concat(x)
          : xs;
      }, []),
  ];
};

module.exports = function () {
  var result = function (x) {
    return x;
  };
  for (var i = arguments.length - 1; i >= 0; i--) {
    result = composePlugins(arguments[i], result);
  }
  return result;
};
