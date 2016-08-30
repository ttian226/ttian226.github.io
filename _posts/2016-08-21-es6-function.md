---
layout:     post
title:      "ES6-Function"
subtitle:   "函数的扩展"
date:       2016-08-21 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - ES6
---

### 函数参数的默认值

在ES6之前，不能给函数参数指定默认值，可以使用如下变通的方法：

```javascript
function log(x, y) {
  y = y || 'World';
  console.log(x, y);
}
log('Hello'); //Hello World
log('Hello', 'China');  //Hello China
log('Hello', ''); //Hello World
```

上面的代码中，如果不传第二个参数那么默认值为'World'，但如果传入的第二个参数可以转化为布尔值`false`（如空字符串），也会使用默认值。为了避免这个问题，通常先判断参数`y`是否被赋值。改下上面的代码如下：

```javascript
function log(x, y) {
  // 如果y未赋值,则赋它默认值
  if (typeof y === 'undefined') {
    y = 'World';
  }
  console.log(x, y);
}
```

ES6允许为参数设置默认值。

```javascript
function log(x, y = 'World') {
  console.log(x, y);
}
log('Hello'); //Hello World
log('Hello', 'China');  //Hello China
log('Hello', ''); //Hello
```

另外一个例子：

```javascript
function Point(x = 0, y = 0) {
  this.x = x;
  this.y = y;
}

var p = new Point();
p; //Point {x: 0, y: 0}
```

设置默认参数后，函数内部不能再次使用`let`或`const`再次声明这个参数。

```javascript
function foo(x = 10) {
  let x = 1;  //Identifier 'x' has already been declared
}
```

#### 与解构赋值的默认值结合起来使用

复习下对象的解构赋值：

```javascript
//对象解构赋值
var {foo, bar} = {foo: 'aaa', bar: 'bbb'};
foo //aaa
bar //bbb

//对象解构赋值的默认值,这里bar的默认值是ccc
var {foo, bar = 'ccc'} = {foo: 'aaa'}
bar //ccc
```

参数默认值可以与解构赋值的默认值，结合起来使用。

```javascript
function foo({x, y = 5}) {
  console.log(x, y);
}
foo({});  //undefined 5
foo({x: 1});  //1, 5
foo({x: 1, y: 3}); //1, 3
foo();  //报错
```

当函数参数使用对象解构赋值的默认值时，传入的参数一定要传入对象。只有当参数是一个对象时，变量`x`和`y`才能通过解构赋值而生成。如果参数不是对象，变量`x`和`y`也不会生成，从而报错。如果参数没有`y`属性，`y`的默认值才会生效。

如果想让`foo()`不报错，可以给第一个参数赋默认值。

```javascript
function foo({x, y = 5} = {}) {
  console.log(x, y);
}
foo();  //undefined 5
```

上面的代码，如果没有传入参数，则使`{}`作为默认参数。

#### 参数默认值的位置

通常情况下，定义了默认值的参数，应该是函数的尾参数。因为这样比较容易看出来，到底省略了哪些参数。

如果传入`undefined`，将触发该参数等于默认值。`null`则不会。

```javascript
function foo(x = 5) {
  console.log(x);
}
foo(undefined); //5
foo(null);  //null
```

#### 函数的length属性

函数的`length`属性可以返回参数的个数。

```javascript
(function() {}).length; //0
(function(a) {}).length; //1
(function(a, b) {}).length; //2
```

如果参数指定了默认值，`length`属性则返回没有指定默认值的参数个数：

```javascript
(function (a) {}).length // 1
(function (a = 5) {}).length // 0
(function (a, b, c = 5) {}).length // 2
```

rest参数也不会计入`length`属性。

```javascript
(function(...args) {}).length // 0
```

### name属性

函数的`name`属性，返回该函数的函数名

```javascript
function foo() {}
foo.name  //'foo'
```

如果将一个匿名函数赋给一个变量，那么ES6返回这个变量名。

```javascript
var func = function () {};
func.name  //'func'
```

通过`Function`构造函数返回的函数实例，`name`属性的值为`anonymous`。

```javascript
var fn = new Function();
console.log(fn.name); //anonymous
```

`bind`返回的函数，`name`的属性名前面加上`bound`，例如：

```javascript
var getX = function () {
  return this.x;
};

window.x = 9;
var obj = {
  x: 81
};

var fn = getX.bind(obj);
console.log(fn.name); //bound getX
```



