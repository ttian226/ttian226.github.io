---
layout:     post
title:      "ES6-Destructuring"
subtitle:   "变量的解构赋值"
date:       2016-08-11 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - ES6
---

### 数组的解构赋值

以前，为变量赋值是这样写：

```javascript
var a = 1;
var b = 2;
var c = 3;
```

ES6可以这样写：

```javascript
var [a, b, c] = [1, 2, 3];
```

上面代码表示，可以从数组中取值，按照对应位置，对变量赋值。

其它的一些数组解构赋值的例子：

```javascript
let [, , third] = [1, 2, 3];
console.log(third); //3

let [x, , y] = [1, 2, 3];
console.log(x, y);  //1, 3

let [head, ...tail] = [1, 2, 3, 4];
console.log(head, tail);  //1, [2, 3, 4]

let [a, b, ...z] = [1];
console.log(a, b, z); //1, undefined, []
```

如果解构不成功，变量的值就是`undefined`

```javascript
var [foo] = [];
console.log(foo); //undefined

var [a, b] = [1];
console.log(b);   //undefined
```

不完全解构的例子，等号左边的值没有完全匹配到右边的值：

```javascript
var [a, b] = [1, 2, 3];
console.log(a, b);  //1, 2
```

如果等号右边不是数组，则会报错。

```javascript
// 以下都会报错
let [foo] = 1;
let [foo] = false;
let [foo] = NaN;
let [foo] = undefined;
let [foo] = null;
let [foo] = {};
```

解构不仅适用于`var`命令，也适用于`let``const`命令。

```javascript
var [v1, v2, ..., vN ] = array;
let [v1, v2, ..., vN ] = array;
const [v1, v2, ..., vN ] = array;
```

对于`Set`结构，也可以使用数组解构赋值。

```javascript
let [x, y, z] = new Set(["a", "b", "c"]);
x // "a"
```

事实上，只有某种数据结构具有Iterator接口，都可以使用数组解构赋值。

数组解构赋值可以使用默认值

```javascript
var [foo] = [];
foo //undefined

var [foo = true] = [];
foo //true
```

ES6内部使用严格相等运算符`===`判断一个位置是否有值。如果严格等于`undefined`或者没有值则使用默认值。如果不严格等于`undefined`则默认值不会生效。

```javascript
var [x = 1] = [undefined];
x // 1

var [x = 1] = [null];
x // null
```

上面的例子中由于`null`不严格等于`undefined`，所以默认值不会生效

### 对象的解构赋值

数组的解构是按顺序取值的，对象的解构是按照对象的属性来取值的。

```javascript
var {foo, bar} = {foo: 'aaa', bar: 'bbb'};
foo //'aaa'
bar //'bbb'
```

如果没有对应的同名属性，结果为`undefined`

```javascript
var {baz} = {foo: 'aaa', bar: 'bbb'};
baz //undefined
```

等号左边如果使用`{key:value}`这种形式，下面的例子看到实际上是给`baz`赋值，而`foo`则根本未定义。

```javascript
var {foo: baz} = {foo: 'aaa', bar: 'bbb'};
foo //这里会报错，ReferenceError: foo is not defined
baz //'aaa'
```

这实际上说明，对象的解构赋值`var {foo, bar} = {foo: "aaa", bar: "bbb"}`是下面形式的简写：

```javascript
var {foo: foo, bar: bar} = {foo: "aaa", bar: "bbb"};
```

也就是说，对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量。真正被赋值的是后者，而不是前者。

使用解构赋值时，变量的声明和赋值是一体的。所以对于`let`和`const`来说，变量不能重新声明。

```javascript
let foo;
let {foo} = {foo: 1}; //Identifier 'foo' has already been declared

let baz;
let {foo: baz} = {foo: 1}; //Identifier 'baz' has already been declared

let foo;
let {foo: baz} = {foo: 1};  //不会报错，因为这里foo是没有定义的。
```

对象的解构也可以指定默认值

```javascript
var {x = 3} = {};
x // 3

var {x, y = 5} = {x: 1};
x // 1
y // 5

var {x: y = 3} = {};
x // 未定义
y // 3

var {x: y = 3} = {x: 5};
x // 未定义
y // 5
```

和数组一样，对象的默认值生效的条件是，没有匹配的属性或属性值严格等于`undefined`

```javascript
var {x = 3} = {x: undefined};
x // 3

var {x = 3} = {x: null};
x // null
```

上面的代码`null`不严格等于`undefined`，所以默认值不会生效。

如果解构失败，变量的值等于`undefined`

```javascript
var {foo} = {bar: 'baz'};
foo // undefined
```

### 字符串的解构赋值

等号左边是数组，这时'hello'被转换成了类数组对象

```javascript
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"
```

由于'hello'具有`length`属性。可以对这个属性解构赋值。

```javascript
let {length: len} = 'hello';
len // 5
```

### 函数参数的解构赋值

```javascript
function add([x, y]) {
  return x + y;
}

add([1, 2]);  //3
```

上面的代码中，add的参数表面上是一个数组，在参数传入的那一刻，数组参数被解构成变量x和y。

```javascript
[[1, 2], [3, 4]].map(function ([a, b], index) {
  return a + b;
});

// [3, 7]

// 使用箭头表达式
[[1, 2], [3, 4]].map(([a, b]) => a + b);
```

函数的参数解构也可以使用默认值

```javascript
function move({x = 0, y = 0} = {}) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]
```

### 解构赋值的用途

1.交换变量的值

```javascript
var x = 1, y = 2;
[x, y] = [y, x];
x // 2
y // 1
```

2.从函数返回数组或对象

有了解构赋值，从函数返回的对象或数组可以直接给变量赋值了

```javascript
var getObj = function () {
  return {
    a: 1,
    b: 2,
    c: 3
  };
};

var {a, b, c} = getObj();
```

```javascript
var getArr = function () {
  return [1, 2, 3];
};

var [a, b, c] = getArr();
```

3.函数参数的定义

```javascript
// 参数是一组有次序的值
function f([x, y, z]) { ... }
f([1, 2, 3]);

// 参数是一组无次序的值
function f({x, y, z}) { ... }
f({z: 3, y: 2, x: 1});
```

4.提取JSON数据

```javascript
var jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};

let { id, status, data: number } = jsonData;

console.log(id, status, number);
// 42, "OK", [867, 5309]
```
