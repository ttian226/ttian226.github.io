---
layout:     post
title:      "Angular Promise"
subtitle:   "NG Promise"
date:       2016-02-17 12:00:00
author:     "wangxu"
header-img: "img/post-bg-2015.jpg"
tags:
    - Angular
---

#### 一个简单的promise例子

```javascript
var myModule = angular.module('app', []);
  
  // 通过工厂方法来创建getDataService服务，注入$q,$timeout系统服务
  myModule.factory('getDataService', ['$q', '$timeout', function ($q, $timeout) {
    return function () {

      // 通过$q来创建defer对象
      var defer = $q.defer();

      // 使用$timeout模拟异步方法
      $timeout(function () {
        console.log('ok');
      }, 1000);

      // 返回promise对象
      return defer.promise;
    };
  }]);
  
  // 注入刚创建的服务getDataService
  myModule.run(['getDataService', function (getDataSer) {
    getDataSer();
  }]);
```

[完整代码](http://plnkr.co/edit/6d2qro2LRjIvrkRPf95B)

#### 使用resolve()

```javascript
var myModule = angular.module('app', []);
  
  myModule.factory('getData', ['$q', '$timeout', function ($q, $timeout) {
    return function () {
      var defer = $q.defer();
      $timeout(function () {
        defer.resolve('data received!');
      }, 1000);
      return defer.promise;
    };
  }]);
  
  myModule.run(['getData', function (getData) {
    var promise = getData();
    promise.then(function (str) {
      console.log(str);
    });
  }]);
```

[完整代码](http://plnkr.co/edit/xCi03kjkRhcX3vkLZiA8)

#### resolve和reject

```javascript
var myModule = angular.module('app', []);
  
  myModule.factory('getData', ['$q', '$timeout', function ($q, $timeout) {
    return function () {
      var defer = $q.defer();
      $timeout(function () {
        if(Math.round(Math.random())) {
          defer.resolve('data received!')
        } else {
          defer.reject('oh no an error! try again')
        }
      }, 1000);
      return defer.promise;
    };
  }]);
  
  myModule.run(['getData', function (getData) {
    var promise = getData();
    promise.then(function (str) {
      console.log(str);
    }, function (err) {
      console.error(err);
    });
  }]);
```

[完整代码](http://plnkr.co/edit/Zyt21gK1FSST6d1aMP2n)

#### 使用$q构造函数

```javascript
var myModule = angular.module('app', []);
  
  myModule.factory('getData', ['$q', '$timeout', function ($q, $timeout) {
    return function () {
      return $q(function (resolve, reject) {
        $timeout(function () {
          if (Math.round(Math.random())) {
            resolve('data received!');
          } else {
            reject('oh no an error! try again');
          }
        }, 1000);
      });
    };
  }]);
```

[完整代码](http://plnkr.co/edit/Lcd1GaWkJHXejudoNCwl)
