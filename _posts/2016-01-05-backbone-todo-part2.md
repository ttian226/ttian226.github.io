---
layout:     post
title:      "Backbone的Todos的实现2"
subtitle:   "静态HTML"
date:       2016-01-05 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - Backbone
    - 翻译
---

### Static HTML

现在把我们的html放入一个index.html的文件中。

#### header和script

首先，我们设置header和基本的应用依赖：jQuery,Underscore,Backbone,以及Backbone localstorage

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>Backbone.js • TodoMVC</title>
  <link rel="stylesheet" href="assets/index.css">
</head>
<body>
  <script type="text/template" id="item-template"></script>
  <script type="text/template" id="stats-template"></script>
  <script src="js/lib/jquery.min.js"></script>
  <script src="js/lib/underscore-min.js"></script>
  <script src="js/lib/backbone-min.js"></script>
  <script src="js/lib/backbone.localStorage.js"></script>
  <script src="js/models/todo.js"></script>
  <script src="js/collections/todos.js"></script>
  <script src="js/views/todos.js"></script>
  <script src="js/views/app.js"></script>
  <script src="js/routers/router.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

除了前面提到的依赖外，注意到还有其它的一些特定的应用也同样被加载了。这些文件分别被组织到不同的文件夹中如：models,views,collections,routers各尽其责。app.js文件则是核心的初始化代码。

注意：如果你想跟着做，创建一个作为存放index.html的目录

1. 在文件夹的最外层放置index.html文件
2. 下载jQuery,Underscore,Backbone,Backbone localStorage保存到js/lib目录下
3. 创建directories js/models, js/collections, js/views, js/routers目录

你也可能需要[index.css](https://raw.githubusercontent.com/tastejs/todomvc/gh-pages/examples/backbone/node_modules/todomvc-app-css/index.css)文件，它被放到assets文件夹中。记住你也可以在[TodoMVC.com](todomvc.com)看到最终版的应用。

通过向导我们将创建一个javascript应用，不必担心两个'text/template'脚本元素，我们一会将会替换它。

#### HTML

现在让我们填充index.html的body。我们需要一个`<input>`标签来创建新的todos。一个`<ul id="todo-list" />`用来显示实际的todos列表。一个footer，我们随后用来加入统计和执行一些操作的链接如清除已完成的todos。我们把下面的html标记于script标签前加入到`<body>`中。

```html
<section id="todoapp">
  <header id="header">
    <h1>todos</h1>
    <input id="new-todo" placeholder="What needs to be done?" autofocus>
  </header>
  <section id="main">
    <input id="toggle-all" type="checkbox">
    <label for="toggle-all">Mark all as complete</label>
    <ul id="todo-list"></ul>
  </section>
  <footer id="footer"></footer>
</section>
<div id="info">
  <p>Double-click to edit a todo</p>
  <p>Written by <a href="https://github.com/addyosmani">Addy Osmani</a></p>
  <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
</div>
```

#### 模板

为了完成index.html，我们需要添加模板，通过模板我们将用来通过注入模型的数据到它们的placeholders来创建动态的HTML。把模板添加在页面上的一个方法就是通过自定义的script标签。它们不会被浏览器解析，它只是被解释称文本。Underscore的mini-template能够访问这些模板从而渲染成html片段。

我们将开始填充模板#item-template，它用来展示单独的todo items

```html
<!-- index.html -->

<script type="text/template" id="item-template">
  <div class="view">
    <input class="toggle" type="checkbox" <%= completed ? 'checked' : '' %>>
    <label><%= title %></label>
    <button class="destroy"></button>
  </div>
  <input class="edit" value="<%= title %>">
</script>
```

在上面的模板标记中，例如`<%=`和`<%-`，是Underscore.js特定的模板标记,并在Underscore的官网有详细说明。在你自己的应用里，你可以自主选择模板库，例如Mustache或Handlebars。使用你喜爱的，Backbone不会介意。

我们也要定义#stats-template模板，通过它我们用来填充footer。

```html
<!-- index.html -->

<script type="text/template" id="stats-template">
  <span id="todo-count"><strong><%= remaining %></strong> <%= remaining === 1 ? 'item' : 'items' %> left</span>
  <ul id="filters">
    <li>
      <a class="selected" href="#/">All</a>
    </li>
    <li>
      <a href="#/active">Active</a>
    </li>
    <li>
      <a href="#/completed">Completed</a>
    </li>
  </ul>
  <% if (completed) { %>
  <button id="clear-completed">Clear completed (<%= completed %>)</button>
  <% } %>
</script>
```

模板#stats-template展示了未完成todos的个数，包含了超链接列表，这是当我们实现路由功能时执行的一些操作。也包含了一个按钮，用来清除所有已完成的项。

现在我们已经有了所有我们需要的HTML，我们开始通过Todo Model来实现我们的应用。
