---
layout:     post
title:      "Angular依赖注入"
subtitle:   "依赖注入的实现"
date:       2015-08-07 12:00:00
author:     "wangxu"
header-img: "img/post-bg-2015.jpg"
tags:
    - Angular
---

#### 依赖注入的实现

依赖注入的基本思路。（**依赖**可以理解为资源，模块，方法）

```javascript
// 注入器
var injector = {
    dependencies: {},
    register: function(key, value) {
        this.dependencies[key] = value;
    },
    resolve: function(deps, func, scope) {
        var args = [];
        for (var i = 0; i < deps.length; i++) {
            var d = deps[i];
            if (this.dependencies[d]) {
                args.push(this.dependencies[d]);
            }
        }

        return function() {
            func.apply(scope || {}, args.concat(Array.prototype.slice(arguments)));
        };
    }
};

// 定义模块service
var service = function() {
    return {
        name: 'service'
    };
};

// 定义模块router
var router = function() {
    return {
        name: 'router'
    };
};

// 注册service和router
injector.register('service', service);
injector.register('router', router);

var dosomething = injector.resolve(['service', 'router'], function(service, router, other) {
    // 这里的service，router分别指向两个函数的引用
    var s = service();
    console.log(s.name);
});

dosomething();
```
