---
layout:     post
title:      "prototype VS __proto__"
subtitle:   "prototype和__proto__小结"
date:       2016-08-22 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - javascript
---

### 关于prototype和__proto__

每个类（函数）都有`prototype`属性，它指向这个类的原型对象。`prototype`只是类（函数）的属性，并不是实例的属性。

```javascript
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.show = function () {
  console.log('x:' + this.x + ' y:' + this.y);
};

var p = new Point(2, 3);
```

每个类的实例都有一个`__proto__`属性，它指向这个类的原型对象。例如上面的例子中`p`是类`Point`的实例，它的`__proto__`属性指向`Point`的原型对象。即`p.__proto__ === Point.prototype`

每个类的原型对象默认都包含两个属性：

1. `constructor`（构造函数）指向这个类本身。上例中`Point.prototype.constructor === Point`
2. `__proto__`，它指向上层作用域链的原型对象。（注，这里只是原型对象中的`__proto__`，如果是实例的`__proto__`属性则指向实例的原型对象），上例中由于Point直接继承了Object的原型属性，所以下面两个表达式返回`true`：

```javascript
p.__proto__.__proto__ === Object.prototype  //true
Point.prototype.__proto__ === Object.prototype  //true
```

