---
layout:     post
title:      "jQuery源码学习9"
subtitle:   "jQuery.type"
date:       2015-05-08 12:00:00
author:     "wangxu"
header-img: "img/post-bg-2015.jpg"
tags:
    - jQuery
---

#### 使用Object.prototype.toString()检测对象类型

```javascript
var toString = Object.prototype.toString,
	t1 = toString.call(function () {}),		//[object Function]
	t2 = toString.call(new Boolean()),		//[object Boolean]
	t3 = toString.call(new Number()),		//[object Number]
	t4 = toString.call(new String()),		//[object String]
	t5 = toString.call([1, 2, 3]),			//[object Array]
	t6 = toString.call(new Array()),		//[object Array]
	t7 = toString.call(new Date());			//[object Date]
```

#### 源码实现

```javascript
//class2type对象保存class到type的映射
var	class2type = {};
var toString = class2type.toString;

/*
初始化class2type对象
{
	[object Function]: 'function',
	[object Array]: 'array',
	...
}
*/
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
	class2type["[object " + name + "]"] = name.toLowerCase();
});


jQuery.extend({
	type: function (obj) {
		if (obj == null) {
			//null或undefined
			return obj + "";
		}

		if (typeof obj === "object" || typeof obj === "function") {
			//对象类型，当在class2type匹配不到返回object
			return class2type[toString.call(obj)] || "object"
		} else {
			//boolean number string
			return typeof obj;
		}
	}
});
```

```javascript
//以下返回undefined
jQuery.type();
jQuery.type(null);
jQuery.type(undefined);
jQuery.type(window.notDefined);

//function
jQuery.type(function () {});

//array
jQuery.type([1, 2, 3]);
```