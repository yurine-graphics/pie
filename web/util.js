define(function(require, exports, module){var toString = {}.toString;

function isType(type) {
  return function(obj) {
    return toString.call(obj) == '[object ' + type + ']';
  }
}

exports["default"]={
  isString: isType('String')
};
});