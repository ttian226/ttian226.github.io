---
layout:     post
title:      "jQuery源码学习4"
subtitle:   "原型和对象"
date:       2015-05-07 12:00:00
author:     "wangxu"
header-img: "img/post-bg-2015.jpg"
tags:
    - jQuery
---

#### 构造函数模式

###### 创建一个jQuery对象（类）
```javascript
//每个jQuery对象包含两个属性name,selector和一个方法show
function jQuery(selector) {
	this.name = 'jQuery';
	this.selector = selector;
	this.show = function () {
		console.log(this.selector);
	};
}

//通过new关键字创建3个实例
var a = new jQuery('a');
var b = new jQuery('b');
var c = new jQuery('c');
```
* 每个实例(a, b, c)都包含属性name,selector，方法show
* show对于每个实例都有一份拷贝，各自占用内存空间。

###### 使用原型
```javascript
function jQuery(selector) {
	this.name = 'jQuery';
	this.selector = selector;
}

jQuery.prototype = {
	constructor: jQuery,
	show: function () {
		console.log(this.selector);
	}
};

var a = new jQuery('a');
var b = new jQuery('b');
var c = new jQuery('c');
```
* 每个实例(a, b, c)的show方法都指向同一个引用，只占用一份内存空间。
* 需要通过scope连接到原型链上查找，这样就无形之中要多一层作用域链的查找了

```javascript
//使jQuery.fn指向jQuery的原型对象（jQuery.prototype）
jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	show: function () {
		console.log(this.selector);
	}
};
```
* 通过扩展jQuery.fn可以实现对jQuery的实例增加属性或函数（即扩展jQuery的原型对象）
* 原因是jQuery.fn指向了jQuery.prototype（jQuery原型对象）的引用。

```javascript
//增加新的方法
jQuery.fn.func = function () {
	console.log('new function');
}

//增加新的属性
jQuery.fn.test = 'test';

//创建jQuery实例
var a = new jQuery('a');
var b = new jQuery('b');
```
* 对于每个jQuery实例(a, b)都新增了一个属性test,和一个func方法。



```javascript
function jQuery(selector) {
	
}

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function (selector) {
		return this;
	}
};

//a是jQuery的一个实例
var a = new jQuery('a'); 

//b是jQuery的一个实例 
//init()返回jQuery实例本身，a === b
var b = a.init();
```
* 给原型对象增加init方法


```javascript
function jQuery(selector) {
	return new jQuery.fn.init(selector);
}

jQuery.fn = jQuery.prototype = {
	init: function (selector) {
		
	}
};

//这时a是jQuery.fn.init的一个实例
//a instanceof jQuery.fn.init === true
var a = jQuery('a');
```
* 通过jQuery构造函数创建一个jQuery.fn.init的一个实例

```javascript
function jQuery(selector) {
	return new jQuery.fn.init(selector);
}

jQuery.fn = jQuery.prototype = {
	init: function (selector) {
		//return this;
	},
	value: 'jQuery',
	say: function () {
		console.log('hello');
	}
};

//jQuery.fn.init的原型对象指向jQuery的原型对象
//jQuery的原型对象覆盖了init构造器的原型对象
//构造器的实例即jQuery的实例，this指向jQuery
//即new jQuery.fn.init(selector)返回的是一个jQuery实例
jQuery.fn.init.prototype = jQuery.fn;

//a是jQuery.fn.init的一个实例 a instanceof jQuery.fn.init === true
//a也是jQuery的一个实例 a instanceof jQuery === true
//a具有value属性和say()方法
var a = jQuery('a');
```
* 通过jQuery构造函数直接创建jQuery对象的实例
