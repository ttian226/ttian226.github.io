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

#### 例：将一个数组添加到另一个数组的尾部

如果直接使用`arr1.push(arr2)`，会把arr2作为一个元素添加到`arr1`中。

```javascript
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
arr1.push(arr2);
console.log(arr1);  //[0, 1, 2, [3, 4, 5]]
```

通过`apply`方法改写

```javascript
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
Array.prototype.push.apply(arr1, arr2); //或者[].push.apply(arr1, arr2);
console.log(arr1);  //[0, 1, 2, 3, 4, 5]
```

通过扩展运算符改写

```javascript
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
arr1.push(...arr2); //把数组arr2转换为参数序列
console.log(arr1);  //[0, 1, 2, 3, 4, 5]
```

### 扩展运算符的应用

1.用来合并数组

```javascript
// ES5
[1, 2].concat(more)
// ES6
[1, 2, ...more]

var arr1 = ['a', 'b'];
var arr2 = ['c'];
var arr3 = ['d', 'e'];

// ES5的合并数组
arr1.concat(arr2, arr3);
// [ 'a', 'b', 'c', 'd', 'e' ]

// ES6的合并数组
[...arr1, ...arr2, ...arr3]
// [ 'a', 'b', 'c', 'd', 'e' ]
```

2.与数组的解构赋值结合使用

```javascript
var list = ['a', 'b', 'c', 'd', 'e'];

// ES5
var a = list[0];
var rest = list.slice(1); //["b", "c", "d", "e"]

// ES6
[a, ...rest] = list;
```

另外一些例子：

```javascript
const [first, ...rest] = [1, 2, 3, 4, 5];
first // 1
rest  // [2, 3, 4, 5]

const [first, ...rest] = [];
first // undefined
rest  // []:

const [first, ...rest] = ["foo"];
first  // "foo"
rest   // []
```

如果将扩展运算符用于数组赋值，只能放在参数的最后一位，否则会报错。

```javascript
const [...butLast, last] = [1, 2, 3, 4, 5];
// 报错
```

3.字符串

扩展运算符可以将字符串转为字符数组，如：

```javascript
[...'hello']
//["h", "e", "l", "l", "o"]
```

4.实现了Iterator接口的对象

任何实现了Iterator接口的对象，都可以用扩展运算符转为真正的数组。

```html
<div>1</div>
<div>2</div>
<div>3</div>
```

`querySelectorAll`方法返回了一个`nodeList`对象。可以通过扩展运算符将它转为一个真正的数组。因为`nodeList`对象实现了Iterator接口。

```javascript
document.addEventListener('DOMContentLoaded', function (e) {
  var divs = document.querySelectorAll('div');
  console.log(Array.isArray(divs)); //false
  var divarr = [...divs];
  console.log(Array.isArray(divarr)); //true
});
```

`arguments`对象也可以通过扩展运算符转为数组

```javascript
function add(a, b, c) {
  console.log(Array.isArray(arguments));  //false
  var arragrs = [...arguments];
  console.log(Array.isArray(arragrs));  //true
}
add(1, 2, 3);
```

没有部署Iterator接口的类数组对象则无法通过扩展运算符转为真正的数组。

```javascript
var arrayLike = {
  '0': 'a',
  '1': 'b',
  '2': 'c',
  length: 3
};

// ES5转换为数组
var arr = [].slice.apply(arrayLike);
console.log(arr);   //['a', 'b', 'c']

// 通过ES6的Array.from
var arr1 = Array.from(arrayLike);
console.log(arr1);  //['a', 'b', 'c']

// 扩展运算符会报错，是因为这个对象没有部署Iterator接口
var arr2 = [...arrayLike];
// TypeError: arrayLike[Symbol.iterator] is not a function
```

6.Map和Set结构

由于`Map`和`Set`的`values()``keys()``entries()`都返回一个遍历器对象（或者说实现了Iterator接口，它们能使用`for...of`来遍历）。所以可以用扩展操作符。

由于`Map`实例的默认遍历器的生成函数就是实例的`entries()`方法。因为`Map.prototype[Symbol.iterator] === Map.prototype.entries`。所以扩展操作符可以应用在Map实例上`[...new Map()]`

```javascript
var map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three']
]);

// 应用在Map实例的values()方法上
var arrvalue = [...map.values()];
console.log(arrvalue);  //["one", "two", "three"]

// 应用在Map实例的keys()方法上
var arrkey = [...map.keys()];
console.log(arrkey);  //[1, 2, 3]

// 应用在Map实例的entries()方法上
var arrentries = [...map.entries()];
console.log(arrentries);  //[[1, 'one'], [2, 'two'], [3, 'three']]

// 扩展操作符直接应用在Map实例上，等价于应用在实例的entries()方法上
var arrmap = [...map];
console.log(arrmap);  //[[1, 'one'], [2, 'two'], [3, 'three']]
```

同`Map`类似，`Set`实例默认的遍历生成函数是实例的`values()`方法，即`Set.prototype[Symbol.iterator] === Set.prototype.values`。

```javascript
var set = new Set(['red', 'blue', 'green']);

var arrvalues = [...set.values()];
console.log(arrvalues); //["red", "blue", "green"]

var arrset = [...set];
console.log(arrset);  //["red", "blue", "green"]
```

使用扩展操作符对数组去重

```javascript
var set = new Set([1, 1, 2, 3, 3]);
var arr = [...set];
console.log(arr); //[1, 2, 3]
```

### rest参数

ES6引入rest参数，用户获取函数的多余参数。

```javascript
// 参数只有一个，values为所有的参数组成的数组
function fn1(...values) {
  console.log(values);  //[1, 2, 3, 4]
}

// 参数有多个，values为剩余参数组成的数组
function fn2(val, ...values) {
  console.log(val); //1
  console.log(values);  //[2, 3, 4]
}

fn1(1, 2, 3, 4);
fn2(1, 2, 3, 4);
```

例：使用rest参数来对参数求和

```javascript
function add(...values) {
  let sum = 0;
  for (let val of values) {
    sum += val;
  }
  return sum;
}

add(1, 2, 3, 4);
```

rest参数可以用来替代`arguments`对象。区别在于`arguments`是类数组而rest参数是真正的数组。

```javascript
function fn(...values) {
  console.log(Array.isArray(values)); //true
  console.log(Array.isArray(arguments));  //false
}

fn(1, 2, 3, 4);
```

不使用rest参数，只使用`arguments`对象来对数组元素排序：

```javascript
// 先通过Array.prototype.slice把类数组对象转换为数组。
function sort() {
  return Array.prototype.slice.call(arguments).sort();
}

sort('cherries', 'apples', 'bananas');  //["apples", "bananas", "cherries"]
```

如果使用rest参数会更简洁（配合使用箭头函数）：

```javascript
const sort = (...values) => values.sort();  //["apples", "bananas", "cherries"]
```

注：rest参数只能是最后一个参数，它后面不能有参数，否则会报错。



