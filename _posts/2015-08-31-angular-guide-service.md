---
layout:     post
title:      "Angular Service"
subtitle:   "NG服务"
date:       2015-08-31 12:00:00
author:     "wangxu"
header-img: "img/post-bg-2015.jpg"
tags:
    - Angular
    - 翻译
---

#### Service

你可以通过services去组织和分享code在你的app中。

Angular服务：

    1. 惰性实例化，angular服务只是当应用程序组件需要依赖的时候初始化services
    2. 单例，每个组件都依赖一个服务，这个服务引用至由服务工厂创建的单例。

Angular提供了一些有用的服务（内置服务一般都是`$`开头），例如`$http`。但是大多数的应用需要你自己来创建服务。

#### 使用service

```html
<div id="simple" ng-controller="MyController">
    <p>Let's try this simple notify service, injected into the controller...</p>
    <input ng-model="message" >
    <button ng-click="callNotify(message);">NOTIFY</button>
    <p>(you have to click 3 times to see an alert)</p>
</div>
```

```javascript
var myApp = angular.module('myApp',[]);

// controller依赖自定义服务notify
myApp.controller('MyController', ['$scope', 'notify', function($scope, notify) {
    $scope.message = 'test';
    $scope.callNotify = function(msg) {
        notify(msg);
    };
}]);

// 由工厂创建服务notify
myApp.factory('notify', ['$window', function(win) {
    var msgs = [];
    // notify服务返回一个匿名函数的引用
    return function(msg) {
        msgs.push(msg);
        if (msgs.length == 3) {
            win.alert(msgs.join("\n"));
            msgs = [];
        }
    };
}]);
```

#### 创建一个服务

开发者可以自由的定义他们自己的服务，通过模块提供的工厂函数，并注册一个新的服务名。

服务工厂函数返回一个单一的对象或方法给其它的应用提供服务。服务返回的对象或方法可以注入到任意的需要依赖它的组件中，如：控制器，服务，过滤器，指令等。

##### 注册一个服务

通常来说，服务是通过modoule提供的方法`factory()`来注册的

```javascript
var myModule = angular.module('myModule', []);
myModule.factory('serviceId', function() {
  var shinyNewServiceInstance;
  // factory function body that constructs shinyNewServiceInstance
  return shinyNewServiceInstance;
});
```
注意：只有服务被调用时，这个服务的实例才被注册。

##### 依赖

服务可以有自己的依赖，就像在controller声明依赖一样，你也可以在factory方法里声明服务的依赖。

下面的例子包含了两个服务，每一个都有不同的依赖：

```javascript
var batchModule = angular.module('batchModule', []);

batchModule.factory('batchLog', ['$interval', '$log', function($interval, $log) {
  var messageQueue = [];

  function log() {
    if (messageQueue.length) {
      $log.log('batchLog messages: ', messageQueue);
      messageQueue = [];
    }
  }

  $interval(log, 50000);

  return function(message) {
    messageQueue.push(message);
  }
}]);

batchModule.factory('routeTemplateMonitor', ['$route', 'batchLog', '$rootScope',
  function($route, batchLog, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function() {
      batchLog($route.current ? $route.current.template : null);
    });
  }]);
```

在这个例子中：

    1. batchLog服务依赖了两个内置服务$interval和$log
    2. routeTemplateMonitor服务依赖了一个内置服务$route和一个自定义服务batchLog
    3. 这两个服务都使用数组表示法声明了他们的依赖。

##### 通过$provide来注册服务

也可以通过moudole的`config`方法使用`$provide`来注册一个服务。

```javascript
angular.module('myModule', []).config(['$provide', function($provide) {
  $provide.factory('serviceId', function() {
    var shinyNewServiceInstance;
    // factory function body that constructs shinyNewServiceInstance
    return shinyNewServiceInstance;
  });
}]);
```

上面的第一个例子可以这样写：

```javascript
var myApp = angular.module('myApp',[]);

myApp.config(['$provide', function($provide) {
    $provide.factory('notify', ['$window', function(win) {
        var msgs = [];
        // notify服务返回一个匿名函数的引用
        return function(msg) {
            msgs.push(msg);
            if (msgs.length == 3) {
                win.alert(msgs.join("\n"));
                msgs = [];
            }
        };
    }]);
}]);

myApp.controller('MyController', ['$scope', 'notify', function($scope, notify) {
    $scope.message = 'test';
    $scope.callNotify = function(msg) {
        notify(msg);
    };
}]);
```


