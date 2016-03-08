define(function(require, exports, module){var toString = {}.toString;

function isType(type) {
  return function(obj) {
    return toString.call(obj) == '[object ' + type + ']';
  }
}

function find(context, s, maxWidth, i1, i2, w) {
  if(i1 == i2 - 1) {
    return i1;
  }
  w = w || context.measureText(s).width;
  if(w == maxWidth) {
    return i2;
  }
  else if(w > maxWidth) {
    var i = i2 - (Math.floor((i2 - i1) / 2));
    var s2 = s.slice(0, i);
    var w2 = context.measureText(s2).width;
    if(w2 > maxWidth) {
      return find(context, s2, maxWidth, 0, i, w2);
    }
    else {
      return find(context, s, maxWidth, i, i2,  w);
    }
  }
  else {
    var i = i1 + (Math.ceil((i2 - i1) / 2));
    return find(context, s.slice(0, i), maxWidth, i, i2);
  }
}

exports["default"]={
  isString: isType('String'),
  calHeight: function(context, s, maxWidth, w) {
    var arr = [];
    var len = s.length;
    var i = find(context, s, maxWidth, 0, len, w);
    i = Math.max(1, i);
    arr.push(s.slice(0, i));
    while(i < len - 1) {
      s = s.slice(i);
      len = s.length;
      i = find(context, s, maxWidth, 0, len);
      i = Math.max(1, i);
      arr.push(s.slice(0, i));
    }
    return arr;
  },
  calFont: function(s) {
    var fontStyle = 'normal';
    var fontVariant = 'normal';
    var fontWeight = 'normal';
    var fontSize = 12;
    var lineHeight = '1.5';
    if(/^[a-z]/i.test(s)) {
      fontStyle = /^[a-z]+/.exec(s)[0];
      s = s.replace(/^[a-z]+\s+/i, '');
    }
    if(/^[a-z]/i.test(s)) {
      fontVariant = /^[a-z]+/.exec(s)[0];
      s = s.replace(/^[a-z]+\s+/i, '');
    }
    if(/^[a-z]/i.test(s)) {
      fontWeight = /^[a-z]+/.exec(s)[0];
      s = s.replace(/^[a-z]+\s+/i, '');
    }
    if(/^\d/.test(s)) {
      fontSize = parseInt(s);
      s = s.replace(/^[\d.a-z]+/i, '');
    }
    if(/^\//.test(s)) {
      s = s.slice(1);
      lineHeight = /^[\d.a-z]+/i.exec(s)[0];
      s = s.replace(/^[\d.a-z]+\s+/i, '');
      if(/[a-z]$/i.test(lineHeight)) {
        lineHeight = parseInt(lineHeight);
      }
      else {
        lineHeight *= fontSize;
      }
    }
    var fontFamily = s;
    return {
      fontStyle:fontStyle,
      fontVariant:fontVariant,
      fontFamily:fontFamily,
      fontWeight:fontWeight,
      fontSize:fontSize,
      lineHeight:lineHeight
    };
  },
  rgb2int:function(s) {
    var r;
    var g;
    var b;
    if(s.charAt(0) == 'r') {
      var arr = [].slice.call(s.match(/[\d\.]+/g));
      var opacity = parseFloat(arr[3]) || 1;
      r = parseInt(arr[0]);
      g = parseInt(arr[1]);
      b = parseInt(arr[2]);
      r = Math.min(255, r + (255 - r) * (1 - opacity));
      g = Math.min(255, g + (255 - g) * (1 - opacity));
      b = Math.min(255, b + (255 - b) * (1 - opacity));
      r = Math.floor(r);
      g = Math.floor(g);
      b = Math.floor(b);
    }
    else {
      s = s.replace('#', '');
      if(s.length == 3) {
        r = parseInt(s.charAt(0) + s.charAt(0), 16);
        g = parseInt(s.charAt(1) + s.charAt(1), 16);
        b = parseInt(s.charAt(2) + s.charAt(2), 16);
      }
      else {
        r = parseInt(s.slice(0, 2), 16);
        g = parseInt(s.slice(2, 4), 16);
        b = parseInt(s.slice(4, 6), 16);
      }
    }
    return [r, g, b];
  }
};
});