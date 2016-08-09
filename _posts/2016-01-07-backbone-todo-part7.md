---
layout:     post
title:      "Backbone的Todos的实现7"
subtitle:   "startup"
date:       2016-01-07 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - Backbone
    - 翻译
---

### Startup

现在我们有了两个视图：AppView和TodoView，前者需要在页面加载时就实例化以便代码可以执行。这个可以通过jQuery的ready方法来实现，它将在DOM加载后执行。

```javascript
// js/app.js

  var app = app || {};
  var ENTER_KEY = 13;

  $(function() {

    // Kick things off by creating the **App**.
    new app.AppView();

  });
```
