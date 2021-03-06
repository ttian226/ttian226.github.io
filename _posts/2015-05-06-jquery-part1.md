---
layout:     post
title:      "jQuery源码学习1"
subtitle:   "立即调用表达式"
date:       2015-05-06 12:00:00
author:     "wangxu"
header-img: "img/post-bg-2015.jpg"
tags:
    - jQuery
---

#### 立即调用表达式

```javascript
(function (window, factory) {
	factory(window);
}(this, function (o) {
	// o为全局this对象
}));
```

```javascript
(function (window, undefined) {
	var jQuery = function () {};
	window.jQuery = window.$ = jQuery;
}(window));
```
* 全局扩展了两个变量jQuery和$
* window和undefined都是为了减少变量查找所经过的scope作用域。当window通过传递给闭包内部之后，在闭包内部使用它的时候，可以把它当成一个局部变量，显然比原先在window scope下查找的时候要快一些
* undefined也是同样的道理，其实这个undefined并不是JavaScript数据类型的undefined，而是一个普普通通的变量名。只是因为没给它传递值，它的值就是undefined

###### 无new构建

```javascript
(function (window, undefined) {
	var jQuery = function (selector) {
		if (!(this instanceof jQuery)) {
			return new jQuery(selector);
		}
		this.selector = selector;
	};
	window.jQuery = window.$ = jQuery;
}(window));

//例如：$('abc')就是一个jQuery实例，具有一个实例属性$('abc').selector = 'abc'
```
