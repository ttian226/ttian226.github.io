---
layout:     post
title:      "Angular Directive"
subtitle:   "NG指令"
date:       2016-02-22 12:00:00
author:     "wangxu"
header-img: "img/post-bg-2015.jpg"
tags:
    - Angular
---

#### directive的四种类型

```html
<my-dir></my-dir>   //作为标签名
<span my-dir="exp"></span>  //作为属性名
<!-- directive: my-dir exp -->  //注释
<span class="my-dir: exp;"></span>  //类名
```

**推荐使用标签名和属性名的指令**


#### 模板directive

例子一：使用template定义模板

```html
<body ng-app="docsSimpleDirective">
  <div ng-controller="Controller">
    <div my-customer></div>
  </div>
</body>
```

```javascript
angular.module('docsSimpleDirective', [])
    .controller('Controller', ['$scope', function ($scope) {
      $scope.customer = {
        name: 'Naomi',
        address: '1600 Amphitheatre'
      };
    }])
    .directive('myCustomer', function () {
      return {
        template: 'Name: {{customer.name}} Address: {{customer.address}}'
      };
    });
```

**通常来说如果模板内容比较少的话使用`template`，如果模板内容多则使用`templateUrl`**

[完整代码](http://plnkr.co/edit/CbPuc8oXKufFKN4Zi9KA)


例子二：使用templateUrl定义模板

html同例子一相同。

```javascript
angular.module('docsTemplateUrlDirective', [])
    .controller('Controller', ['$scope', function ($scope) {
      $scope.customer = {
        name: 'Naomi',
        address: '1600 Amphitheatre'
      };
    }])
    .directive('myCustomer', function () {
      return {
        templateUrl: 'my-customer.html'
      };
    });
```

[完整代码](http://plnkr.co/edit/ETxYybPXEL3LhFbKplx9)

例子三：templateUrl是一个函数，函数返回模板的url

```html
<div ng-controller="Controller">
  <div my-customer type="name"></div>
  <div my-customer type="address"></div>
</div>
```

customer-name.html

```html
{% raw %}
Name: {{customer.name}}
{% endraw %}
```

customer-address.html

```html
{% raw %}
Address: {{customer.address}}
{% endraw %}
```

```javascript
angular.module('docsTemplateUrlDirective', [])
    .controller('Controller', ['$scope', function ($scope) {
      $scope.customer = {
        name: 'Naomi',
        address: '1600 Amphitheatre'
      };
    }])
    .directive('myCustomer', function () {
      return {
        templateUrl: function (elem, attr) {
          return 'customer-' + attr.type + '.html';
        }
      };
    });
```

[完整代码](http://plnkr.co/edit/ugLnEP0GQdJgYP7QxIcr)

#### 使用restrict

* 'A'匹配属性名
* 'E'匹配节点名
* 'C'匹配类名
* 'M'匹配注释

例子四：

```html
<div ng-controller="Controller">
  <my-customer></my-customer>
</div>
```

```javascript
angular.module('docsRestrictDirective', [])
    .controller('Controller', ['$scope', function ($scope) {
      $scope.customer = {
        name: 'Naomi',
        address: '1600 Amphitheatre'
      };
    }])
    .directive('myCustomer', function () {
      return {
        restrict: 'E',
        templateUrl: 'my-customer.html'
      };
    });
```

[完整代码](http://plnkr.co/edit/pCKeeCBLBSC1py1Vtu8q)

#### 独立作用域

例子五：使用controller来隔离作用域

```html
<div ng-controller="NaomiController">
  <my-customer></my-customer>
</div>
<hr>
<div ng-controller="IgorController">
  <my-customer></my-customer>
</div>
```

```javascript
angular.module('docsScopeProblemExample', [])
    .controller('NaomiController', ['$scope', function($scope) {
      $scope.customer = {
        name: 'Naomi',
        address: '1600 Amphitheatre'
      };
    }])
    .controller('IgorController', ['$scope', function($scope) {
      $scope.customer = {
        name: 'Igor',
        address: '123 Somewhere'
      };
    }])
    .directive('myCustomer', function () {
      return {
        restrict: 'E',
        templateUrl: 'my-customer.html'
      };
    });
```

[完整代码](http://plnkr.co/edit/4eNIwJ3gVqSSRLN15ENB)


例子六：使用scope option来分离作用域

```html
<div ng-controller="Controller">
  <my-customer info="naomi"></my-customer>
  <hr>
  <my-customer info="igor"></my-customer>
</div>
```

my-customer-iso.html

```html
{% raw %}
Name: {{customerInfo.name}} Address: {{customerInfo.address}}
{% endraw %}
```

```javascript
angular.module('docsIsolateScopeDirective', [])
    .controller('Controller', ['$scope', function($scope) {
      $scope.naomi = {
        name: 'Naomi',
        address: '1600 Amphitheatre'
      };
      $scope.igor = {
        name: 'Igor',
        address: '123 Somewhere'
      };
    }])
    .directive('myCustomer', function() {
      return {
        restrict: 'E',
        scope: {
          customerInfo: '=info'
        },
        templateUrl: 'my-customer-iso.html'
      };
    });
```

[完整代码](http://plnkr.co/edit/IAiH12XlWYofWFvGBJy7)

例子七：

```html
<div ng-controller="Controller">
  <my-customer info="naomi"></my-customer>
</div>
```

my-customer-plus-vojta.html

```html
{% raw %}
Name: {{customerInfo.name}} Address: {{customerInfo.address}}
<hr>
Name: {{vojta.name}} Address: {{vojta.address}}
{% endraw %}
```


```javascript
angular.module('docsIsolationExample', [])
    .controller('Controller', ['$scope', function($scope) {
      $scope.naomi = {
        name: 'Naomi',
        address: '1600 Amphitheatre'
      };
      $scope.vojta = {
        name: 'Vojta',
        address: '3456 Somewhere Else'
      };
    }])
    .directive('myCustomer', function() {
      return {
        restrict: 'E',
        scope: {
          customerInfo: '=info'
        },
        templateUrl: 'my-customer-plus-vojta.html'
      };
    });
```


[完整代码](http://plnkr.co/edit/RVpjpF8DckLPEWXtIse4)

#### 创建一个指令来操作DOM

```html
<div ng-controller="Controller">
  Date format: <input type="text" ng-model="format">
  <hr>
  Current time is: <span my-current-time="format"></span>
</div>
```

```javascript
angular.module('docsTimeDirective', [])
    .controller('Controller', ['$scope', function ($scope) {
      $scope.format = 'M/d/yy h:mm:ss a';
    }])
    .directive('myCurrentTime', ['$interval', 'dateFilter', function ($interval, dateFilter) {
      function link(scope, element, attrs) {
        var
          format,
          timeoutId;

        function updateTime() {
          element.text(dateFilter(new Date(), format));
        }

        // 监听format值的变化,当format有变化时去更新时间
        scope.$watch(attrs.myCurrentTime, function (value) {
          format = value;
          updateTime();
        });

        // 当element元素销毁时,终止$interval防止产生内存泄露
        element.on('$destroy', function () {
          $interval.cancel(timeoutId);
        });

        // 每隔一秒更新一次时间
        timeoutId = $interval(function () {
          updateTime();
        }, 1000);
      }

      return {
        link: link
      };
    }]);
```

[完整代码](http://plnkr.co/edit/6OSFYYyspgY5JNAzaVJz)
