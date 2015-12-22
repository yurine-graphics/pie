var toString = {}.toString;

function isType(type) {
  return function(obj) {
    return toString.call(obj) == '[object ' + type + ']';
  }
}

export default {
  isString: isType('String')
};
