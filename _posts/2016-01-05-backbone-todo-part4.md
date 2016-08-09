---
layout:     post
title:      "Backbone的Todos的实现4"
subtitle:   "Todo集合"
date:       2016-01-05 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - Backbone
    - 翻译
---

### Todo collection

接下来TodoList集合用来分组我们的models。这个集合使用了LocalStorage覆盖了Backbone默认的`sync()`操作，通过它我们可以保存Todo数据到HTML5的本地存储中。通过本地存储这些数据可以在页面间进行请求。

```javascript
// js/collections/todos.js

  var app = app || {};

  // Todo Collection
  // ---------------

  // The collection of todos is backed by *localStorage* instead of a remote
  // server.
  var TodoList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: app.Todo,

    // Save all of the todo items under the `"todos-backbone"` namespace.
    localStorage: new Backbone.LocalStorage('todos-backbone'),

    // Filter down the list of all todo items that are finished.
    completed: function() {
      return this.filter(function( todo ) {
        return todo.get('completed');
      });
    },

    // Filter down the list to only todo items that are still not finished.
    remaining: function() {
      return this.without.apply( this, this.completed() );
    },

    // We keep the Todos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
      if ( !this.length ) {
        return 1;
      }
      return this.last().get('order') + 1;
    },

    // Todos are sorted by their original insertion order.
    comparator: function( todo ) {
      return todo.get('order');
    }
  });

  // Create our global collection of **Todos**.
  app.Todos = new TodoList();
```

集合的`completed()`和`remaining()`分别返回一个数组，表示已完成的todos和未完成的todos。

`nextOrder()`方法实现了一个序列化的生成器。而`comparator()`方法根据它们插入时的order来排序。（这两个方法暂时还不理解，稍后修改）

*注意：* `this.filter`, `this.without`和`this.last`方法都是Underscore中的方法，被集成在了Backbone.Collection中。读者可以去查阅关于它们更多的东西。

