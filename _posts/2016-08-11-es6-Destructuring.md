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


