---
layout:     post
title:      "Backbone的Todos的实现8"
subtitle:   "完成和删除todos"
date:       2016-01-13 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - Backbone
    - 翻译
---

### Completing & deleting todos

接下来的部分就是处理完成和删除的todos，这两个动作都是针对每一个todo的，所以我们把这两个功能放在Todoview的视图中，我们把togglecompleted和clear方法放在events哈希表中。

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
      'click .toggle': 'togglecompleted', // NEW
      'dblclick label': 'edit',
      'click .destroy': 'clear',           // NEW
      'keypress .edit': 'updateOnEnter',
      'blur .edit': 'close'
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);        // NEW
      this.listenTo(this.model, 'visible', this.toggleVisible); // NEW
    },

    // Re-render the titles of the todo item.
    render: function() {
      this.$el.html( this.template( this.model.attributes ) );

      this.$el.toggleClass( 'completed', this.model.get('completed') ); // NEW
      this.toggleVisible();                                             // NEW

      this.$input = this.$('.edit');
      return this;
    },

    // NEW - Toggles visibility of item
    toggleVisible : function () {
      this.$el.toggleClass( 'hidden',  this.isHidden());
    },

    // NEW - Determines if item should be hidden
    isHidden : function () {
      var isCompleted = this.model.get('completed');
      return ( // hidden cases only
        (!isCompleted && app.TodoFilter === 'completed')
        || (isCompleted && app.TodoFilter === 'active')
      );
    },

    // NEW - Toggle the `"completed"` state of the model.
    togglecompleted: function() {
      this.model.toggle();
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
      } else {
        this.clear(); // NEW
      }

      this.$el.removeClass('editing');
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function( e ) {
      if ( e.which === ENTER_KEY ) {
        this.close();
      }
    },

    // NEW - Remove the item, destroy the model from *localStorage* and delete its view.
    clear: function() {
      this.model.destroy();
    }
  });
```

关键的两个方法就是我们添加的两个事件句柄，一个是在todo的checkbox上绑定的togglecompleted方法，和一个点击`<button class="destroy" />`按钮的方法。

让我们看下当我们点击todo的checkbox时发生的事件：

1. togglecompleted调用的是todo model里的toggle方法。
2. toggle方法切换todo的completed状态，调用model的save方法。
3. save方法会触发model的change事件，它绑定到TodoView的render()方法上。我们在render()中添加了一行语句根据model的完成状态来给元素添加completed class。当todo是完成状态时，关联的css将改变title文本的颜色并加上横线
4. save方法也会触发model的change:completed事件，它是绑定在AppView中的filterOne方法，如果我们回头看看AppView，我们看到filterOne方法会触发model的visible事件。它是用来连接我们router的过滤器和Collection的。在我们更新TodoView时，我们绑定model的visible事件到toggleVisible方法上。这个方法使用新的isHidden方法来决定当前的节点是否可见。

现在，当我们点击todo的删除按钮时发生了什么:

1. clear方法调用了model的destroy方法。
2. 这个todo会从本地存储中删除，并触发了一个destroy事件
3. 在我们更新TodoView时，我们绑定了model的destroy事件到view的remove方法。这个方法会删除这个视图，并自动从DOM中删除关联的元素。
4. destroy方法同样会从Todos collection删除这个model，它会触发collection的remove事件
5. 因为AppView拥有了绑定到集合上all事件的render方法，app视图会被渲染并更新footer
