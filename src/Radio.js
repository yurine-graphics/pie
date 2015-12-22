import util from './util';

var colors = ['4A90E2', 'C374DE', 'F36342', 'F3A642', '93C93F', '50E3C2'];

class Radio {
  constructor(dom, data, option) {
    this.dom = util.isString(dom) ? document.querySelector(dom) : dom;
    if(!this.dom || !this.dom.getContext) {
      return;
    }
    this.data = data || [];
    this.option = option || {};
    this.option.colors = this.option.colors || [];
    this.render();
  }

  render() {
    var context = this.dom.getContext('2d');
    var width = this.option.width || 400;
    var height = this.option.height || 400;
    var min = Math.min(width, height);
    var lineWidth = this.option.lineWidth || 20;
    if(lineWidth < 4) {
      lineWidth = 4;
    }
    else if(lineWidth > min >> 1) {
      lineWidth = min >> 1;
    }
    var padding = this.option.padding || [10, 10, 10, 10];
    var paddingX = padding[1] + padding[3];
    var paddingY = padding[0] + padding[2];
    var size = String(this.option.size || 0.5);
    if(/%$/.test(size)) {
      size = parseFloat(size) * 0.01;
    }
    else {
      size = parseFloat(size);
    }
    if(size > 0.5) {
      size = 0.5;
    }
    else if(size < 0.2) {
      size = 0.2;
    }
    var radio = (min * size - lineWidth - Math.max(paddingX, paddingY)) >> 1;

    this.renderBg(context, min, radio, lineWidth);
    this.renderFg(context, min, radio, lineWidth);
  }
  renderBg(context, min, radio, lineWidth) {
    context.beginPath();
    context.strokeStyle = 'rgba(0,0,0,0.1)';
    context.lineWidth = lineWidth;
    context.arc(min >> 1, min >> 1, radio, 0, (Math.PI/180)*360);
    context.stroke();
    context.closePath();
  }
  renderFg(context, min, radio, lineWidth) {
    var self = this;
    var sum = 0;
    self.data.forEach(function(item) {
      sum += parseFloat(item[1]);
    });
    var count = 0;
    self.data.forEach(function(item, i) {
      self.renderItem(item, i, context, min, radio, lineWidth, count, sum);
      count += parseFloat(item[1]);
    });
  }
  renderItem(item, i, context, min, radio, lineWidth, count, sum) {
    var idx = i % colors.length;
    var color = this.option.colors[idx] || colors[idx];
    if(color.indexOf(0) != '#') {
      color = '#' + color;
    }
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = lineWidth >> 1;
    var start = (Math.PI/180)*360*count/sum;
    var num = parseFloat(item[1]);
    var end = start + (Math.PI/180)*360*num/sum;
    context.arc(min >> 1, min >> 1, radio, start, end);
    context.stroke();
    context.closePath();
  }
}

export default Radio;
