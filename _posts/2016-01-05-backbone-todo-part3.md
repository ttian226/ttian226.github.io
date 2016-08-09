---
layout:     post
title:      "Backbone Todos的实现3"
subtitle:   "Todo模型"
date:       2016-01-05 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - Backbone
    - 翻译
---

### Todo model

Todo模型是非常简单的。首先一个todo有两个属性：`title`存储了todo的标题，`completed`指示它是否完成的状态。在defaults中初始化了这两个属性，看下面的例子：

```javascript
// js/models/todo.js

  var app = app || {};

  // Todo Model
  // ----------
  // Our basic **Todo** model has `title` and `completed` attributes.

  app.Todo = Backbone.Model.extend({

    // Default attributes ensure that each todo created has `title` and `completed` keys.
    defaults: {
      title: '',
      completed: false
    },

    // Toggle the `completed` state of this todo item.
    toggle: function() {
      this.save({
        completed: !this.get('completed')
      });
    }

  });
```

第二，Todo模型有一个`toggle()`方法，通过它一个todo项的完成状态可以被设置并被保存。
