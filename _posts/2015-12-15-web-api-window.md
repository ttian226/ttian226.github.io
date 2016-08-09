---
layout:     post
title:      "Web Api - Window"
subtitle:   ""
date:       2015-12-15 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - Javascript
    - Web Api
---

#### 属性

##### [Window.scrollY](https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY)

返回文档垂直滚动的像素

别名:`Window.pageYOffset`


##### [Window.scrollX](https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollX)

返回文档水平滚动的像素

别名:`Window.pageXOffset`


#### 方法

##### [Window.getComputedStyle()](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle)

`var styles = window.getComputedStyle(element)`

返回一个`CSSStyleDeclaration`对象，包括所有的样式（style属性的样式和样式表中样式）

通过调用`CSSStyleDeclaration`对象的`getPropertyValue()`方法获取对应的属性值`var value = styles.getPropertyValue(属性名)`

##### [Window.scrollTo()](https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo)

`window.scrollTo(x-coord, y-coord)`

滚动到文档指定的坐标
