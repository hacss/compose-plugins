var composePlugins = function(a,b) {
  return [
    function(decls) {
      return getFn(a)(getFn(b)(decls));
    },
    [].concat(a[1] || []).concat(b[1] || []),
  ];
  
  function getFn(x) {
    if (typeof x === "object") {
      return x[0];
    }
    return x;
  };
};

module.exports = function() {
  var result = function(x) { return x; };
  for (var i = arguments.length - 1; i >= 0; i--) {
    result = composePlugins(arguments[i], result);
  }
  return result;
};
