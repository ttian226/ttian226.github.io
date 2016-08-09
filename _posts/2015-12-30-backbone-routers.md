---
layout:     post
title:      "Backbone学习笔记6"
subtitle:   "Backbone Routers"
date:       2015-12-30 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - Backbone
    - 翻译
---

### Routers

在Backbone中，routers提供了一种方法，让你使用URLs（也可以是哈希片段）关联应用的某个部分。你应用的任何一个片段，如标签，分享，或者是回退按钮，都需要一个URL。

一些使用哈希值标记作为路由的例子如下：

```javascript
http://example.com/#about
http://example.com/#search/seasonal-horns/page2
```

一个应用通常至少有一个路由映射，映射了一个URL路由到一个函数，这个函数决定了用户访问了这个URL后将要发生什么事。这种关系像下面这样定义：

```javascript
'route' : 'mappedFunction'
```

通过扩展`Backbone.Router`来定义我们的第一个Router。出于向导的目的，我们继续假设创建了一个大型的todo应用，它需要一个复杂的TodoRouter。

```javascript
var TodoRouter = Backbone.Router.extend({
    /* 定义route和function的映射 */
    routes: {
        "about" : "showAbout",
        /* Sample usage: http://example.com/#about */

        "todo/:id" : "getTodo",
        /* 这是一个使用":param"变量的例子，它允许我们在两个斜线之间匹配任何一个值 */ 
        /* Sample usage: http://example.com/#todo/5 */

        "search/:query" : "searchTodos",
        /* 我们也可以定义多个路由去映射同一个函数，在这个例子中是searchTodos()，注意下面当page存在的时候
         我们是如何传递一个page值的 */ 
        /* Sample usage: http://example.com/#search/job */

        "search/:query/p:page" : "searchTodos",
        /* 正像我们看到的一样，如果有需要，URLs可以包含多个":param" */
        /* Sample usage: http://example.com/#search/job/p1 */

        "todos/:id/download/*documentPath" : "downloadDocument",
        /* 这是一个使用'*通配符'的例子，它能够匹配url多个部分，并且能够与":param"进行合并 */ 
        /* Sample usage: http://example.com/#todos/5/download/files/Meeting_schedule.doc */

        "*other"    : "defaultRoute",
        /* 这是一个同样使用'*通配符'默认的路由，它匹配的是之前没有匹配任何一个路由的url或者是用户手动输入了一个错误的url*/
        /* Sample usage: http://example.com/# <anything> */

        "optional(/:item)": "optionalItem",
        "named/optional/(y:z)": "namedOptionalItem"
        /* 路由URLs也支持通过圆括号来配置，而不需要使用正则表达式 */
    },

    showAbout: function(){
    },

    getTodo: function(id){
        // 匹配到上面路由的id将会被传入到这个函数中
        console.log("You are trying to reach todo " + id);
    },

    searchTodos: function(query, page){
        var page_number = page || 1;
        console.log("Page number: " + page_number + " of the results for todos containing the word: " + query);
    },

    downloadDocument: function(id, path){
    },

    defaultRoute: function(other){
        console.log('Invalid. You attempted to reach:' + other);
    }
});

/* 现在我们已经有一个路由的设置，我们需要实例化它 */
var myTodoRouter = new TodoRouter();
```

Backbone基于`window.history.pushState`提供了对HTML5 pushState的支持。这允许你像这个例子[http://backbonejs.org/just/an/example](http://backbonejs.org/just/an/example)一样去定义路由。当用户的浏览器不支持pushState时它会通过自动降级来支持。注意，如果你有能力在服务端也支持pushState的话那是最好的，尽管实现起来有点困难。

**是否有关于路由数量的限制？**

Backbone创始人Andrew de Andrade在他的文中指出，在他们大部分的应用中通常使用单一的路由。很可能在你的项目中不会需要超过1到2个路由；绝大多数你的应用中可以被组织成单一的路由而不必那么复杂。

#### Backbone.history

接下来我们通过初始化`Backbone.history`来处理我们应用的`hashchange`事件。它将会自动处理我们定义的路由，并且在我们访问url时触发回调函数执行。

`Backbone.history.start()`方法将会通知Backbone一切准备就绪，可以监控所有的`hashchange`事件了，像如下这样：

```javascript
var TodoRouter = Backbone.Router.extend({
  /* define the route and function maps for this router */
  routes: {
    "about" : "showAbout",
    "search/:query" : "searchTodos",
    "search/:query/p:page" : "searchTodos"
  },

  showAbout: function(){},

  searchTodos: function(query, page){
    var page_number = page || 1;
    console.log("Page number: " + page_number + " of the results for todos containing the word: " + query);
  }
});

var myTodoRouter = new TodoRouter();

Backbone.history.start();

// Go to and check console:
// http://localhost/#search/job/p3   logs: Page number: 3 of the results for todos containing the word: job
// http://localhost/#search/job      logs: Page number: 1 of the results for todos containing the word: job 
// etc.
```

对于`Router.navigate()`来说，通过传参数`trigger:true`来更新URL片段来触发路由是可能的。

注意，这种用法是不推荐的，推荐的方法是像上面描述的那样，当你的应用过渡到指定的状态时，创建一个bookmarkable URL。

```javascript
var TodoRouter = Backbone.Router.extend({
  routes: {
    "todo/:id": "viewTodo",
    "todo/:id/edit": "editTodo"
    // ... other routes
  },

  viewTodo: function(id){
    console.log("View todo requested.");
    this.navigate("todo/" + id + '/edit', {trigger: true}); // updates the fragment and triggers the route as well
  },

  editTodo: function(id) {
    console.log("Edit todo opened.");
  }
});

var myTodoRouter = new TodoRouter();

Backbone.history.start();

// Go to: http://localhost/#todo/4
//
// URL is updated to: http://localhost/#todo/4/edit
// and this time editTodo() function is invoked.
//
// logs:
// View todo requested.
// Edit todo opened.
```

除了通过Backbone.history来触发外，`route`事件也可以在router上被触发

```javascript
Backbone.history.on('route', onRoute);

// Trigger 'route' event on router instance.
router.on('route', function(name, args) {
  console.log(name === 'routeEvent'); 
});

location.replace('http://example.com#route-event/x');
Backbone.history.checkUrl();
```
