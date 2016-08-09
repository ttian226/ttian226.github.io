---
layout:     post
title:      "Backbone Todos的实现9"
subtitle:   "todos的路由"
date:       2016-01-13 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - Backbone
    - 翻译
---

### Todo routing

最后，我们看下路由。它允许我们很轻松的过滤那些正在进行的或者已经完成的项。我们支持下面的路由

```
#/ (all - default)
#/active
#/completed
```

![route](https://addyosmani.com/backbone-fundamentals/img/todos_e.png)

当路由改变的时候，像上图一样，todo列表将在model层进行过滤，在footer的过滤链接上将会切换selected样式。当一个项更新的时候过滤的内容也会相应的更新（例如当前过滤器为active时，选择了一个todo，那么这个todo会被隐藏）

```javascript
// js/routers/router.js

  // Todo Router
  // ----------

  var app = app || {};

  var Workspace = Backbone.Router.extend({
    routes:{
      '*filter': 'setFilter'
    },

    setFilter: function( param ) {
      // Set the current filter to be used
      if (param) {
        param = param.trim();
      }
      app.TodoFilter = param || '';

      // Trigger a collection filter event, causing hiding/unhiding
      // of Todo view items
      app.Todos.trigger('filter');
    }
  });

  app.TodoRouter = new Workspace();
  Backbone.history.start();
```

我们的过滤器使用`*通配符`来设置一个默认的路由。它在URL'#/'的后面传递一个字符串。setFilter()来给app.TodoFilter设置这个字符串。正像我们看到的`app.Todos.trigger('filter')`，一旦新的路由被设置，我们只是简单的触发collection的filter事件，来显示或隐藏todo项。绑定在了collection的filter事件上的filterAll()被调用，在collection上的任何事件都可以导致AppView重绘。

最后我们创建了路由的实例，并调用了`Backbone.history.start()`当页面加载的时候去路由初始的URL。
