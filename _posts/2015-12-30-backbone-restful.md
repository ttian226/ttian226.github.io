---
layout:     post
title:      "Backbone学习笔记4"
subtitle:   "Backbone Restful"
date:       2015-12-30 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - Backbone
    - 翻译
---

### RESTful Persistence

我们所有例子中的数据都是创建在浏览器端的。对于大多数单一页面的应用来说，model的数据是存储在服务器端的。在这里，Backbone可以使你可以通过非常简单的代码来编写，通过模型或集合上单一的API与服务端执行RESTful同步。

#### 从服务端获取models

`Collections.fetch()`通过指定一个集合的url属性（也可以是一个函数），发出一个HTTP GET请求到URL上，以JSON数组的形式从服务端返回model的集合。当数据被接收后，`set()`方法将会被执行，来更新集合。

```javascript
var Todo = Backbone.Model.extend({
  defaults: {
    title: '',
    completed: false
  }
});

var TodosCollection = Backbone.Collection.extend({
  model: Todo,
  url: '/todos'
});

var todos = new TodosCollection();
todos.fetch(); // 发送HTTP GET请求到/todos
```

#### 保存models到服务端

Backbone可以立即从服务端获取整个models的集合。可以使用model的`save()`方法来单独更新models。当`save()`方法被这个从服务器上获取的models调用的时候，它会通过把model的id添加到collection的URL上去，发送一个HTTP PUT请求到服务器上，来创建一个url。如果这个model是浏览器创建的一个新的实例（例如，它不包含id属性），那么HTTP POST请求会被发送到collection的URL上去。`Collections.create()`可以用来创建一个新的model，添加到collection中，并通过单一的方法调用发送到服务端。

```javascript
var Todo = Backbone.Model.extend({
  defaults: {
    title: '',
    completed: false
  }
});

var TodosCollection = Backbone.Collection.extend({
  model: Todo,
  url: '/todos'
});

var todos = new TodosCollection();
todos.fetch();

var todo2 = todos.get(2);
todo2.set('title', 'go fishing');
todo2.save(); // 发送HTTP PUT请求到/todos/2

todos.create({title: 'Try out code samples'}); // 发送HTTP POST请求到/todos并添加到collection
```

正如之前提到的，`save()`方法会自动调用`validate()`方法，如果校验失败的话，将会在model上触发一个`invalid`事件

#### 从服务器上删除models

通过调用`destroy()`方法，model可以从包含它的集合中删除。不同于`Collection.remove()`方法，它只会从集合中删除一个model，`Model.destroy()`也可以发送一个HTTP DELETE请求到Collection的URL上。

```javascript
var Todo = Backbone.Model.extend({
  defaults: {
    title: '',
    completed: false
  }
});

var TodosCollection = Backbone.Collection.extend({
  model: Todo,
  url: '/todos'
});

var todos = new TodosCollection();
todos.fetch();

var todo2 = todos.get(2);
todo2.destroy(); // 发送HTTP DELETE请求到/todos/2，并从集合中删除model
```

如果model是`isNew`的，调用`destroy()`方法会返回`false`。

```javascript
var todo = new Backbone.Model();
console.log(todo.destroy());
// false
```

#### options

每一个RESTful API都会接收多种参数，最重要的是，所有的方法都会接收success和error回调，用来自定义处理服务器的响应。

调用`Model.save()`时指定`{patch: true}`参数，将会发送HTTP PATCH请求来处理发生改变的属性，而不是全部属性。例如`model.save(attrs, {patch: true})`

```javascript
// Save partial using PATCH
model.clear().set({id: 1, a: 1, b: 2, c: 3, d: 4});
model.save();
model.save({b: 2, d: 4}, {patch: true});
console.log(this.syncArgs.method);
// 'patch'
```

类似的，调用`Collection.fetch()`方法时传递`{reset: true}`参数，在更新集合时会使用`reset()`更新而不是使用`set()`
