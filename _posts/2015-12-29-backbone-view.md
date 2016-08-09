---
layout:     post
title:      "Backbone学习笔记2"
subtitle:   "Backbone Views"
date:       2015-12-29 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - Backbone
    - 翻译
---

### Views

View在Backbone中是不包含任何Html标记的。它包含数据模型表现层的用户业务逻辑。这里通常使用的是javascript模板（例如underscore迷你模板，Mustache，jQuery-tmpl等）。View的`render()`方法可以绑定到Model的`change()`事件上，使View立刻响应模型的变化而不需要整个页面进行刷新。

#### 创建新的视图

和创建Model比，创建一个View更直接简单。创建一个View只是简单的继承`Backbone.View`。我们在之前的章节中介绍过TodoView的例子，下面我们近距离观看下它是如何工作的。

```javascript
var TodoView = Backbone.View.extend({
    tagName: 'li',

    // Cache the template function for a single item.
    todoTpl: _.template('An example template'),

    events: {
        'dblclick label': 'edit',
        'keypress .edit': 'updateOnEnter',
        'blur .edit':   'close'
    },

    initialize: function (options) {
        this.options = options || {};
    },

    // Re-render the title of the todo item.
    render: function () {
        this.$el.html(this.todoTpl(this.model.attributes));
        this.input = this.$('.edit');
        return this;
    },

    edit: function () {
        // executed when todo label is double clicked
    },

    close: function () {
        // executed when todo loses focus
    },

    updateOnEnter: function () {
        // executed on each keypress when in todo edit mode,
        // but we'll wait for enter to get in action
    }
});

var todoView = new TodoView();
console.log(todoView.el);   // <li></li>
```

#### el是什么

视图核心的属性是`el`。什么是`el`，它是如何定义的？

从根本上说`el`是DOM元素的引用，所有的视图都必须拥有一个`el`属性。视图可以使用`el`来组成它们元素的内容，然后立即插入到DOM中去。这样可以使页面进行更快的渲染，因为浏览器执行了最少的重绘。

有两种方法可以使视图与DOM元素关联起来：通过视图创建了一个新的元素随后把这个元素加入到DOM中；使用视图关联一个已经在页面上存在的元素。

如果你想通过视图创建一个新的元素，在视图上设置以下属性的任意组合：`tagName`,`id`,`className`。一个新的元素将被创建。你可以通过`el`属性来引用这个元素。如果未指定`tagName`则默认创建`div`元素。

在上面的例子，`tagName`被设置了`li`，创建一个li元素。下面的例子创建了一个ul元素并带有id和class属性：

```javascript
var TodoView = Backbone.View.extend({
    tagName: 'ul',  // 必须，如果不设置默认div
    className: 'container', // 可选，也可以设置多个class比如'container homepage''
    id: 'todos' // 可选
});

var todosView = new TodoView();
console.log(todosView.el);  // <ul id="todos" class="container"></ul>
```

上面的代码创建了一个DOM元素如下所示，但是还没有添加到文档中。

```html
<ul id="todos" class="container"></ul>
```

如果元素已经存在在页面上，你可以给`el`设置一个匹配这个元素的css选择符。

```javascript
el: '#footer'
```

或者也可以在创建视图时给`el`设置一个存在的元素。

```javascript
var todosView = new TodosView({el: $('#footer')});
```

注意：当声明一个View时，如果你想让`options`，`el`,`tagName`,`id`和`className`等这些属性值在运行时动态计算，它们可以被定义一个函数。

#### $el和$()

视图逻辑通常需要调用jQuery或Zepto中的方法来引用`el`元素和查找子元素。通过定义`$el`属性和`$()`方法，Backbone让这些变的更容易。`view.$el`属性等价于`$(view.el)`，`view.$(selector)`等价于`$(view.el).find(selector)`。在我们TodoView例子的render方法中，我们看到`this.$el`用来设置HTML中的元素，`this.$()`用来查找class名为'edit'的子元素。

#### setElement

如果你想把一个已经存在的视图应用在一个不同的DOM元素上，`setElement`可以达到这个目的。覆盖this.el既需要改变DOM的引用，又要给新元素重新绑定事件（解绑旧元素事件）

`setElement`将会为你创建一个缓存的`$el`引用。把代理事件从旧元素移到新元素上。

```javascript
// 创建了两个按钮
var button1 = $('<button></button>');
var button2 = $('<button></button>');

// 定义了一个新的视图
var View = Backbone.View.extend({
    events: {
        click: function (e) {
            console.log(view.el === e.target);
        }
    }
});

// 创建了一个视图的实例，应用在button1上
var view = new View({el: button1});

// 使用setElement把视图应用在button2上
view.setElement(button2);
button1.trigger('click');
button2.trigger('click'); // return true
```

$el属性表现的是将要在页面上渲染的部分视图。要想获取在页面上渲染的实际视图，你需要作为一个新的元素来添加它，或者把它添加到一个已经存在的元素上。

```javascript
// 我们也可以把html作为setElement的参数来传递
var view = new Backbone.View;
view.setElement('<p><a><b>test</b></a></p>');
console.log(view.$('a b').html()); // outputs "test"
```

#### 理解render()

`render()`是一个可选的方法，它定义了渲染模板的业务逻辑。我们可以使用underscore的模板方法，但是如果你更喜爱其它的模板方法也可以使用。

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title></title>
  <meta name="description" content="">
</head>
<body>
  <div id="todo">
  </div>
  <script type="text/template" id="item-template">
    <div>
      <input id="todo_complete" type="checkbox" <%= completed ? 'checked="checked"' : '' %>>
      <%= title %>
    </div>
  </script>
  <script src="underscore-min.js"></script>
  <script src="backbone-min.js"></script>
  <script src="jquery-min.js"></script>
  <script src="example.js"></script>
</body>
</html>
```

Underscore的`_.template`方法会把javascript模板转换成函数，通过这个函数可以进行动态渲染。在TodoView中，把html模板通过id`item-template`传递给`_.template()`方法进行编译并把结果保存在todoTpl属性中当视图创建的时候。（例如在视图中定义一个属性：`template: _.template($('#item-template').html())`）

`render()`方法使用这个模板函数。模板函数接受Model的`toJSON()`返回的模型属性集合，使之与这个视图进行关联。模板函数会返回根据Model属性和模板标记编译后的html，然后使用$el.html()给视图el元素设置内容。

```javascript
var TodoView = Backbone.View.extend({
    tagName: 'ul',
    template: _.template($('#item-template').html()),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var view = new TodoView({model: todo});
console.log(view.render().el);
```

通常的做法是在`render()`函数的末尾`return this`，它的作用体现在：

* 使视图可以更容易的在其它的父视图中重复使用
* 创建元素的列表时不需要对单独的每个元素进行渲染和绘制，只需要一次渲染整个列表

一个简单的ListView（不是对每一个Item使用一个ItemView）应该这样写：

```javascript
var ListView = Backbone.View.extend({

  // Compile a template for this view. In this case '...'
  // is a placeholder for a template such as 
  // $("#list_template").html() 
  template: _.template(…),

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  }
});
```

足够的简单。让我们假定构建Items使用ItemView的方式来给列表提供增强的行为。我们的ItemView应该如下写：

```javascript
var ItemView = Backbone.View.extend({
  events: {},
  render: function(){
    this.$el.html(this.template(this.model.attributes));
    return this;
  }
});
```

注意`render`结尾的`return this;`。这种普遍的写法可以使我们把当前的视图作为子视图来重用。我们也可以使用它在渲染之前预先渲染。我们对ListView的`render()`方法做如下的改造：

```javascript
var ListView = Backbone.View.extend({
  render: function(){

    // 获取items数据
    var items = this.model.get('items');

    // 使用Undersocre的_.each方法遍历items
    _.each(items, function(item){

      // 传入一个指定的model来创建一个新的ItemView的实例
      var itemView = new ItemView({ model: item });
      
      // itemView的DOM元素在它渲染之后会被添加到当前视图中
      this.$el.append( itemView.render().el );
    }, this);
  }
});
```

#### Event hash

Backbone events允许我们绑定事件监听到与el有关联的自定义选择符上。如果没有提供选择符就直接绑定到el上。event以键值对的形式提供`'eventName selector': 'callbackFunction'`，并支持多种事件类型包括`click`, `submit`, `mouseover`, `dblclick`。

```javascript
// A sample view
var TodoView = Backbone.View.extend({
  tagName:  'li',

  // with an events hash containing DOM events
  // specific to an item:
  events: {
    'click .toggle': 'toggleCompleted',
    'dblclick label': 'edit',
    'keypress .edit': 'updateOnEnter',
    'click .destroy': 'clear',
    'blur .edit': 'close'
  }
});
```

它是基于jQuery的`.delegate()`方法的。唯一要记住的是，在events提供的任何回调字符串，在view的作用域中都必须有一个和它同名的函数。

jQuery的事件委托意味着你不必担心指定的元素是否在页面上。通常使用jQuery你需要随时关注事件绑定的元素是否在页面上。

在我们的TodoView的例子中，`edit`回调函数是当用户双击el下面的label元素时触发的。`updateOnEnter`被调用是在用户按下(keypress)每一个class为edit的元素是产生的。`close`是当class为edit元素失去焦点时触发。每一个回调函数都能够使用`this`来引用TodoView对象。

注意，你也可以使用`_.bind(this.viewEvent, this)`来绑定事件。下面我们使用`_.bind()`重绘我们的视图当模型改变的时候：

```javascript
var TodoView = Backbone.View.extend({
  initialize: function() {
    this.model.bind('change', _.bind(this.render, this));
  }
});
```
