---
layout:     post
title:      "Backbone的Todos的实现1"
subtitle:   "todos的总体结构"
date:       2016-01-04 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - Backbone
    - 翻译
---

### Exercise 1: Todos - Your First Backbone.js App

现在让我们写第一个Backbone.js应用。我们将要创建Backbone Todo List的应用，这个例子展示在[TodoMVC.com](todomvc.com)。创建一个Todo List是学习Backbone一个非常好的方法。它是一个相对简单的应用，它涉及到的东西包括绑定，模型数据保存，路由，模板渲染，它展现了Backbone核心的一些特性。

![Todo List](https://addyosmani.com/backbone-fundamentals/img/todos_a.png)

让我们来考虑下它的结构，我们需要以下这些：

* 一个todo模型用来描述独立的todo items
* 一个TodoList集合来存储和维护todos
* 一个创建todos的方法
* 一个用来显示todos列表的方法
* 一个编辑todos的方法
* 一个用来标记一个todo已经完成的方法
* 一个删除todos的方法
* 一个过滤todo已经完成（或正在进行）的方法

本质上，这些特性都是经典的CRUD方法。让我们开始吧！
