---
layout:     post
title:      "Angular Scope"
subtitle:   "NG Scope"
date:       2015-09-01 12:00:00
author:     "wangxu"
header-img: "img/post-bg-2015.jpg"
tags:
    - Angular
    - 翻译
---

#### Scopes

#### Scopes作为数据模型

Scope是作为controller和view的纽带，在模板链接阶段，指令给scope设置了`$watch`表达式。`$watch`允许指令监控属性的变化，并允许指令去渲染在DOM中更新的值。

控制器和指令都都拥有指向scope的引用，这种安排把控制器从指令和DOM中剥离出来。

```html
<div ng-controller="MyController">
    Your name:
    <input type="text" ng-model="username">
    <button ng-click='sayHello()'>greet</button>
    <hr>
    {{greeting}}
</div>
```

```javascript
var myModule = angular.module("MyModule", []);

myModule.controller('MyController', ['$scope', function ($scope) {
    $scope.username = 'World';

    $scope.sayHello = function() {
        $scope.greeting = 'Hello ' + $scope.username + '!';
    };
}]);
```

#### Scope层级

#### Scope生命周期

通常来说浏览器接收到事件的时刻就是响应了javascript的回调函数。一旦回调完成，浏览器会重新渲染DOM并返回等待其它事件。

当浏览器调用js代码是在angular上下文外时，这意味着angular是不会意识到模型变量的改变的。可以使用`$apply()`方法来进入angular上下文处理模型变量的改变。只有在`$apply()`中处理的模型变量变化可以被angular来识别。例如如果一条指令监听到了像是`ng-click`的DOM事件，它必须在`$apply()`中求值表达式（evaluate the expression）。

当求值表达式之后，`$apply()`将执行`$digest`，在`$digest`阶段，scope将检查所有的`$watch`表达式并且和它们之前的值作比较。这个脏检查是异步的，这就意味着像是这样的赋值`$scope.username="angular"`不会立即引起`$watch`被通知。

