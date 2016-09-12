---
layout:     post
title:      "Angular Filter"
subtitle:   "NG过滤器"
date:       2016-02-18 12:00:00
author:     "wangxu"
header-img: "img/post-bg-2015.jpg"
tags:
    - Angular
---

#### 过滤ngRepeat的列表

```html
{% raw %}
<body ng-app="app" ng-controller="TestCtrl as test">
  <input type="text" ng-model="search">
  <p ng-repeat="person in test.people | filter:search">
    {{person.name}}
  </p>
</body>
{% endraw %}
```

```javascript
angular.module('app', [])
    .controller('TestCtrl', function () {
      var self = this;
      self.people = [
        {
          name: "Eric Simons",
          born: "Chicago"
        },
        {
          name: "Albert Pai",
          born: "Taiwan"
        },
        {
          name: "Matthew Greenster",
          born: "Virginia"
        }
      ];
    });
```

[完整代码](http://plnkr.co/edit/SLJIvKxek9fvZiHdTGtx)

只过滤name:

```html
<input type="text" ng-model="search.name">
```

过滤所有字段（name和born）:

```html
<input type="text" ng-model="search.$" />
```

#### 自定义过滤器

```html
{% raw %}
<body ng-app="app" ng-controller="TestCtrl as test">
  <input type="text" ng-model="test.myString">
  <h2>
    {{test.myString | capitalize}}
  </h2>
</body>
{% endraw %}
```

```javascript
angular.module('app', [])
    .controller('TestCtrl', function () {
      var self = this;
      self.myString = 'hello world';
    })
    .filter('capitalize', function () {
      return function (text) {
        return text.toUpperCase();
      };
    });
```

[完整代码](http://plnkr.co/edit/YSTV6CtSkn8xYEq8LwP2)

#### orderBy

`<p ng-repeat="person in test.people | orderBy:'name'">`

#### limitTo

`<p ng-repeat="person in test.people | limitTo:5">`

#### 链式过滤器

`<p ng-repeat="person in test.people | filter:search | orderBy:'name'  | limitTo: 5">`


#### 注入<filterName>Filter到控制器

```html
{% raw %}
<div ng-controller="FilterController as ctrl">
  <div>
    All entries:
    <span ng-repeat="entry in ctrl.array">{{entry.name}} </span>
  </div>
  <div>
    Entries that contain an "a":
    <span ng-repeat="entry in ctrl.filteredArray">{{entry.name}} </span>
  </div>
</div>
{% endraw %}
```

```javascript
angular.module('FilterInControllerModule', [])
    .controller('FilterController', ['filterFilter', function (filterFilter) {
      this.array = [
        {name: 'Tobias'},
        {name: 'Jeff'},
        {name: 'Brian'},
        {name: 'Igor'},
        {name: 'James'},
        {name: 'Brad'}
      ];
      
      this.filteredArray = filterFilter(this.array, 'a');
    }]);
```

[完整代码](http://plnkr.co/edit/EaLRlTuZguSzJBS22aCY)

也可以通过模板进行过滤，如下：

```html
{% raw %}
<span ng-repeat="entry in ctrl.array | filter: 'a'">{{entry.name}} </span>
{% endraw %}
```

[完整代码](http://plnkr.co/edit/uWeJV7HeDLfLxHuFDcxm)

使用这种方式，由于是全文本查找，如果数组较大的话代价会很高。而把过滤器注入到controller中，会事先过滤匹配的项。

