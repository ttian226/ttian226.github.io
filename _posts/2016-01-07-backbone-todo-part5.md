---
layout:     post
title:      "Backbone Todos的实现5"
subtitle:   "Todo视图"
date:       2016-01-07 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - Backbone
    - 翻译
---

### Application view

让我们检查下在视图中的核心应用的逻辑。例如每一个视图都支持在当前的位置进行编辑这种功能，因此包含了一些合理的逻辑。为了帮助组织这种逻辑，我们将使用元素控制模式（element controller pattern）。这种元素控制模式包含了两个视图：一个视图控制todo的集合，而另一个视图处理独立的todo项。

在我们的例子中，一个`AppView`将创建一个新的todos，渲染初始的todo列表。`TodoView`的实例将关联每一个独立的Todo。Todo实例能够处理编辑，更新，和销毁与它关联的todo。

为了保持简短和简单，在向导中我们没有实现应用的所有特性，我们只是覆盖了那些能让你起步的东西，即使这样，在`AppView`中仍然有很多东西，所以我们来分两部分讨论。

```javascript

  // js/views/app.js

  var app = app || {};

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  app.AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: '#todoapp',

    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template( $('#stats-template').html() ),

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed.
    initialize: function() {
      this.allCheckbox = this.$('#toggle-all')[0];
      this.$input = this.$('#new-todo');
      this.$footer = this.$('#footer');
      this.$main = this.$('#main');

      this.listenTo(app.Todos, 'add', this.addOne);
      this.listenTo(app.Todos, 'reset', this.addAll);
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function( todo ) {
      var view = new app.TodoView({ model: todo });
      $('#todo-list').append( view.render().el );
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
      this.$('#todo-list').html('');
      app.Todos.each(this.addOne, this);
    }

  });
```

我们AppView的初始版本中呈现了一些明显的特性，包括一个`statsTemplate`，一个`initialize`方法当实例化时被隐式的调用，还有一些视图中特定的方法。

在我们的应用中，`el`属性存储了一个选择符，它指向了ID为`todoapp`的DOM元素。在index.html中`el`引用的是`<section id="todoapp" />`元素。

使用我们的#stats-template，通过underscore中的模板方法`_.template()`来创建一个statsTemplate对象。稍后我们将使用这个模板来渲染视图。

现在我们看一下`initialize`方法。首先，它使用jQuery来缓存元素，它使用本地（Backbone）的属性来调用（相比`this.$el`引用的当前元素的jQuery对象来说，`this.$()`是通过find方法来查找元素）。然后给Todos集合绑定了两个事件：`add`和`reset`。由于我们委托`TodoView`来处理更新和删除，我们这里不用担心。两个逻辑如下：

* 当集合的add事件触发时，`addOne()`方法会被调用，并且被传入了一个新的model。`addOne()`方法创建一个TodoView视图的实例，并渲染，然后把渲染后的元素插入到todo列表中。
* 当集合的reset事件触发时（例如，当Todos由本地存储加载于此同时一次性更新集合）`addAll()`方法被调用，它将遍历当前在集合中所有的todos，并对每一项调用`addOne()`方法。

注意我们能够在`addAll()`方法中使用`this`来引用视图。因为当`addAll()`方法被绑定的时候，listenTo()隐式的设置了回调函数的上下文。

现在我们添加一些更多的逻辑来完成我们的AppView！

```javascript
// js/views/app.js

  var app = app || {};

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  app.AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: '#todoapp',

    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template( $('#stats-template').html() ),

    // New
    // Delegated events for creating new items, and clearing completed ones.
    events: {
      'keypress #new-todo': 'createOnEnter',
      'click #clear-completed': 'clearCompleted',
      'click #toggle-all': 'toggleAllComplete'
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
      this.allCheckbox = this.$('#toggle-all')[0];
      this.$input = this.$('#new-todo');
      this.$footer = this.$('#footer');
      this.$main = this.$('#main');

      this.listenTo(app.Todos, 'add', this.addOne);
      this.listenTo(app.Todos, 'reset', this.addAll);

      // New
      this.listenTo(app.Todos, 'change:completed', this.filterOne);
      this.listenTo(app.Todos,'filter', this.filterAll);
      this.listenTo(app.Todos, 'all', this.render);

      app.Todos.fetch();
    },

    // New
    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      var completed = app.Todos.completed().length;
      var remaining = app.Todos.remaining().length;

      if ( app.Todos.length ) {
        this.$main.show();
        this.$footer.show();

        this.$footer.html(this.statsTemplate({
          completed: completed,
          remaining: remaining
        }));

        this.$('#filters li a')
          .removeClass('selected')
          .filter('[href="#/' + ( app.TodoFilter || '' ) + '"]')
          .addClass('selected');
      } else {
        this.$main.hide();
        this.$footer.hide();
      }

      this.allCheckbox.checked = !remaining;
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function( todo ) {
      var view = new app.TodoView({ model: todo });
      $('#todo-list').append( view.render().el );
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
      this.$('#todo-list').html('');
      app.Todos.each(this.addOne, this);
    },

    // New
    filterOne : function (todo) {
      todo.trigger('visible');
    },

    // New
    filterAll : function () {
      app.Todos.each(this.filterOne, this);
    },


    // New
    // Generate the attributes for a new Todo item.
    newAttributes: function() {
      return {
        title: this.$input.val().trim(),
        order: app.Todos.nextOrder(),
        completed: false
      };
    },

    // New
    // If you hit return in the main input field, create new Todo model,
    // persisting it to localStorage.
    createOnEnter: function( event ) {
      if ( event.which !== ENTER_KEY || !this.$input.val().trim() ) {
        return;
      }

      app.Todos.create( this.newAttributes() );
      this.$input.val('');
    },

    // New
    // Clear all completed todo items, destroying their models.
    clearCompleted: function() {
      _.invoke(app.Todos.completed(), 'destroy');
      return false;
    },

    // New
    toggleAllComplete: function() {
      var completed = this.allCheckbox.checked;

      app.Todos.each(function( todo ) {
        todo.save({
          'completed': completed
        });
      });
    }
  });
```

我们已经添加了逻辑来创建新的todos，对它们进行编辑，基于它们的完成状态进行过滤。

* events：我们定义了events对象，它包含了已经声明的回调函数，这些回调函数用来处理DOM事件。这些事件绑定了下面这些方法：
* `createOnEnter()`：当用户在`<input/>`中敲击回车键时创建一个新的model，并把它保存到localStorage中。并重置`<input/>`中的值以便下次输入。model通过newAttributes()方法来填充。它返回了一个对象包含了标题，序号，和新创建项的完成状态。注意回调中的`this`引用的是view对象而不是DOM对象，因为回调函数是通过events哈希表来绑定的。
* `clearCompleted()`：当用户点击clear-completed按钮时，删除todo列表中标记已经完成的项（这个按钮位于footer里，它是通过模板#stats-template填充的）
* `toggleAllComplete()`：允许用户通过点击toggle-all复选框把todo列表中的所有项标记为完成状态。
* `initialize()`：我们给一些额外的事件来绑定回调函数。
* 我们给Todo集合的`change:completed`事件绑定了一个回调函数`filterOne()`。它会监听集合上任何一个model上completed标记的改变。发生变化的todo被传入到回调函数中，这个model会触发了一个自定义的事件`visible`。
* 我们给`filter`自定义事件绑定`filterAll()`函数，它和addOne()和addAll()有些相似。它负责当用户在UI中选择过滤项时（如all,completed或remaining）通过调用`filterOne()`函数去切换哪些todo是可见的。
* 我们使用特定的`all`事件来绑定在Todos集合上触发的任何一个事件，对应的回调函数为视图中的render方法。（下面讨论）

`initialize()`方法是通过获取之前保存在本地存储上的todos来完成的。

* `render()`：有一些事件是发生在我们的render()方法中的：
* #main和#footer片段的显示或隐藏是依赖于在集合中是否有todos。
* 根据已完成或正在进行中todos的数量来实例化statsTemplate模板，并把内容填充到footer中。
* 通过之前的步骤来生成的HTML包含一组过滤链接。`app.TodoFilter`的值是由我们的router来设置的。它被用作把"selected"类添加到与当前选择的过滤器关联链接上，导致CSS样式会在这个过滤链接上生效。
* 根据是否有正在进行的todos, allCheckbox会被更新。
