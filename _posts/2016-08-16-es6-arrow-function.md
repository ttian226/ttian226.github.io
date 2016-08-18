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

另一个例子：

```javascript
function Timer() {
  this.s1 = 0;
  this.s2 = 0;
  this.s3 = 0;

  //通过事先把变量this赋给that，that就指向了函数Timer的作用域
  var that = this;
  setInterval(function () {
    that.s1++;
  }, 1000);

  //这里的this指向运行时所在的作用域（即全局对象）
  setInterval(function () {
    this.s2++;  //这里实际上是给window.s2++
  }, 1000);

  //箭头函数的this绑定定义时所在的作用域（即Timer函数）
  setInterval(() => this.s3++, 1000);
}

var s2 = 0;
var timer = new Timer();

setTimeout(function () {
  console.log('s1:', timer.s1); //3
}, 3100);

setTimeout(function () {
  console.log('s2:', timer.s2); //0
}, 3100);

setTimeout(function () {
  console.log('s3:', timer.s3); //3
}, 3100);

setTimeout(function () {
  console.log('window.s2:', s2); //3
}, 3100);
```

箭头函数可以让`this`指向固定化，这种特性很有利于封装回调函数。下面是一个例子，DOM事件的回调函数封装在一个对象里面。

```javascript
var handler = {
  id: 123,
  init: function () {
    document.addEventListener('click', event => this.doSomething(event.type), false);
  },
  doSomething: function (type) {
    console.log('Handling ' + type + ' for ' + this.id);
  }
};

handler.init(); //当用户触发点击操作时，会打印'Handling click for 123'
```

上面代码的`init`方法中，使用了箭头函数，箭头函数内部的`this`始终指向`handler`对象。如果不使用箭头函数，那么`this`对象会指向`document`对象。

`this`指向的固定化，并不是箭头函数内部有绑定`this`的机制，实际原因是箭头函数根本没有自己的`this`，导致内部的`this`就是外层代码块的`this`。正是因为它没有`this`，所以不能用作构造函数。

所以，箭头函数转化为ES5的代码如下：

```javascript
// ES6
function foo() {
  setTimeout(() => {
    console.log('id:' + this.id);
  }, 1000);
}

// ES5
function foo() {
  var _this = this;
  setTimeout(function () {
    console.log('id:' + _this.id);
  }, 1000);
}

foo.call({id: 123});
```

上面的代码表示：箭头函数根本没有自己的`this`，而是引用了外层的`this`
