---
layout:     post
title:      "TS变量声明"
subtitle:   ""
date:       2017-11-21 12:00:00
author:     "wangxu"
header-img: "img/post-bg-Tokyo-City.jpg"
tags:
    - TypeScript
---

### 变量声明

`let`和`const`是JavaScript两个新的变量声明方式。正如我们之前提到的，`let`在很多方面与`var`类似，但可以帮助大家避免一些在JavaScript中的常见问题。`const`是`let`的一个增强，它可以防止对变量的再赋值。

因为TS是JS的超级，所以天然支持`let`和`const`。这里我们将详述这些新的声明方式为什么它们比`var`更好。

#### Var声明

通常情况下，JavaScript声明一个变量使用`var`关键字

```javascript
var a = 10;
```

这里定义了一个名为a值为10的变量。

我们同样可以在一个函数内部定义变量：

```javascript
function f() {
    var message = 'hello world';
    return message;
}
```

我们可以在其它函数内部访问相同的变量：

```javascript
function f() {
  var a = 10;
  return function g() {
    var b = a + 1;
    return b;
  }
}

var g = f();
g(); // 11
```

在上面这个例子中，`g`获得了定义在`f`中的变量`a`。每当`g`被调用时，它都可以访问`f`中的`a`的值，即使`g`在`f`执行完被调用，它仍然能够访问和改变`a`。

```javascript
function f() {
  var a = 1;
  
  a = 2;
  var b = g();
  a = 3;

  return b;

  function g() {
    return a;
  }
}

f(); // return 2
```

#### 作用域规则

对于使用其它语言的人来说，`var`会产生一些奇怪的作用域规则，例如：

```typescript
function f(shouldInitialize: boolean) {
  if (shouldInitialize) {
    var x = 10;
  }
  return x;
}

f(true); // 10
f(false); // undefined
```

有些读者可能要多看几遍这个例子，变量`x`定义在`if`块里，然而我们却能够从块外访问到它。这是因为`var`声明的变量可以在包含它们的函数，模块，命名空间或者全局作用域中的任意位置被访问，而和他所在的块却没有关系。一些人管这个叫做*var-scoping*或*function-scoping*。函数参数同样使用函数作用域。

这些作用域规则能引起一些类型错误。其中之一就是，多次声明同一个变量不会报错。

```typescript
function sumMatrix(matrix: number[][]) {
  var sum = 0;
  for (var i = 0; i < matrix.length; i++) {
    var currentRow = matrix[i];
    for (var i = 0; i < currentRow.length; i++) {
      sum += currentRow[i];
    }
  }
  return sum;
}
```

这里很容易看出来，内部的`for`循环将会覆盖变量`i`，因为`i`引用了相同函数作用域中的变量。有经验的程序员都知道，类似的bug很容易在代码检查中漏掉，产生无穷的麻烦。

#### 变量的怪异之处

快速看下面的代码会输出什么

```javascript
for (var i = 0; i < 10; i++) {
  setTimeout(function () {
    console.log(i);
  }, 100 * i)
}
```

`setTimeout`会等待若干毫秒后执行，来看下结果：

```javascript
10
10
10
10
10
10
10
10
10
10
```

很多JavaScript开发者已经很熟悉这种行为了，但是还是有很多人期待输出是如下这样：

```javascript
0
1
2
3
4
5
6
7
8
9
```

还记得我们之前提到的关于变量的捕获吗？每一个我们传给`setTimeout`的函数表达式实际上都引用了相同作用域的`i`。

让我们花点时间考虑下这意味着什么，`setTimeout`将在若干毫秒后执行函数，并且只是在`for`循环终止后才执行。在`for`循环终止时`i`的值是10，所以每次函数被调用都是打印的`10`。

一个通常的解决办法就是使用IIFE（立即执行函数表达式），去捕获每次迭代的`i`值。

```javascript
for (var i = 0; i < 10; i++) {
  (function (i) {
    setTimeout(function () {
      console.log(i);
    }, 100 * i);
  })(i);
}
```

这种看起来很奇怪的形式实际上非常普遍。参数`i`实际上是`for`循环中声明的`i`的一个拷贝。正因为我们命名了相同的名字，所以我们不用怎么改`for`循环体里的代码。

#### let声明

