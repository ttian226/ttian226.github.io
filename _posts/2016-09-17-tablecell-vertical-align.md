---
layout:     post
title:      "使用table-cell设置垂直居中"
subtitle:   ""
date:       2016-09-17 12:00:00
author:     "wangxu"
header-img: "img/post-bg-bridge.jpg"
tags:
    - CSS
---

### 设置一个固定宽高垂直居中

1. `.inner`是一个固定宽高的矩形。它的父容器是`.middle`。`.middle`的父容器是`.box`。即是一个三层的结构`.box` > `.middle` > `.inner`。`.inner`是要垂直居中的矩形。`.middle`作为它的父容器。
2. `.box`设置了`display: table;`。`.middle`设置了`display: table-cell;`，而它是没有设置宽高的。**由于它是table-cell，所以它的宽高即是父元素`.box`的宽高**
3. 对`.middle`设置`vertical-align: middle;`可以使`.inner`垂直居中。
4. 对`.middle`设置`text-align: center;`并且设置`.inner`为`display: inline-block;`可以使`.inner`水平居中。


```html
<div class="box">
    <div class="middle">
      <div class="inner"></div>
    </div>
  </div>
```

```css
.box {
      display: table;
      width: 600px;
      height: 300px;
      background-color: #eee;
    }

    .middle {
      display: table-cell;
      background-color: gold;
      vertical-align: middle;
      text-align: center;
    }

    .inner {
      display: inline-block;
      width: 200px;
      height: 100px;
      background-color: blue;
    }
```


### 设置文字垂直居中

同上面的例子的结构相同，也是一个三层的结构。最里面的`<span>`是要垂直居中的文字，不需要给它设置任何样式。

```html
<div class="box">
    <div class="middle">
      <span>hello world</span>
    </div>
  </div>
```

```css
.box {
      display: table;
      width: 600px;
      height: 300px;
      background-color: #eee;
    }

    .middle {
      display: table-cell;
      background-color: gold;
      vertical-align: middle;
      text-align: center;
    }
```

