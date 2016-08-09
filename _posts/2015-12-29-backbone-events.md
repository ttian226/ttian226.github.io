---
layout:     post
title:      "Backbone学习笔记5"
subtitle:   "Backbone Event"
date:       2015-12-29 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - Backbone
    - 翻译
---

### Events

事件本质上是控制的倒置。它不是一个函数通过名字直接调用另一个函数，而是第二个函数被注册为一个句柄当特定的事件发生时被调用。

你的部分应用应该知道如何去调用另一部分被倒置的应用。这是一个核心的事情，它使你的业务逻辑没有必要知道用户界面如何工作的，它是Backbone Events系统最强大的功能。

操作事件是Backbone提高生产效率最快速的方法之一。让我们仔细看下Backbone的事件系统。

`Backbone.Events`被混入了Backbone中其它的类，包括：

* Backbone
* Backbone.Model
* Backbone.Collection
* Backbone.Router
* Backbone.History
* Backbone.View

注意到`Backbone.Events`被混入到了`Backbone`对象中。因为`Backbone`是全局可见的，它能够被用来处理简单的事件

```javascript
Backbone.on('event', function () {
    console.log('Handled Backbone event');
});

Backbone.trigger('event');
```

#### on(),off(),trigger()

`Backbone.Events`能够给与任何对象绑定事件和触发自定义事件的能力。我们可以很容易的把这个模块混入到任何一个对象中，对于事件来说也并没有需求一定要在注册回调之前声明。

```javascript
var ourObject = {};

// 混入
_.extend(ourObject, Backbone.Events);

// 添加自定义事件
ourObject.on('dance', function(msg){
  console.log('We triggered ' + msg);
});

// 触发自定义事件
ourObject.trigger('dance', 'our event');
```

如果你熟悉jQuery自定义事件或者发布/订阅模式的概念，`Backbone.Events`提供了这样一种事件系统：`on`类似于订阅，`trigger`类似于发布。

`on`给一个对象绑定了一个回调函数，像上面的例子我们使用的`dance`。当任何时候`dance`事件被触发时回调函数会被调用。

官方的Backbone.js文档推荐使用冒号作为事件命名空间的分隔符，例如：

```javascript
var ourObject = {};

// 混入
_.extend(ourObject, Backbone.Events);

function dancing (msg) { console.log("We started " + msg); }

// 添加带命名空间的自定义事件
ourObject.on("dance:tap", dancing);
ourObject.on("dance:break", dancing);

// 触发自定义事件
ourObject.trigger("dance:tap", "tap dancing. Yeah!");
ourObject.trigger("dance:break", "break dancing. Yeah!");

// 由于没有对应事件的监听，所以不会触发任何事件
ourObject.trigger("dance", "break dancing. Yeah!");
```

`all`是一个特殊的事件，你可以用它来监听发生在一个对象上的每一个事件。`all`可以像下面这样使用：

```javascript
var ourObject = {};

// Mixin
_.extend(ourObject, Backbone.Events);

ourObject.on("all", function(eventName){
  console.log("The name of the event passed was " + eventName);
});

// This time each event will be caught with a catch 'all' event listener
ourObject.trigger("dance:tap", "tap dancing. Yeah!");
ourObject.trigger("dance:break", "break dancing. Yeah!");
ourObject.trigger("dance", "break dancing. Yeah!");
```

`off`可以移除之前绑定到一个对象上的回调函数。比较一下之前的发布/订阅模式，可以把它看做取消订阅自定义事件。

移除我们之前绑定在`ourObject`对象上的`dance`事件，我们可以这样做：

```javascript
var ourObject = {};

// Mixin
_.extend(ourObject, Backbone.Events);

function dancing (msg) { console.log("We " + msg); }

// Add namespaced custom events
ourObject.on("dance:tap", dancing);
ourObject.on("dance:break", dancing);

// Trigger the custom events. Each will be caught and acted upon.
ourObject.trigger("dance:tap", "started tap dancing. Yeah!");
ourObject.trigger("dance:break", "started break dancing. Yeah!");

// Removes event bound to the object
ourObject.off("dance:tap");

// Trigger the custom events again, but one is logged.
ourObject.trigger("dance:tap", "stopped tap dancing."); // won't be logged as it's not listened for
ourObject.trigger("dance:break", "break dancing. Yeah!");
```

移除指定事件的所有回调函数时，我们可以通过传递了一个事件名（如'move'）给`off()`方法，在已经绑定了这个事件的对象上。如果我们想删除一个指定的回调函数时，我们可以传递callback作为第二个参数。

```javascript
var ourObject = {};

// Mixin
_.extend(ourObject, Backbone.Events);

function dancing (msg) { console.log("We are dancing. " + msg); }
function jumping (msg) { console.log("We are jumping. " + msg); }

// Add two listeners to the same event
ourObject.on("move", dancing);
ourObject.on("move", jumping);

// Trigger the events. Both listeners are called.
ourObject.trigger("move", "Yeah!");

// Removes specified listener
ourObject.off("move", dancing);

// Trigger the events again. One listener left.
ourObject.trigger("move", "Yeah, jump, jump!");
```

最后，正如我们在之前的例子中看到的，`trigger`为指定的事件触发一个回调（也可以是用空格分隔的事件的列表），例如：

```javascript
var ourObject = {};

// Mixin
_.extend(ourObject, Backbone.Events);

function doAction (msg) { console.log("We are " + msg); }

// Add event listeners
ourObject.on("dance", doAction);
ourObject.on("jump", doAction);
ourObject.on("skip", doAction);

// Single event
ourObject.trigger("dance", 'just dancing.');

// Multiple events
ourObject.trigger("dance jump skip", 'very tired from so much action.');
```

`trigger`可以传递多个参数给回调函数

```javascript
var ourObject = {};

// Mixin
_.extend(ourObject, Backbone.Events);

function doAction (action, duration) {
  console.log("We are " + action + ' for ' + duration ); 
}

// Add event listeners
ourObject.on("dance", doAction);
ourObject.on("jump", doAction);
ourObject.on("skip", doAction);

// Passing multiple arguments to single event
ourObject.trigger("dance", 'dancing', "5 minutes");

// Passing multiple arguments to multiple events
ourObject.trigger("dance jump skip", 'on fire', "15 minutes");
```

#### listenTo()和stopListening()

`on`和`off`是把回调函数直接添加到被观察对象上的。而`listenTo()`则是告诉一个对象去监听另一个对象上的事件，允许监听者去去跟踪它所监听的事件。`stopListening()`可以随后被监听者调用来停止监听事件。

```javascript
var a = _.extend({}, Backbone.Events);
var b = _.extend({}, Backbone.Events);
var c = _.extend({}, Backbone.Events);

// add listeners to A for events on B and C
a.listenTo(b, 'anything', function(event){ console.log("anything happened"); });
a.listenTo(c, 'everything', function(event){ console.log("everything happened"); });

// trigger an event
b.trigger('anything'); // logs: anything happened

// stop listening
a.stopListening();

// A does not receive these events
b.trigger('anything');
c.trigger('everything');
```

`stopListening()`也可以有选择的用来停止监听事件，模型，或是回调句柄。

如果你使用`on`和`off`，与此同时又删除了视图和与之关联的models。通常来说不会有问题。（稍后翻译）

#### 事件和视图

在视图中，有两种类型的事件你可以监听：一种是DOM事件，一种是使用Event API触发的事件。理解它们的不同是十分重要的：视图如何绑定这些事件；关于回调被执行的上下文。

DOM事件可以通过视图的`events`属性或者使用`jQuery.on()`来绑定。在使用`events`属性绑定的回调函数内部，`this`指向的是当前的视图对象。而直接使用jQuery绑定的回调函数内部，`this`指向的是当前DOM元素。所有的DOM事件的回调都被传递一个`event`对象。查看Backbone文档中关于`delegateEvents`的详细描述。

关于Event API。如果事件通过`on()`来绑定被观察的对象，那么上下文参数将会被作为第三个参数传进来。如果事件通过`listenTo()`来绑定，那么回调函数中`this`指向的是监听者。传递给Event API的回调函数中的参数是依赖于事件的类型。

下面的例子说明了这些不同之处：

```html
<div id="todo">
    <input type='checkbox' />
</div>
```

```javascript
var View = Backbone.View.extend({

    el: '#todo',

    // 使用events属性给DOM绑定事件
    events: {
        'click [type="checkbox"]': 'clicked',
    },

    initialize: function () {
        // 使用jQuery给DOM绑定事件
        this.$el.click(this.jqueryClicked);

        // 使用on绑定自定义事件
        this.on('apiEvent', this.callback);
    },

    // 这里的'this'指向当前视图
    clicked: function(event) {
        console.log("events handler for " + this.el.outerHTML);
        this.trigger('apiEvent', event.type);
    },

    // 这里的'this'指向的是被事件绑定的DOM元素
    jqueryClicked: function(event) {
        console.log("jQuery handler for " + this.outerHTML);
    },

    callback: function(eventType) {
        console.log("event type was " + eventType);
    }

});

var view = new View();
```

