---
layout:     post
title:      "Angular PhoneCat的实现4"
subtitle:   "添加过滤器 事件处理"
date:       2015-08-25 12:00:00
author:     "wangxu"
header-img: "img/post-bg-2015.jpg"
tags:
    - Angular
---

### 过滤器

app.js给主模块增加一个依赖模块`phonecatFilters`（过滤器模块）

```javascript
var mainModule = angular.module('phonecatApp', [
    'ngRoute',
    'phonecatController',
    'phonecatFilters'
]);
```

在filters.js中，首先定义过滤模块。然后调用这个模块的实例方法`filter`定义过滤器，第一个参数为过滤器的名字`checkmark`，第二个参数是过滤函数它是一个匿名函数。

```javascript
// 定义过滤模块
var filterModule = angular.module('phonecatFilters', []);

// 调用模块的实例方法filter添加过滤器。过滤器的名字为checkmark
filterModule.filter('checkmark', function() {
    // 匿名函数返回一个函数，参数为html中对应的数据模型
    return function(input) {
        // 当input为ture时返回'\u2713'（√），为false时返回'\u2718'（×）
        return input ? '\u2713' : '\u2718';
    };
});
```

在AngularJS模板中使用的过滤器语法为:
`{% raw %}{{ expression | filter }}{% endraw %}`

在模板phone-detail.html中添加了过滤器`checkmark`，例如`{{phone.connectivity.infrared | checkmark}}`,用`checkmark`替换数据模型`phone.connectivity.infrared`的值。

```html
{% raw %}
<li>
    <span>Connectivity</span>
    <dl>
        <dt>Infrared</dt>
        <dd>{{phone.connectivity.infrared | checkmark}}</dd>
        <dt>GPS</dt>
        <dd>{{phone.connectivity.gps | checkmark}}</dd>
    </dl>
</li>
{% endraw %}
```

#### 事件处理器

在controller.js中修改控制器`PhoneDetailCtrl`，创建了`mainImageUrl`模型属性，并把它的默认值设置为第一张图片

```javascript
phoneModule.controller('PhoneDetailCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
    $http.get('phones/' + $routeParams.phoneId + '.json').success(function(data) {
        $scope.phone = data;
        $scope.mainImageUrl = data.images[0];
    });

    $scope.setImage = function(imageUrl) {
        $scope.mainImageUrl = imageUrl;
    };
}]);
```

phone-detail.html中，把大图的`ngSrc`指令绑定到`mainImageUrl`属性上。同时注册一个`ngClick`指令到缩略图上。当一个用户点击缩略图的任意一个时，这个处理器会使用`setImage`事件处理函数来把`mainImageUrl`属性设置成选定缩略图的URL

```html
{% raw %}
<img ng-src="{{mainImageUrl}}" class="phone">

<ul class="phone-thumbs">
    <li ng-repeat="img in phone.images">
        <img ng-src="{{img}}" ng-click="setImage(img)">
    </li>
</ul>
{% endraw %}
```

#### REST和定制服务

定制的服务被定义在services.js中，同时要引入angularjs-resource.js。它包含了`ngResource`模块以及其中的`$resource`服务。
我们使用模块API通过一个工厂方法注册了一个定制服务。我们传入服务的名字`Phone`和工厂函数。工厂函数和控制器构造函数差不多，它们都通过函数参数声明依赖服务。`Phone`服务声明了它依赖于`$resource`服务。

`$resource`服务使得用短短的几行代码就可以创建一个RESTful客户端。我们的应用使用这个客户端来代替底层的`$http`服务。

```javascript
// 定义模块phonecatServices
var phonecatServices = angular.module('phonecatServices', ['ngResource']);

// 使用模块的实例调用工厂方法注册一个定制服务Phone，同时注入$resource服务。
phonecatServices.factory('Phone', ['$resource', function($resource) {
    return $resource('phones/:phoneId.json', {}, {
        query: {
            method: 'GET',
            params: {phoneId: 'phones'},
            isArray: true
        }
    });
}]);
```

app.js中把`phonecatServices`添加到`phonecatApp`的依赖数组里

```javascript
var mainModule = angular.module('phonecatApp', [
    'ngRoute',
    'phonecatController',
    'phonecatFilters',
    'phonecatServices'
]);
```

控制器controller.js，通过重构掉底层的`$http`服务，把它放在一个新的服务`Phone`中，我们可以大大简化子控制器（`PhoneListCtrl`和`PhoneDetailCtrl`）。AngularJS的`$resource`相比于`$http`更加适合于与RESTful数据源交互。

当调用`Phone`服务的方法是我们并没有传递任何回调函数。尽管这看起来结果是同步返回的，其实根本就不是。被同步返回的是一个future对象（是一个空对象），当XHR相应返回的时候会把数据填入这个空对象。鉴于AngularJS的数据绑定，我们可以使用future并且把它绑定到我们的模板上。然后，当数据到达时，我们的视图会自动更新。

有的时候，单单依赖future对象和数据绑定不足以满足我们的需求，所以在这些情况下，我们需要添加一个回调函数来处理服务器的响应。`PhoneDetailCtrl`控制器通过在一个回调函数中设置`mainImageUrl`就是一个解释

```javascript
var phoneModule = angular.module('phonecatController', []);

// 在控制器中没有注入$http服务，注入了新定义的Phone服务
phoneModule.controller('PhoneListCtrl', ['$scope', 'Phone', function($scope, Phone){
    // 通过Phone.query()获取所有的手机
    $scope.phones = Phone.query();
    $scope.orderProp = 'age';
}]);

phoneModule.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone', function($scope, $routeParams, Phone) {
    $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
        $scope.mainImageUrl = phone.images[0];
    });

    $scope.setImage = function(imageUrl) {
        $scope.mainImageUrl = imageUrl;
    };
}]);
```

`$resource`是怎么工作的?
`$resource`和RESTful API工作. 这意味着你的的URLS应该类似于下面的模式:

URL | HTTP Verb | Request Body | Result
----|-----------|--------------|-------
`/api/entries`|GET|empty|Returns all entries
`/api/entries`|POST|JSON String|Creates new entry
`/api/entries/:id`|GET|empty|Returns single entry
`/api/entries/:id`|PUT|JSON String|Updates existing entry
`/api/entries/:id`|DELETE|empty|Deletes existing entry


`$resource`默认有5个方法:
* `get()`
* `query()`
* `save()`
* `remove()`
* `delete()`

```json
{ 'get':    {method:'GET'},
  'save':   {method:'POST'},
  'query':  {method:'GET', isArray:true},
  'remove': {method:'DELETE'},
  'delete': {method:'DELETE'} };
```


```javascript
phonecatServices.factory('Phone', ['$resource', function($resource) {
    return $resource('phones/:phoneId.json', {}, {
        query: {
            method: 'GET',
            params: {phoneId: 'phones'},
            isArray: true
        }
    });
}]);
```
这里第3个参数中的query对象覆盖了默认的query方法，等价下面

*使用`Phone.query()`调用*

```javascript
phonecatServices.factory('Phone', ['$resource', function($resource) {
    return $resource('phones/phones.json');
}]);
```

或者：

*使用`Phone.get({phoneId: $routeParams.phoneId})`调用*

```javascript
phonecatServices.factory('Phone', ['$resource', function($resource) {
    return $resource('phones/:phoneId.json');
}]);
```

```javascript
phoneModule.controller('PhoneListCtrl', ['$scope', 'Phone', function($scope, Phone){
    // 给query传入参数
    $scope.phones = Phone.query({phoneId: 'phones'});
    $scope.orderProp = 'age';
}]);
```
