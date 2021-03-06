---
layout:     post
title:      "jQuery源码学习6"
subtitle:   "jQuery扩展"
date:       2015-05-07 12:00:00
author:     "wangxu"
header-img: "img/post-bg-2015.jpg"
tags:
    - jQuery
---

#### jQuery.extend和jQuery.fn.extend接口

###### 源码实现

```javascript
jQuery.extend = jQuery.fn.extend = function () {
	var options, name, copy,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length;

	//只有一个参数，就是对jQuery或jQuery原型对象的扩展
	if (i === length) {
		//调用的上下文对象jQuery或jQuery原型对象
		target = this;
		i--;
	}

	for (; i < length; i++) {
		if ((options = arguments[i]) != null) {
			//options不为空时开始遍历
			for (name in options) {
				copy = options[name];
				//扩展jQuery对象或原型对象
				target[name] = copy;
			}
		}
	}
	return target;
};

//扩展了jQuery对象，给jQuery添加静态方法
jQuery.extend({
	test: function () {
		console.log('test');
	}
});

//等价于
jQuery.test = function () {
	//...
};

//扩展jQuery.prototype，给jQuery实例添加实例方法。
jQuery.fn.extend({
	one: function () {
		console.log('one');
	}
});

//等价于
jQuery.fn.one = function () {
	//...
};
```


```javascript
//jQuery内部对静态方法的扩展
jQuery.extend({
	each: function (obj, callback, args) {
		//...code...
	}
});
```