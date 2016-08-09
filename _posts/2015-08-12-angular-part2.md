---
layout:     post
title:      "Angular学习笔记2"
subtitle:   "模块 路由"
date:       2015-08-12 12:00:00
author:     "wangxu"
header-img: "img/post-bg-2015.jpg"
tags:
    - Angular
---

#### 模块定义

AngularJS实现模块化步骤：
* 用`angular`这个全局对象的`module`方法去定义一个模块
* 在这个`module`的实例上去调用`controller`方法来创建`helloAngular`的控制器
* 根据官方的定义，AngularJS中的模块是一个集合，是由模型，视图，控制器，过滤器，服务等组合到一起，实现某一个功能。

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

#### 目录结构

![Image](https://github.com/ttian226/learn_angularjs/blob/master/imgs/ng-file-list.png)

* framework存放angularjs以及第三方库如bootstrap等。
* tpls目录存放模板文件（html片段）
* js目录存放js文件，app.js作为启动点的js
* index.html应用的主html文件(包含`<div ng-view></div>`,根容器)

#### 路由

本质上来说路由就是根据地址栏里的url的不同，去展现不同的视图。这个视图是由控制器去负责生成的。不同的视图有不同的控制器去处理

#### ng官方推荐的模块切分方式

![Image](https://github.com/ttian226/learn_angularjs/blob/master/imgs/ng-modules.png)

* 任何一个ng应用都是由控制器，指令，服务，路由，过滤器等有限的模块类型构成的
* 控制器，指令，服务，路由，过滤器分别放在一个模块里（可借助grunt合并）
* 用一个总的app模块作为入口点，它依赖其它所有模块

```html
<html ng-app="bookStoreApp">
```

```javascript
var bookStoreApp = angular.module('bookStoreApp', [
    'ngRoute', 'ngAnimate', 'bookStoreCtrls', 'bookStoreFilters',
    'bookStoreServices', 'bookStoreDirectives'
]);
```
关于模块的加载说明：

`bookStoreApp`是作为一个启动点的，angularjs在加载完成后会找`ng-app`这个指令（`ng-app`在一个应用只能有一个），找到了之后就会尝试执行这个启动点模块，然后发现启动点模块`bookStoreApp`还依赖其它模块。然后会等待这些模块加载完成。实际上和js文件的加载顺序没有太大关系。


#### 使用ng-bind指令

之前的例子，使用`{{}}`取值表达式时，当页面刷新快的时候页面上会显示出`{greeting.text}}`这样的文字。

```html
<div ng-controller="helloAngular">
    <p>{{greeting.text}},AngularJS</p>
</div>
```

使用`ng-bind`指令则不会出现这样的问题，其它代码都不变，只改变`<p>`节点

```html
<div ng-controller="helloAngular">
    <p><span ng-bind="greeting.text"></span>,AngularJS</p>
</div>
```

什么时候使用`ng-bind`什么时候使用`{{}}`
在index.html中通常是第一个页面，使用`ng-bind`。后续的页面使用`{{}}`进行绑定。


#### 双向数据绑定

index.html:

```html
<!DOCTYPE html>
<html lang="en" ng-app="UserInfoModule">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="bootstrap/css/bootstrap.css"/>
</head>
<body>
<div class="panel panel-primary">
    <div class="panel-heading">
        <div class="panel-title">双向数据绑定</div>
    </div>
    <div class="panel-body">
        <div class="row">
            <div class="col-md-12">
                <form class="form-horizontal" role="form" ng-controller="UserInfoCtrl">
                    <div class="form-group">
                        <label class="col-md-2 control-label">
                            邮箱：
                        </label>
                        <div class="col-md-10">
                            <input type="email" class="form-control" placeholder="推荐使用163邮箱" ng-model="userInfo.email"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 control-label">
                            密码：
                        </label>
                        <div class="col-md-10">
                            <input type="password" class="form-control" placeholder="只能是数字，字母，下划线" ng-model="userInfo.password"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-md-offset-2 col-md-10">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" ng-model="userInfo.autoLogin"/>自动登录
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-md-offset-2 col-md-10">
                            <button class="btn btn-default" ng-click="getFormData()">获取Form表单的值</button>
                            <button class="btn btn-default" ng-click="setFormData()">设置Form表单的值</button>
                            <button class="btn btn-default" ng-click="resetForm()">重置Form表单</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
</body>
<script src="angular.min.js"></script>
<script src="form.js"></script>
</html>
```

form.js:

```javascript
var UserInfoModule = angular.module('UserInfoModule', []);

UserInfoModule.controller('UserInfoCtrl', ['$scope', function($scope) {
    // 初始化模板数据，从数据模型到模板方向上的绑定
    $scope.userInfo = {
        email: 'wangxu825@163.com',
        password: '123456',
        autoLogin: true
    };

    $scope.getFormData = function() {
        console.log($scope.userInfo);
    };

    // 给按钮绑定的方法，修改数据模型的值
    $scope.setFormData = function() {
        $scope.userInfo = {
            email: '120050856@qq.com',
            password: 'qweasd',
            autoLogin: false
        };
    };

    // 重置数据模型的值
    $scope.resetForm = function() {
        $scope.userInfo = {
            email: 'wangxu825@163.com',
            password: '123456',
            autoLogin: true
        };
    };
}]);
```

* `UserInfoCtrl`中初始化`$scope.userInfo`，使模板上显示对应的数据。是从数据模型到模板方向上的绑定。
* `getFormData`方法用来显示数据模型的值。修改页面上的数据，点击按钮，可以查看对应的数据模型的值也发生了改变。是从模板到数据模型方向上的绑定。
* `setFormData`可以修改数据模型的值。数据模型被修改后，会在模板上同步显示出来。
