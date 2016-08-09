---
layout:     post
title:      "Angular学习笔记1"
subtitle:   "双向绑定 MVC"
date:       2015-08-07 12:00:00
author:     "wangxu"
header-img: "img/post-bg-2015.jpg"
tags:
    - Angular
---

#### 例子1

* 除了引入的`angular.js`没有任何js代码。
* 通过`ng-model`给`<input>`绑定一个模型变量`greeting.text`
* 这个模型变量的$scope是$rootScope（全局的），也就是在html任何位置都可以引入这个模型变量
* 通过`{{}}`引入模型变量

```html
<!DOCTYPE html>
<html lang="en" ng-app>
<head>
    <meta charset="UTF-8">
</head>
<body>
<div>
    <input ng-model="greeting.text"/>
    <p>{{greeting.text}},AngularJS</p>
</div>
</body>
<script src="angular.min.js"></script>
</html>
```

**双向绑定**
* 视图`<input>`输入框里文字的变化会引起数据模型`greeting.text`的变化（用户输入行为：视图->数据模型）
* 同样数据模型`greeting.text`的变化也会引起视图的变化（p标签文字变化：数据模型->视图）

#### 例子2

* 定义模块`hellapp`，并给`<html>`绑定这个模块。
* 定义`helloAngular`，给`$scope`增加属性`greeting`（数据模型）
* 由于`ng-controller`绑定了`<div>`，所以`$scope`作用域为这个`<div>`，即数据模型只在这个`<div>`中可以被引用。

```html
<!DOCTYPE html>
<html lang="en" ng-app="hellapp">
<head>
    <meta charset="UTF-8">
</head>
<body>
<div ng-controller="helloAngular">
    <p>{{greeting.text}},AngularJS</p>
</div>
</body>
<script src="angular.min.js"></script>
<script src="controller.js"></script>
</html>
```

```javascript
// 定义了模块hellapp
var myModule = angular.module("hellapp", []);

// 定义helloAngular
myModule.controller('helloAngular', ['$scope', function($scope) {
    $scope.greeting = {
        text: 'Hello'
    };
}]);
```

#### 例子3

* AngularJs中允许用户自定义标签
* 使用`directive`把`<hello>`替换成`<div>Hi everyone!</div>`

```html
<!doctype html>
<html ng-app="MyModule">
<head>
    <meta charset="utf-8">
</head>
<body>
<hello></hello>
</body>
<script src="angular.min.js"></script>
<script src="controller.js"></script>
</html>
```

```javascript
var myModule = angular.module('MyModule', []);

myModule.directive('hello', function() {
    return {
        restrict: 'E',
        template: '<div>Hi everyone!</div>',
        replace: true
    };
});
```

#### MVC

**MVC只是手段，终极目标是模块化和复用**

##### Controller

* 不要试图复用Controller，一个控制器一般只负责一小块视图
* 不要在Controller中操作Dom，这不是Controller的职责（一般把操作Dom的操作进行封装，在ng的指令中封装Dom操作。）
* 不要在Controller中做数据格式化，ng有很好的表单控件
* 不要在Controller中做数据过滤，ng有$filter服务
* 一般来说Controller是不会相互调用的，Controller之间的交互通过事件进行。

##### Model

```html
<div>
    <input ng-model="greeting.text"/>
    <p>{{greeting.text}},AngularJS</p>
</div>
```
内部原理：

* 在AngularJs加载完成后会启动。启动完成后首先会找`ng-app`这个指令，找到了之后，会认为`ng-app`这个标签里面的内容都由AngularJs来管理。然后会去找里面的所有指令，然后进行编译操作。上面的例子中。当找到`ng-model`后，会生成一个数据模型，这个数据模型是挂载在`$rootScope`上面（即根作用域），在`ng-app`下面的任意层级上标签都可以获取`greeting.text`这个值
* AngularJs里面的数据模型一般是不需要手动创建的，一般都是绑定在`$scope`这个对象上。比如在Controller中给`$scope`添加属性来实现。


#### View

**AngularJS的MVC是借助于$scope来实现的！！**

作用域的例子：

* $scope是有层级的。$rootScope是根作用域。
* 因为在`ListCtrl`的作用域中找不到`$scope.department`,所以会依次向上级作用域查找`department`，因为`department`是定义在根作用域中(在`GreetCtrl`中定义了`$rootScope.department`)，所以能够引用到。

```html
<!doctype html>
<html ng-app="MyModule">
<head>
    <meta charset="utf-8">
</head>
<body>
<div class="show-scope-demo">
    <div ng-controller="GreetCtrl">
        Hello {{name}}!
    </div>
    <div ng-controller="ListCtrl">
        <ol>
            <li ng-repeat="name in names">
                {{name}} from {{department}}
            </li>
        </ol>
    </div>
</div>
</body>
<script src="angular.min.js"></script>
<script src="controller.js"></script>
</html>
```

```javascript
var myModule = angular.module('MyModule', []);

myModule.controller('GreetCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.name = 'World';
    $rootScope.department = 'Angular';
}]);

myModule.controller('ListCtrl', ['$scope', function($scope) {
    $scope.names = ['Igor', 'Misko', 'Vojta'];
}]);
```

#### $scope的事件机制

例子1

```html
<!doctype html>
<html ng-app="MyModule">
<head>
    <meta charset="utf-8">
</head>
<body>
<div>
    <div ng-controller="Controller1">
        <p>{{greeting.text}},Angular</p>
        <button ng-click="test1()">test1</button>
    </div>
    <div ng-controller="Controller2">
        <p>{{greeting.text}},Angular</p>
        <button ng-click="test2()">test2</button>
    </div>
</div>
</body>
<script src="angular.min.js"></script>
<script src="controller.js"></script>
</html>
```

```javascript
var myModule = angular.module('MyModule', []);

myModule.controller('Controller1', ['$scope', function($scope) {
    $scope.greeting = {
        text: 'hello1'
    };
    $scope.test1 = function() {
        alert('test1');
    };
}]);

myModule.controller('Controller2', ['$scope', function($scope) {
    $scope.greeting = {
        text: 'hello2'
    };
    $scope.test2 = function() {
        alert('test2');
    };
}]);
```

例子2

* 点击$emit按钮事件向上传播
* 点击$broadcast按钮事件向下传播
* `ng-repeat="i in [1]"`为内联表达式，AngularJS支持这种内联写法

```html
<!doctype html>
<html ng-app="MyModule">
<head>
    <meta charset="utf-8">
</head>
<body>
<div ng-controller="EventController">
    Root scope
    <tt>MyEvent</tt> count: {{count}}
    <ul>
        <li ng-repeat="i in [1]" ng-controller="EventController">
            <button ng-click="$emit('MyEvent')">
                $emit
            </button>
            <button ng-click="$broadcast('MyEvent')">
                $broadcast
            </button>
            <br>
            Middle scope
            <tt>MyEvent</tt> count: {{count}}
            <ul>
                <li ng-repeat="item in [1, 2]" ng-controller="EventController">
                    Leaf scope
                    <tt>MyEvent</tt> count: {{count}}
                </li>
            </ul>
        </li>
    </ul>
</div>
</body>
<script src="angular.min.js"></script>
<script src="controller.js"></script>
</html>
```

```javascript
var myModule = angular.module('MyModule', []);

myModule.controller('EventController', ['$scope', function($scope) {
    $scope.count = 0;
    $scope.$on('MyEvent', function() {
        $scope.count++;
    });
}]);
```

#### $scope

1. $scope是一个js对象
2. $scope提供了一些工具方法$watch(),$apply()，一般不会手动调用这些方法，它会在内部监控这些对象值的变化
3. $scope是表达式的执行环境（或者叫作用域）
4. $scope是一个树形结构，与DOM标签平行。
5. 子$scope对象会继承父$scope上的属性和方法。
6. 每个Angular应用只有一个根$scope对象（一般位于ng-app上）
7. $scope可以传播事件，类似DOM事件，可以向上也可以向下
8. $scope是AngularJS的基础，不仅仅是MVC的基础也是实现双向数据绑定的基础
9. 可以用`angluar.element($0).scope()`进行调试

$scope的生命周期：
创建->注册监控->检测模型的变化->观察模型有没有脏->销毁
