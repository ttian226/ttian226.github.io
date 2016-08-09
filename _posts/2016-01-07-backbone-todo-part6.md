---
layout:     post
title:      "Backbone Todos的实现6"
subtitle:   "独立的Todo视图"
date:       2016-01-07 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - Backbone
    - 翻译
---

### Individual Todo View

现在让我们看下TodoView，它将负责单独的todo记录，当todo有变化时要确保视图及时更新。为了达到这种功能，我们需要给视图添加事件监听todo的变化。

```javascript
// js/views/todos.js

  var app = app || {};

  // Todo Item View
  // --------------

  // The DOM element for a todo item...
  app.TodoView = Backbone.View.extend({

    //... is a list tag.
    tagName: 'li',

    // Cache the template function for a single item.
    template: _.template( $('#item-template').html() ),

    // The DOM events specific to an item.
    events: {
      'dblclick label': 'edit',
      'keypress .edit': 'updateOnEnter',
      'blur .edit': 'close'
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    // Re-renders the titles of the todo item.
    render: function() {
      this.$el.html( this.template( this.model.attributes ) );
      this.$input = this.$('.edit');
      return this;
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      this.$el.addClass('editing');
      this.$input.focus();
    },

    // Close the `"editing"` mode, saving changes to the todo.
    close: function() {
      var value = this.$input.val().trim();

      if ( value ) {
        this.model.save({ title: value });
      }

      this.$el.removeClass('editing');
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function( e ) {
      if ( e.which === ENTER_KEY ) {
        this.close();
      }
    }
  });
```

在`initialize()`方法中，我们设置了一个监听器来监听一个todo模型的`change`事件。结果是当这个todo有更新的时候，应用会重绘这个视图来直观反应它的变化。注意这个模型`this.model`对我们来说是可用的，它是在AppView中通过实例化TodoView时通过参数传递过来的。

在`render()`方法中，我们渲染#item-template模板，在之前通过underscore的`_.template()`方法它被编译成this.template。它返回了一个html片段替换了视图中`<li>`元素内部的内容（它是基于`tagName`属性隐式创建的一个li元素）。换句话说，这个渲染后的模板是在`this.el`内部，它（li元素）可以被添加到用户界面的todo列表中去。`render()`方法在最后基于已实例化的模板缓存了input元素（`this.$input`）。

我们的事件包含了3个回调函数：

* `edit()`：当用户在todo列表中双击一个已存在的项时，改变当前的视图为编辑状态。这允许我们去改变已经存在的值（title属性）
* `updateOnEnter()`：检查用户是否敲击了回车键，然后执行close()方法。
* `close()`：去除我们`<input/>`中两端的空格，确保我们不会输入空串。如果提供了一个有效值，我们改变当前的todo模型并通过移出关联的CSS类来关闭编辑模式
