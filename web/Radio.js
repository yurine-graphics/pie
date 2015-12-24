define(function(require, exports, module){var util=function(){var _0=require('./util');return _0.hasOwnProperty("default")?_0["default"]:_0}();

var colors = ['4A90E2', 'C374DE', 'F36342', 'F3A642', '93C93F', '50E3C2'];

function getColor(option, i) {
  var idx = i % colors.length;
  var color = option.colors[idx] || colors[idx];
  if(color.indexOf(0) != '#' && color.charAt(0) != 'r') {
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
    var context = this.dom.getContext('2d');
    var width = this.option.width || 300;
    var height = this.option.height || 150;
    var padding = this.option.padding || [10, 10, 10, 10];
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
    var size = String(this.option.size || 1);
    if(/%$/.test(size)) {
      size = parseFloat(size) * 0.01;
    }
    else {
      size = parseFloat(size);
    }
    size = Math.min(size, 1);
    size = Math.max(size, 0.2);
    var radio = (min * size - lineWidth) >> 1;

    this.renderBg(context, radio, lineWidth, padding);
    this.renderFg(context, radio, lineWidth, padding);
    this.renderTxt(context, radio, lineWidth, padding, width, height);
  }
  Radio.prototype.renderBg = function(context, radio, lineWidth, padding) {
    var gr = context.createRadialGradient(padding[3] + radio + (lineWidth >> 1), padding[0] + radio + (lineWidth >> 1), radio - (lineWidth >> 1), padding[3] + radio + (lineWidth >> 1), padding[0] + radio + (lineWidth >> 1), radio + (lineWidth >> 1));
    gr.addColorStop(0, 'rgba(0,0,0,0)');
    gr.addColorStop(0.2, 'rgba(0,0,0,0.1)');
    gr.addColorStop(0.8, 'rgba(0,0,0,0.1)');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    context.beginPath();
    context.strokeStyle = gr;
    context.lineWidth = lineWidth;
    context.arc(padding[3] + radio + (lineWidth >> 1), padding[0] + radio + (lineWidth >> 1), radio, 0, (Math.PI/180)*360);
    context.stroke();
    context.closePath();
  }
  Radio.prototype.renderFg = function(context, radio, lineWidth, padding) {
    var self = this;
    var sum = 0;
    self.data.forEach(function(item) {
      sum += parseFloat(item[1]);
    });
    var count = 0;
    self.data.forEach(function(item, i) {
      self.renderItem(item, i, context, radio, lineWidth, padding, count, sum);
      count += parseFloat(item[1]);
    });
  }
  Radio.prototype.renderItem = function(item, i, context, radio, lineWidth, padding, count, sum) {
    var color = getColor(this.option, i);
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = lineWidth >> 1;
    var start = (Math.PI/180)*360*count/sum;
    var num = parseFloat(item[1]);
    var end = start + (Math.PI/180)*360*num/sum;
    context.arc(padding[3] + radio + (lineWidth >> 1), padding[0] + radio + (lineWidth >> 1), radio, start, end);
    context.stroke();
    context.closePath();
  }
  Radio.prototype.renderTxt = function(context, radio, lineWidth, padding, width, height) {
    var lineHeight;var fontSize;var fontWeight;var fontFamily;var fontVariant;var fontStyle;var self = this;
    var font = this.option.font || 'normal normal normal 12px/1.5 Arial';
    !function(){var _1= util.calFont(font);fontStyle=_1["fontStyle"];fontVariant=_1["fontVariant"];fontFamily=_1["fontFamily"];fontWeight=_1["fontWeight"];fontSize=_1["fontSize"];lineHeight=_1["lineHeight"]}();

    var color = this.option.color || '#000';
    if(color.charAt(0) != '#' && color.charAt(0) != 'r') {
      color = '#' + color;
    }
    context.textBaseline = 'top';

    if(this.option.fontSize) {
      fontSize = parseInt(this.option.fontSize) || 12;
    }
    fontSize = Math.max(fontSize, 12);

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
    var x = padding[3] + (radio << 1) + lineWidth;
    var maxWidth = width - padding[1] - x - (discRadio << 1) - 30;

    var maxTextWidth = 0;
    var totalHeight = 0;
    var heights = [];
    self.data.forEach(function(item) {
      item[0] = item[0] || '';
      var w = context.measureText(item[0]).width;
      if(w > maxWidth) {
        var arr = util.calHeight(context, item[0], maxWidth);
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


exports["default"]=Radio;
});