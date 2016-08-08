---
layout:     post
title:      "ES6-Iterator"
subtitle:   "Es6遍历器"
date:       2016-08-05 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - ES6
---

### 遍历器

* `Array`,`Set`,`Map`三种数据结构具有Iterator接口，可以直接使用`for...of`遍历。
* 它们原生部署了`Symbol.iterator`属性。凡是部署了`Symbol.iterator`属性的数据结构，就称为部署了遍历器接口。调用这个接口，就会返回一个遍历器对象。

拿数组举例：

```javascript
let arr = ['a', 'b', 'c'];

// Array.prototype.values()返回一个遍历器对象
for (let i of arr.values()) {
  console.log(i);
}

// 'a' 'b' 'c'

// Array.prototype[Symbol.iterator]指向数组的默认遍历器方法
// 即arr[Symbol.iterator]和arr.values指向的同一个遍历器方法地址，方法返回一个遍历器对象
for (let i of arr[Symbol.iterator]()) {
  console.log(i);
}

// 'a' 'b' 'c'

console.log(Array.prototype[Symbol.iterator] === Array.prototype.values);   //true
```

每个遍历器对象都会返回一个`next()`方法，`next()`方法返回两个属性`value`和`done`。当第一次执行next()时遍历器指针指向第一个元素，以后每执行一次next()，指针都会指向下一个元素。next()返回的value值表示指针当前指向的值，布尔值done表示是否已经到结尾。

```javascript
let arr = ['a', 'b', 'c'];

var iterArr = arr.values(); // 等价于var iterArr = arr[Symbol.iterator]();

var next1 = iterArr.next();
console.log(next1.value, next1.done);
var next2 = iterArr.next();
console.log(next2.value, next2.done);
var next3 = iterArr.next();
console.log(next3.value, next3.done);
var next4 = iterArr.next();
console.log(next4.value, next4.done);

//a false
//b false
//c false
//undefined true
```

模拟一个数组的遍历器函数

```javascript
let arr = ['a', 'b', 'c'];

var it = makeIterator(arr);
it.next();  //{ value: "a", done: false }
it.next();  //{ value: "b", done: false }
it.next();  //{ value: "c", done: false }
it.next();  //{ value: undefined, done: true }

function makeIterator(array) {
  var nextIndex = 0;    //这里使用了闭包，对应一个遍历器对象nextIndex是唯一的。
  return {
    next: function () {
      return nextIndex < array.length ?
        {next: array[nextIndex++], done: false} :
        {next: undefined, done: true}
    }
  }
}
```



