---
layout:     post
title:      "ES6-Arrow Function"
subtitle:   "箭头函数"
date:       2016-08-16 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - ES6
---

### 箭头函数

ES6允许使用`=>`定义函数

```javascript
var f = v => v;
```

上面的箭头函数等价于：

```javascript
var f = function (v) {
  return v;
};
```

如果箭头函数不需要参数或需要多个参数，就使用一个圆括号代表参数部分。如果只有一个参数则不需要圆括号。

```javascript
var f = () => 10;
// 等价于
var f = function () {
  return 10;
};

var sum = (x, y) => x + y;
// 等价于
var sum = function (x, y) {
  return x + y;
};
```

如果箭头函数的代码块多于一条语句，需要用大括号括起来并用`return`返回。

```javascript
var sum = (x, y) => {return x + y;}
```

由于大括号被解释成代码块，如果箭头函数直接返回一个对象，必须在对象的外面加上括号。

```javascript
var getObj = id => ({id:id, name: 'wang'});
// 等价于
var getObj = function (id) {
  return {
    id: id,
    name: 'wang'
  };
};
```

箭头函数可以和变量解构结合使用：

```javascript
var full = ({first, last}) => first + last;

// 等价于
var full = function ({first, last}) {
  return first + last;
};

// 等价于
var full = function (obj) {
  return obj.first + obj.last;
};

full({first:'a', last: 'z'});   //'az'
```

箭头函数使表达式更简洁，适合定义工具函数。

```javascript
const isEven = n => n % 2 === 0;
const square = n => n * n;
```

箭头函数的一个用处就是用来简化回调函数

```javascript
// 正常函数的写法
[1, 2, 3].map(function (i) {
  return i * 2;
});

// 箭头函数的写法
[1, 2, 3].map(i => i * 2);
```

与rest参数结合使用的例子

```javascript
const numbers = (...nums) => nums;
numbers(1, 2, 3, 4, 5); //[1, 2, 3, 4, 5]

const headAndTail = (head, ...tail) => [head, tail];
headAndTail(1, 2, 3, 4, 5); // [1, [2, 3, 4, 5]]
```

#### 关于箭头函数中的`this`问题

下面这个例子`setTimeout`中的`this`指向的是`window`对象，而不是`foo`所在的上下文

```javascript
function foo() {
  setTimeout(function () {
    console.log('id:', this.id);    //100
  }, 100);
}
var id = 100;
foo.call({id: 123});
```

通常如果想在`setTimeout`中能访问到外层函数的上下文，需要先`var that = this`，然后在`setTimeout`中使用`that`，如下：

```javascript
function foo() {
  var that = this;
  setTimeout(function () {
    console.log('id:', that.id);    //123
  }, 100);
}
var id = 100;
foo.call({id: 123});
```

使用箭头函数可以让`setTimeout`里面的`this`直接指向`foo`的上下文。

```javascript
function foo() {
  setTimeout(() => {
    console.log('id:', this.id);  //123
  }, 100);
}

var id = 100;
foo.call({id: 123});
```
