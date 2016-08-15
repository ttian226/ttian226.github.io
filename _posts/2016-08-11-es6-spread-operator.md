---
layout:     post
title:      "ES6-Spread Operator"
subtitle:   "扩展操作符"
date:       2016-08-11 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - ES6
---

### 扩展运算符

扩展运算符是`...`。放在数组前面可以把数组转化为用逗号分隔的参数序列。

```javascript
console.log(...[1, 2, 3]);  //1, 2, 3
// 等价于
console.log(1, 2, 3);
```

`...`用于函数的参数

用作函数的形参。传入的是一个参数序列，接收的是扩展运算符。
由于`...[1, 2, 3]`可以转化为参数序列`1, 2, 3`。所以逆向来看`push(arr, 1, 2, 3)`=>`push(array, ...items)`。`items`就等于`[1, 2, 3]`

```javascript
// 这里传进来的items是[1, 2, 3]
function push(array, ...items) {
  // 在数组items前面加...会转化为参数序列，这里等价于array.push(1, 2, 3)
  array.push(...items);
}

var arr = [];
push(arr, 1, 2, 3);
console.log(arr);   //[1, 2, 3]
```

用作函数的实参。传入的是扩展运算符，接收的是函数序列。

```javascript
function add(x, y) {
  return x + y;
}

var numbers = [10, 20];
add(...numbers);    //这里通过扩展运算符把数组转为参数序列，等价于add(10, 20)
```

可以替代`apply`方法。`apply`是接收一个参数数组作为第二个参数。

```javascript
function add(x, y, z) {
  return x + y + z;
}

var args = [1, 2, 3];
add.apply(this, args);  //6
// 等价于
add(...args); //6
```

使用`Math.max()`求数组中的最大值

```javascript
Math.max(1, 2, 3);  //3

// 使用apply求数组中的最大值
function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

// 使用扩展运算符
function getMaxOfArray(numArray) {
  return Math.max(...numArray);
}
```


