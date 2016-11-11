define(function(require, exports, module){var util=function(){var _0=require('./util');return _0.hasOwnProperty("default")?_0["default"]:_0}();

var colors = ['4A90E2', 'C374DE', 'F36342', 'F3A642', '93C93F', '50E3C2'];

function getColor(option, i) {
  var idx = i % colors.length;
  var color = option.colors[idx] || colors[idx];
  if(Array.isArray(color)) {
    return color;
  }
  if(color.charAt(0) != '#' && color.charAt(0) != 'r' && color.charAt(0) != 't') {
    color = '#' + color;
  }
  return color;
}


  function Radio(dom, data, option) {
    this.dom = util.isString(dom) ? document.querySelector(dom) : dom;
    if(!this.dom || !this.dom.getContext) {
      return;
    }
    this.data = data || [];
    this.option = option || {};
    this.option.colors = this.option.colors || [];
    this.option.offset = this.option.offset || 0;
    this.points = [];
    this.render();
  }

  Radio.prototype.render = function() {
    var y;var x;var context = this.dom.getContext('2d');
    var width = this.option.width || this.dom.getAttribute('width') || parseInt(window.getComputedStyle(this.dom, null).getPropertyValue('width')) || 300;
    var height = this.option.height || this.dom.getAttribute('height') || parseInt(window.getComputedStyle(this.dom, null).getPropertyValue('height')) || 150;
    var padding = this.option.padding === undefined ? [10, 10, 10, 10] : this.option.padding;
    if(Array.isArray(padding)) {
      switch(padding.length) {
        case 0:
          padding = [10, 10, 10, 10];
          break;
        case 1:
          padding[3] = padding[2] = padding[1] = padding[0];
          break;
        case 2:
          padding[3] = padding[1];
          padding[2] = padding[0];
          break;
        case 3:
          padding[3] = padding[1];
          break;
      }
    }
    else {
      padding = [padding, padding, padding, padding];
    }
    var paddingX = padding[1] + padding[3];
    var paddingY = padding[0] + padding[2];
    var min = Math.min(width - paddingX, height - paddingY);
    var lineWidth = this.option.lineWidth || 20;
    lineWidth = Math.max(lineWidth, 1);
    lineWidth = Math.min(lineWidth, min >> 1);
    var shadowWidth = this.option.shadowWidth || lineWidth;
    shadowWidth = Math.max(lineWidth, shadowWidth);
    shadowWidth = Math.min(shadowWidth, min >> 1);
    if(shadowWidth > lineWidth && shadowWidth == min >> 1) {
      var diff = shadowWidth - lineWidth;
      lineWidth -= diff / 2;
    }
    var size = String(this.option.size || 1);
    if(/%$/.test(size)) {
      size = parseFloat(size) * 0.01;
    }
    else {
      size = parseFloat(size);
    }
    size = Math.min(size, 1);
    size = Math.max(size, 0.2);
    var radio = (min * size - shadowWidth) >> 1;
    var sizeOffset = 0;
    if(size < 1) {
      sizeOffset = (height - paddingY) * (1 - size) * 0.5;
    }

    (function(){var _1= this.renderBg(context, radio, lineWidth, padding, width, shadowWidth, sizeOffset);x=_1[0];y=_1[1]}).call(this);
    this.renderFg(context, radio, lineWidth, x, y);
  }
  Radio.prototype.renderBg = function(context, radio, lineWidth, padding, width, shadowWidth, sizeOffset) {
    var x = ((width - padding[1] - padding[3]) >> 1) + padding[3];
    var y = padding[0] + radio + (shadowWidth >> 1) + sizeOffset;
    var shadowColor = this.option.shadowColor || 'rgba(0,0,0,0.1)';
    if(shadowWidth && shadowWidth > lineWidth) {
      context.beginPath();
      context.strokeStyle = shadowColor;
      context.lineWidth = shadowWidth;
      context.arc(x, y, radio, 0, (Math.PI / 180) * 360);
      context.stroke();
      context.closePath();
    }
    else {
      context.beginPath();
      context.strokeStyle = shadowColor;
      context.lineWidth = lineWidth;
      context.arc(x, y, radio, 0, (Math.PI / 180) * 360);
      context.stroke();
      context.closePath();
    }
    return [x, y];
  }
  Radio.prototype.renderFg = function(context, radio, lineWidth, x, y) {
    var self = this;
    var sum = 0;
    self.data.forEach(function(item) {
      sum += parseFloat(item);
    });
    var count = 0;
    self.data.forEach(function(item, i) {
      self.renderItem(item, i, context, radio, lineWidth, count, sum, x, y);
      count += parseFloat(item);
    });
  }
  Radio.prototype.renderItem = function(item, i, context, radio, lineWidth, count, sum, x, y) {
    var color = getColor(this.option, i);
    var start = (360*count/sum + this.option.offset);
    var num = parseFloat(item);
    var end = start + (360*num/sum);
    if(Array.isArray(color)) {
      var count = 0;
      color.forEach(function(item) {
        context.beginPath();
        var arr = item.split(/\s+/);
        var per = parseFloat(arr[0]);
        var cl = arr[1];
        if(cl.charAt(0) != '#' && cl.charAt(0) != 'r' && cl.charAt(0) != 't') {
          cl = '#' + cl;
        }
        var w = per * lineWidth;
        var rd = radio - lineWidth * 0.5 + lineWidth * per * 0.5 + count;
        count += lineWidth * per;
        context.strokeStyle = cl;
        context.lineWidth = w + 0.5; //防止白边
        context.arc(x, y, rd, start * Math.PI / 180, end * Math.PI / 180);
        context.stroke();
        context.closePath();
      });
    }
    else {
      context.beginPath();
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.arc(x, y, radio, start * Math.PI / 180, end * Math.PI / 180);
      context.stroke();
      context.closePath();
    }

    var deg = start + (end - start) * 0.5;
    if(deg > 270) {
      var xx = x + Math.sin((deg - 270) * Math.PI / 180) * radio;
      var yy = y - Math.cos((deg - 270) * Math.PI / 180) * radio;
      this.points.push([xx, yy]);

    }
    else if(deg > 180) {
      var xx = x - Math.cos((deg - 180) * Math.PI / 180) * radio;
      var yy = y - Math.sin((deg - 180) * Math.PI / 180) * radio;
      this.points.push([xx, yy]);
    }
    else if(deg > 90) {
      var xx = x - Math.sin((deg - 90) * Math.PI / 180) * radio;
      var yy = y + Math.cos((deg - 90) * Math.PI / 180) * radio;
      this.points.push([xx, yy]);
    }
    else {
      var xx = x + Math.cos((deg) * Math.PI / 180) * radio;
      var yy = y + Math.sin((deg) * Math.PI / 180) * radio;
      this.points.push([xx, yy]);
    }
  }

  var _2={};_2.COLORS={};_2.COLORS.get =function() {
    return colors;
  }
Object.keys(_2).forEach(function(k){Object.defineProperty(Radio,k,_2[k])});

exports["default"]=Radio;
});