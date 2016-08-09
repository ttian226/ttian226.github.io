---
layout:     post
title:      "Angular PhoneCat的实现2"
subtitle:   "多视图和路由"
date:       2016-01-18 12:00:00
author:     "wangxu"
header-img: "img/post-bg-2015.jpg"
tags:
    - Angular
---

#### 多视图，路由


为了增加详细信息视图，我们可以拓展index.html来同时包含两个视图的模板代码，但是这样会很快给我们带来巨大的麻烦。相反，我们要把index.html模板转变成“布局模板”。这是我们应用所有视图的通用模板。其他的“局部布局模板”随后根据当前的“路由”被充填入，从而形成一个完整视图展示给用户。

index.html:
* 移除了大部分代码，只保留了一个`<div>`同时带有`ng-view`属性
* `$route`服务通常是用来配合`ngView`来执行的，`ngView`通常是用来使用在index.html中。
* 为了使用`$route`服务必须先要安装`ngRoute`模块。*使用`ngRoute`模块需要事先加载`angular-route.js`*

```html
<!DOCTYPE html>
<html lang="en" ng-app="phonecatApp">
<head>
    <meta charset="UTF-8">
    <title></title>
    <link rel="stylesheet" href="bootstrap/css/bootstrap.css"/>
    <link rel="stylesheet" href="app.css"/>
    <script src="angular.min.js"></script>
    <script src="angular-route.min.js"></script>
    <script src="app.js"></script>
    <script src="controller.js"></script>
</head>
<body>
<div ng-view></div>
</body>
</html>
```

phone-list.html

`$route`服务通常和`ngView`指令一起使用。`ngView`指令的角色是为当前路由把对应的视图模板载入到布局模板中

```html
<div class="container-fluid">
    <div class="row">
        <div class="col-md-2">
            <!--Sidebar content-->

            Search: <input ng-model="query">
            Sort by:
            <select ng-model="orderProp">
                <option value="name">Alphabetical</option>
                <option value="age">Newest</option>
            </select>

        </div>
        <div class="col-md-10">
            <!--Body content-->

            <ul class="phones">
                <li ng-repeat="phone in phones | filter:query | orderBy:orderProp" class="thumbnail">
                    <a href="#/phones/{{phone.id}}" class="thumb"><img ng-src="{{phone.imageUrl}}"></a>
                    <a href="#/phones/{{phone.id}}">{{phone.name}}</a>
                    <p>{{phone.snippet}}</p>
                </li>
            </ul>

        </div>
    </div>
</div>
```

phone-detail.html

```html
TBD: detail view for <span>{{phoneId}}</span>
```

app.js

AngularJS中应用的路由通过`$routeProvider`来声明，它是`$route`服务的提供者。

```javascript
// 定义模块phonecatApp，它依赖两个模块ngRoute和phonecatController
// 其中ngRoute为Angular提供的模块(以ng开头的都是Angular提供的模块)，phonecatController是用户自定义模块
var mainModule = angular.module('phonecatApp', [
    'ngRoute',
    'phonecatController'
]);

// 定义路由规则，$routeProvider是$route服务的提供者
// 这里没有在html中定义ng-controller，而是在路由中定义controller
// controller中的$scope对应的作用域为对应的html模板
mainModule.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/phones', {
            templateUrl: 'phone-list.html',
            controller: 'PhoneListCtrl'
        }).
        when('/phones/:phoneId', {
            templateUrl: 'phone-detail.html',
            controller: 'PhoneDetailCtrl'
        }).
        otherwise({
            // 默认路由
            redirectTo: '/phones'
        });
}]);
```
生成页面的地址为:
* 列表页：`#/phones`
* 单页：`#/phones/phoneId`
*`#`是为了防止向后台提交请求，`#`其实是内部的一个锚点，在页面内进行跳转，AngularJS会拦截这个地址，把`#`后面的内容取出来，跟`$routeProvider`里面的路由做匹配，如果匹配到，则展现某个视图*


controller.js

```javascript
// 定义模块phonecatController
var phoneModule = angular.module('phonecatController', []);

// 定义控制器PhoneListCtrl，控制器的$scope为phone-list.html
phoneModule.controller('PhoneListCtrl', ['$scope', '$http', function($scope, $http){
    $http.get('data.json').success(function(data) {
        $scope.phones = data;
    });
    // 给数据模型orderProp赋初值，虽然在html中已经定义了数据模型orderProp，但是需要通过用户操作select标签来改变数据模型
    $scope.orderProp = 'age';
}]);

// 定义控制器PhoneDetailCtrl，控制器的$scope为phone-detail.html
phoneModule.controller('PhoneDetailCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
    $scope.phoneId = $routeParams.phoneId;
}]);
```

**这个例子自定义了一个模块phonecatController来专门负责来定义控制器，其实完全也可以不用这个模块，完全通过主模块来定义控制器**

data.json

```json
[
    {
        "id": "nexus-s",
        "imageUrl": "img/phones/nexus-s.0.jpg",
        "name": "Nexus S",
        "snippet": "Fast just got faster with Nexus S.",
        "age": 1
    },
    {
        "id": "motorola-xoom-with-wi-fi",
        "imageUrl": "img/phones/motorola-xoom-with-wi-fi.0.jpg",
        "name": "Motorola XOOM™ with Wi-Fi",
        "snippet": "The Next, Next Generation tablet.",
        "age": 2
    },
    {
        "id": "motorola-xoom",
        "imageUrl": "img/phones/motorola-xoom.0.jpg",
        "name": "MOTOROLA XOOM™",
        "snippet": "The Next, Next Generation tablet.",
        "age": 3
    }
]
```

###### 关于模块的定义

不使用依赖

```javascript
// 定义一个新模块，模块名为phonecatApp。
// 第二个参数是依赖模块列表，如果是[]则不需要依赖模块
// 在html中引入模块使用ng-app="phonecatApp"
var myModule = angular.module('phonecatApp', []);
```
使用依赖

```javascript
// 定义一个新模块,模块名为phonecatControllers
var myModule1 = angular.module('phonecatControllers', []);

// 定义模块phonecatApp，依赖两个模块ngRoute和phonecatControllers
// 其中ngRoute是ng提供的路由模块,phonecatControllers是刚刚定义的模块
var myModule2 = angular.module('phonecatApp', [
    'ngRoute',
    'phonecatControllers'
]);
```

