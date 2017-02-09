define(function(require, exports, module){var util=function(){var _0=require('./util');return _0.hasOwnProperty("default")?_0["default"]:_0}();

window.requestAnimationFrame = function() {
  return window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
}();

var colors = ['4A90E2', 'C374DE', 'F36342', 'F3A642', '93C93F', '50E3C2'];

function getColor(option, i) {
  var color = option.colors[i];
  if(!color) {
    color = colors[i % colors.length];
  }
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
    this.destroy = false;
    this.context = this.dom.getContext('2d');
    this.width = this.option.width || this.dom.getAttribute('width') || parseInt(window.getComputedStyle(this.dom, null).getPropertyValue('width')) || 300;
    this.height = this.option.height || this.dom.getAttribute('height') || parseInt(window.getComputedStyle(this.dom, null).getPropertyValue('height')) || 150;
    this.animationDegree = this.option.animationDegree || 0;
    this.speed = parseInt(this.option.speed) || 1;
    this.render();
  }

  Radio.prototype.render = function() {
    var data;var offset;var ease;var y;var x;var self = this;
    var context = self.context;
    var width = self.width;
    var height = self.height;
    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = "source-over";
    var padding = self.option.padding === undefined ? [10, 10, 10, 10] : self.option.padding;
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
    var lineWidth = self.option.lineWidth || 20;
    lineWidth = Math.max(lineWidth, 1);
    lineWidth = Math.min(lineWidth, min >> 1);
    var shadowWidth = self.option.shadowWidth || lineWidth;
    shadowWidth = Math.max(lineWidth, shadowWidth);
    shadowWidth = Math.min(shadowWidth, min >> 1);
    if(shadowWidth > lineWidth && shadowWidth == min >> 1) {
      var diff = shadowWidth - lineWidth;
      lineWidth -= diff / 2;
    }
    var size = String(self.option.size || 1);
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

    (function(){var _1= self.renderBg(context, radio, lineWidth, padding, width, shadowWidth, sizeOffset);x=_1[0];y=_1[1]}).call(this);
    self.renderFg(context, radio, lineWidth, x, y);
    
    if(self.option.animation) {!function(){
      self.speed = Math.max(self.speed, 1);
      ease = self.option.ease;
      offset = self.option.offset;
      data = context.getImageData(0, 0, width, height);
      context.clearRect(0, 0, width, height);
      // destination-in方式老webkit有兼容问题失效，用destination-out方式替代，宽度需要多2px才能盖住很神奇
      context.lineWidth += 2;
      function draw() {
        if(self.destroy) {
          return;
        }
        context.clearRect(0, 0, width, height);
        var start = offset;
        var end = Math.min(360, self.animationDegree) + offset;
        // destination-out方式时，当角度相同，理应图形全空，可是却无效，所以应该不绘制
        if(start != end) {
          context.globalCompositeOperation = "source-over";
          context.putImageData(data, 0, 0);
          context.globalCompositeOperation = "destination-out";
          context.beginPath();
          context.arc(x, y, radio, start * Math.PI / 180, end * Math.PI / 180, true);
          context.stroke();
          context.closePath();
        }
        if(self.animationDegree < 360 && !self.destroy) {
          self.animationDegree += self.speed;
          self.animationDegree = Math.min(self.animationDegree, 360);
          if(ease == 'in') {
            self.speed += self.speed * 0.05;
          }
          else if(ease == 'out') {
            self.speed -= self.speed * 0.05;
          }
          self.speed = Math.max(self.speed, 1);
          requestAnimationFrame(draw);
        }
        // destination-out方式时结束需全部绘制
        else {
          context.clearRect(0, 0, width, height);
          context.globalCompositeOperation = "source-over";
          context.putImageData(data, 0, 0);
          // 老webkit最后绘制会出现裂缝，多加一个尾帧画个透明层上去触发重绘
          requestAnimationFrame(function() {
            if(self.destroy) {
              return;
            }
            context.globalAlpha = 0;
            context.beginPath();
            context.arc(x, y, radio, 0, 360 * Math.PI / 180);
            context.stroke();
            context.closePath();
            context.globalAlpha = 1;
          });
        }
      }
      draw();}.call(this);
    }
  }
  Radio.prototype.renderBg = function(context, radio, lineWidth, padding, width, shadowWidth, sizeOffset) {
    var x = ((width - padding[1] - padding[3]) >> 1) + padding[3];
    var y = padding[0] + radio + (shadowWidth >> 1) + sizeOffset;
    var shadowColor = this.option.shadowColor || '#EEE';
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
      sum += Math.max(parseFloat(item) || 0, 0);
    });
    if(isNaN(sum) || sum <= 0) {
      return;
    }
    var count = 0;
    self.data.forEach(function(item, i) {
      self.renderItem(item, i, context, radio, lineWidth, count, sum, x, y);
      count += parseFloat(item);
    });
  }
  Radio.prototype.renderItem = function(item, i, context, radio, lineWidth, count, sum, x, y) {
    var color = getColor(this.option, i);
    var start = (360*count/sum + this.option.offset);
    var num = Math.max(parseFloat(item) || 0, 0);
    if(num == 0) {
      return;
    }
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
  Radio.prototype.clear = function() {
    this.destroy = true;
    this.context.clearRect(0, 0, this.width, this.height);
  }
  var _2={};_2.animationDegree={};_2.animationDegree.get =function() {
    return this._animationDegree;
  };
  _2.animationDegree.set =function(v) {
    this._animationDegree = v;
  };
  _2.speed={};_2.speed.get =function() {
    return this._speed;
  };
  _2.speed.set =function(v) {
    this._speed = v;
  };

  var _3={};_3.COLORS={};_3.COLORS.get =function() {
    return colors;
  };
Object.keys(_2).forEach(function(k){Object.defineProperty(Radio.prototype,k,_2[k])});Object.keys(_3).forEach(function(k){Object.defineProperty(Radio,k,_3[k])});

exports["default"]=Radio;
});