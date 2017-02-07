# yurine-pie

饼图pie，`yurine`取名自`鴉-KARAS-`中的城市精灵百合音。

[![NPM version](https://badge.fury.io/js/yurine-pie.png)](https://npmjs.org/package/yurine-pie)

# INSTALL
```
npm install yurine-pie
```

[![preview](https://raw.githubusercontent.com/yurine-graphics/pie/master/preview.png)](https://github.com/yurine-graphics/pie)

# API
 * Radio(selector:DOM/String, data:Array\<\<String>, \<int>>, option:Object):Class
   * selector:String 渲染的canvas对象或选择器
   * data:\<Number> 渲染数据数组
   * option:Object 选项
     - padding:int/Array 边距，上右下左，单位px
     - width:int 宽度，单位px
     - height:int 高度，单位px
     - lineWidth:int 圆框粗细，单位px，∈\[1, 可视半径]
     - size:float 饼图占可视比例，∈\[0.2, 1]
     - colors:\<String/\<String>> 自定义颜色数组，如果色值指定为数组形式(\['0.2 #FFF', '0.8 #000'])，则形成彩边
     - shadowWidth:int 背景色宽，单位px，默认lineWidth，∈\[lineWidth, 可视半径]
     - shadowColor:String 背景色
     - offset:int 角度值偏移增量，因绘图api的0°从右水平线开始，可以此设置开始角位置
     - points:\<Array\<Number, Number>> 只读，获取每个饼图的中心坐标
     - animation:Boolean 饼图是否以顺时针动画效果出现
     - speed:int 饼图动画速度，每帧显示角度数，默认1，越大越快
     - ease:String 饼图动画加速/减速，in/out
     - animationDegree:int 动画初始角度
 * clear():void 清除画布和动画
 * animationDegree:int get/set当前动画角度值

# License
[MIT License]
