---
layout:     post
title:      "Angular学习笔记4"
subtitle:   "ngAnimate指令"
date:       2015-08-14 12:00:00
author:     "wangxu"
header-img: "img/post-bg-2015.jpg"
tags:
    - Angular
---

#### ngAnimate指令

`ngAnimate`会根据是进入还是离开视图来为不同的Angular指令(`directive`)添加和移除不同的CSS类名。例如，当我们加载网站时，无论`ng-view`中填充了什么都会得到一个`.ng-enter`的类名。我们所需要做的就是给`.ng-enter`类名添加CSS动画效果，该动画在进入的时候会自动生效。

index.html,使用`ngAnimate`指令需要引入`angular-animate.js`文件

```html
<!DOCTYPE html>
<html lang="en" ng-app="bookStoreApp">
<head>
    <meta charset="UTF-8">
    <title>bookstore</title>
    <link rel="stylesheet" href="framework/bootstrap-3.3.5-dist/css/bootstrap.css"/>
    <link rel="stylesheet" href="framework/bootstrap-3.3.5-dist/css/bootstrap-theme.css"/>
    <link rel="stylesheet" href="css/index.css"/>
    <script src="framework/angular-1.4.3/angular.js"></script>
    <script src="framework/angular-1.4.3/angular-route.js"></script>
    <script src="framework/angular-1.4.3/angular-animate.js"></script>
    <script src="js/app.js"></script>
    <script src="js/controllers.js"></script>
    <script src="js/filters.js"></script>
    <script src="js/services.js"></script>
    <script src="js/directives.js"></script>
</head>
<body>
<div class="page {{pageClass}}" ng-view></div>
</body>
</html>
```

app.js，定义主模块`bookStoreApp`，需要依赖`ngRoute`,`ngAnimate`模块，控制器模块`bookStoreCtrls`。（`bookStoreFilters`，`bookStoreServices`，`bookStoreDirectives`这3个模块没有实际业务代码）

```javascript
var bookStoreApp = angular.module('bookStoreApp', [
    'ngRoute',
    'ngAnimate',
    'bookStoreCtrls',
    'bookStoreFilters',
    'bookStoreServices',
    'bookStoreDirectives'
]);

// 通过routeProvider配置路由
bookStoreApp.config(function($routeProvider) {
    $routeProvider.when('/hello', {
        templateUrl: 'tpls/hello.html',
        controller: 'HelloCtrl'
    }).when('/list', {
        templateUrl: 'tpls/bookList.html',
        controller: 'BookListCtrl'
    }).otherwise({
        redirectTo: '/hello'
    });
});
```

controllers.js，定义控制器模块`bookStoreCtrls`

```javascript
var bookStoreCtrls = angular.module('bookStoreCtrls', []);

bookStoreCtrls.controller('HelloCtrl', ['$scope', function($scope) {
    $scope.greeting = {text: 'Hello'};
    $scope.pageClass = 'hello';
}]);

bookStoreCtrls.controller('BookListCtrl', ['$scope', function($scope) {
    $scope.books = [
        {
            title: "《Ext江湖》",
            author: "大漠穷秋"
        },
        {
            title: "《ActionScript游戏设计基础（第二版）》",
            author: "大漠穷秋"
        },
        {
            title: "《用AngularJS开发下一代WEB应用》",
            author: "大漠穷秋"
        }
    ];
    $scope.pageClass = 'list';
}]);
```

index.css

* 当hello.html页面加载执行动画，自动添加类`ng-animate`,`ng-enter`,`ng-enter-active`
![Image](https://github.com/ttian226/learn_angularjs/blob/master/imgs/QQ20150814-1@2x.png)


* 动画加载时的样式：
![Image](https://github.com/ttian226/learn_angularjs/blob/master/imgs/QQ20150814-2@2x.png)


* 从hello页面跳转到list时
![Image](https://github.com/ttian226/learn_angularjs/blob/master/imgs/QQ20150814-4@2x.png)

```css
.page {
    bottom:0;
    padding-top:200px;
    position:absolute;
    text-align:center;
    top:0;
    width:100%;
}
.page h1 {
    font-size:60px;
}
.page a {
    margin-top:50px;
}
.hello {
    background:#00D0BC;
    color:#FFFFFF;
}
.list{
    background:#E59400;
    color:#FFFFFF;
}
@keyframes rotateFall {
    0% {
        transform: rotateZ(0deg);
    }
    20% {
        transform: rotateZ(10deg);
        animation-timing-function: ease-out;
    }
    40% {
        transform: rotateZ(17deg);
    }
    60% {
        transform: rotateZ(16deg);
    }
    100% {
        transform: translateY(100%) rotateZ(17deg);
    }
}
@keyframes slideOutLeft {
    to {
        transform: translateX(-100%);
    }
}
@keyframes rotateOutNewspaper {
    to {
        transform: translateZ(-3000px) rotateZ(360deg);
        opacity: 0;
    }
}
@keyframes scaleUp {
    from {
        opacity: 0.3;
        -webkit-transform: scale(0.8);
    }
}
@keyframes slideInRight {
    from {
        transform:translateX(100%);
    }
    to {
        transform: translateX(0);
    }
}
@keyframes slideInUp {
    from {
        transform:translateY(100%);
    }
    to {
        transform: translateY(0);
    }
}
.ng-enter {
    z-index: 8888;
}
.ng-leave {
    z-index: 9999;
}
.hello.ng-enter {
    animation: scaleUp 0.5s both ease-in;
}
.hello.ng-leave {
    transform-origin: 0% 0%;
    animation: rotateFall 1s both ease-in;
}
.list.ng-enter {
    animation:slideInRight 0.5s both ease-in;
}
.list.ng-leave {
    animation:slideOutLeft 0.5s both ease-in;
}
```
