var util=function(){var _0=require('./util');return _0.hasOwnProperty("default")?_0["default"]:_0}();

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
    this.render();
  }

  Radio.prototype.render = function() {
    var y;var x;var context = this.dom.getContext('2d');
    var width = this.option.width || 300;
    var height = this.option.height || 150;
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

    (function(){var _1= this.renderBg(context, radio, lineWidth, padding, width, shadowWidth);x=_1[0];y=_1[1]}).call(this);
    this.renderFg(context, radio, lineWidth, padding, x, y);
    if(this.option.noLabel) {
      return;
    }
    this.renderTxt(context, radio, lineWidth, padding, width, height);
  }
  Radio.prototype.renderBg = function(context, radio, lineWidth, padding, width, shadowWidth) {
    var x = this.option.noLabel ? ((width - padding[1] - padding[3]) >> 1) : padding[3] + radio + (shadowWidth >> 1);
    var y = padding[0] + radio + (shadowWidth >> 1);
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
  Radio.prototype.renderFg = function(context, radio, lineWidth, padding, x, y) {
    var lineHeight;var fontSize;var fontWeight;var fontFamily;var fontVariant;var fontStyle;var self = this;
    var sum = 0;
    self.data.forEach(function(item) {
      sum += parseFloat(item[1]);
    });
    var count = 0;
    self.data.forEach(function(item, i) {
      self.renderItem(item, i, context, radio, lineWidth, count, sum, x, y);
      count += parseFloat(item[1]);
    });
    var title = this.option.title;
    if(title) {
      var font = this.option.font || 'normal normal normal 12px/1.5 Arial';
      (function(){var _2= util.calFont(font);fontStyle=_2["fontStyle"];fontVariant=_2["fontVariant"];fontFamily=_2["fontFamily"];fontWeight=_2["fontWeight"];fontSize=_2["fontSize"];lineHeight=_2["lineHeight"]}).call(this);

      var color = this.option.titleColor || '#000';
      if(color.charAt(0) != '#' && color.charAt(0) != 'r') {
        color = '#' + color;
      }
      context.fillStyle = color;
      context.textBaseline = 'top';

      if(this.option.titleSize) {
        fontSize = parseInt(this.option.titleSize) || 12;
      }

      font = fontStyle + ' ' + fontVariant + ' ' + fontWeight + ' ' + fontSize + 'px/' + lineHeight + 'px ' + fontFamily;
      context.font = font;

      var w = context.measureText(title).width;
      context.fillText(title, x - (w >> 1), radio + padding[0] - ((fontSize - lineWidth) >> 1));
    }
  }
  Radio.prototype.renderItem = function(item, i, context, radio, lineWidth, count, sum, x, y) {
    var color = getColor(this.option, i);
    var start = (Math.PI/180)*360*count/sum;
    var num = parseFloat(item[1]);
    var end = start + (Math.PI/180)*360*num/sum;
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
        context.arc(x, y, rd, start, end);
        context.stroke();
        context.closePath();
      });
    }
    else {
      context.beginPath();
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.arc(x, y, radio, start, end);
      context.stroke();
      context.closePath();
    }
  }
  Radio.prototype.renderTxt = function(context, radio, lineWidth, padding, width, height) {
    var lineHeight;var fontSize;var fontWeight;var fontFamily;var fontVariant;var fontStyle;var self = this;
    var font = this.option.font || 'normal normal normal 12px/1.5 Arial';
    (function(){var _3= util.calFont(font);fontStyle=_3["fontStyle"];fontVariant=_3["fontVariant"];fontFamily=_3["fontFamily"];fontWeight=_3["fontWeight"];fontSize=_3["fontSize"];lineHeight=_3["lineHeight"]}).call(this);

    var color = this.option.color || '#000';
    if(color.charAt(0) != '#' && color.charAt(0) != 'r') {
      color = '#' + color;
    }
    context.textBaseline = 'top';

    if(this.option.fontSize) {
      fontSize = parseInt(this.option.fontSize) || 12;
    }

    if(this.option.lineHeight) {
      lineHeight = this.option.lineHeight;
      if(util.isString(lineHeight)) {
        if(/[a-z]$/i.test(lineHeight)) {
          lineHeight = parseInt(lineHeight);
        }
        else {
          lineHeight *= fontSize;
        }
      }
      else {
        lineHeight *= fontSize;
      }
    }
    else {
      lineHeight = fontSize * 1.5;
    }
    lineHeight = Math.max(lineHeight, fontSize);

    font = fontStyle + ' ' + fontVariant + ' ' + fontWeight + ' ' + fontSize + 'px/' + lineHeight + 'px ' + fontFamily;
    context.font = font;

    var discRadio = parseInt(this.option.discRadio) || 1;
    discRadio = Math.max(discRadio, 1);
    discRadio = Math.min(discRadio, lineHeight >> 1);
    var x = padding[3] + (radio << 1) + (lineWidth << 1);
    var maxWidth = width - padding[1] - x - (discRadio << 1) - 30;
    maxWidth = Math.max(0, maxWidth);

    var maxTextWidth = 0;
    var totalHeight = 0;
    var heights = [];
    self.data.forEach(function(item) {
      item[0] = item[0] || '';
      var w = context.measureText(item[0]).width;
      if(w > maxWidth) {
        var arr = util.calHeight(context, item[0], maxWidth, w);
        item[0] = arr;
        totalHeight += heights.push(arr.length * lineHeight);
        maxTextWidth = maxWidth;
      }
      else {
        totalHeight += heights.push(lineHeight);
        maxTextWidth = Math.max(w, maxTextWidth);
      }
    });

    x += (maxWidth - maxTextWidth) >> 1;
    var offset = (height - totalHeight) >> 1;

    var count = padding[0];
    self.data.forEach(function(item, i) {
      self.renderTxtItem(item, i, context, x, offset, count, discRadio, color, fontSize, lineHeight, maxWidth);
      count += heights[i];
    });
  }
  Radio.prototype.renderTxtItem = function(item, i, context, x, offset, count, discRadio, txtColor, fontSize, lineHeight) {
    var color = getColor(this.option, i);
    if(Array.isArray(color)) {
      var arr = color[0].split(/\s+/);
      color = arr[1];
    }
    context.fillStyle = color;
    context.beginPath();
    var y = count + ((lineHeight - ((lineHeight - fontSize) >> 1)) >> 1) + (offset >> 1);
    context.arc(x + 10, y, discRadio, 0, (Math.PI/180)*360);
    context.fill();
    context.closePath();

    context.fillStyle = txtColor;
    var txt = item[0] || i;
    if(Array.isArray(txt)) {
      txt.forEach(function(t, j) {
        context.fillText(t, x + 30, count + (offset >> 1) + j * lineHeight);
      });
    }
    else {
      context.fillText(txt, x + 30, count + (offset >> 1));
    }
  }

  var _4={};_4.COLORS={};_4.COLORS.get =function() {
    return colors;
  }
Object.keys(_4).forEach(function(k){Object.defineProperty(Radio,k,_4[k])});

exports["default"]=Radio;
