# yurine-pie

饼图pie，`yurine`取名自`鴉-KARAS-`中的城市精灵百合音。

[![NPM version](https://badge.fury.io/js/yurine-pie.png)](https://npmjs.org/package/yurine-pie)

# INSTALL
```
npm install yurine-pie
```

[![preview](https://raw.githubusercontent.com/yurine-graphics/pie/master/preview.png)](https://github.com/yurine-graphics/pie)

# API
 * Radio(selector:DOM/String, data:\<\<String>, \<int>>, option:Object):Class
   * selector:String 渲染的canvas对象或选择器
   * data:\<\<String>, \<int>> 渲染数据数组，以\[名称, 数字]格式
   * option:Object 选项
     - font:String 文字字体css缩写
     - fontFamily:String 文字字体，会覆盖font
     - fontWeight:String 文字粗细，会覆盖font
     - fontVariant:String 文字异体，会覆盖font
     - fontStyle:String 文字样式，会覆盖font
     - fontSize:int 文字大小，单位px，会覆盖font
     - lineHeight:String/int 行高，单位px，会覆盖font
     - padding:int/Array 边距，上右下左，单位px
     - width:int 宽度，单位px
     - height:int 高度，单位px
     - lineWidth:int 圆框粗细，单位px，最大不超过可视半径，最小不低于2px
     - size:float 饼图占可视比例，最大不超过1，最小不低于0.2
     - colors:<String> 自定义颜色数组

# License
[MIT License]
