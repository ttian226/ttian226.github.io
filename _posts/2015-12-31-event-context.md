---
layout:     post
title:      "关于事件上下文"
subtitle:   ""
date:       2015-12-31 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - Javascript
    - Event
---

### 事件的上下文

直接看例子，element元素的firstname属性没定义，所以是undefined

```javascript
var element = document.getElementById('element');

var user = {
 firstname: 'Bob',
 greeting: function(){
    // 这里this指向的element元素
   alert('My name is ' + this.firstname);
 }
};

element.addEventListener('click', user.greeting);

// alert => 'My name is undefined'
```

[完整代码](http://jsbin.com/caguwu/edit?html,js,output)

这回给element元素添加属性`firstname`

```javascript
element.firstname = 'button';

element.addEventListener('click', user.greeting);

// alert => 'My name is button'
```

[完整代码](http://jsbin.com/vagome/edit?html,js,output)

上面的代码结果实际上并不是我们期待的那样，我们希望`this`指向的是user。有两种方法可以实现。

一是在回调的匿名函数中调用`user.greeting()`

```javascript
element.addEventListener('click', function () {
  user.greeting();
});

// alert => 'My name is Bob'
```

[完整代码](http://jsbin.com/qexaki/edit?html,js,output)

二是使用Function.prototype.bind手动绑定上下文。

```javascript
// 通过bind返回一个新的函数引用，它的上下文指向user，再把这个函数引用赋值给user.greeting。
user.greeting = user.greeting.bind(user);

element.addEventListener('click', user.greeting);

// alert => 'My name is Bob'
```

[完整代码](http://jsbin.com/bixucu/edit?html,js,output)
