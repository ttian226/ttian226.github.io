---
layout:     post
title:      "jQuery源码学习7"
subtitle:   "链式调用原理"
date:       2015-05-07 12:00:00
author:     "wangxu"
header-img: "img/post-bg-2015.jpg"
tags:
    - jQuery
---

#### 链式调用原理

```javascript
//在每个原型方法中加return this即可实现链式调用
jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    init: function (selector) {
       return this; 
    },
    func1: function () {
    	console.log('func1');
    	return this;
    },
    func2: function () {
    	console.log('func2');
    	return this;
    }
};

//例如
$('a').func1().func2(); //输出func1 func2
```
* 在每个方法中return this返回当前的实例
