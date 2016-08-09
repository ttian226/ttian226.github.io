---
layout:     post
title:      "Backbone学习笔记8"
subtitle:   "Backbone Colloction Utility"
date:       2015-12-25 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - Backbone
    - 翻译
---

### Underscore utility functions

Backbone利用Underscore来给Collection提供一些直接的实用方法。

#### forEach() 遍历集合

```javascript
var todos = new Backbone.Collection();

todos.add([
    { title: 'go to Belgium.', completed: false },
    { title: 'go to China.', completed: false },
    { title: 'go to Austria.', completed: true }
]);

todos.forEach(function (model) {
    console.log(model.get('title'));
});

// Above logs:
// go to Belgium.
// go to China.
// go to Austria.
```

#### sortBy() 根据指定的属性排序集合

```javascript
var todos = new Backbone.Collection();

todos.add([
    { title: 'go to Belgium.', completed: false },
    { title: 'go to China.', completed: false },
    { title: 'go to Austria.', completed: true }
]);

var sortedByAlphabet = todos.sortBy(function (todo) {
    return todo.get('title').toLowerCase();
});

sortedByAlphabet.forEach(function (model) {
    console.log(model.get('title'));
});

// Above logs:
// - Now sorted:
// go to Austria.
// go to Belgium.
// go to China.
```

#### map() 遍历集合，通过转换函数映射每一个值。

```javascript
var todos = new Backbone.Collection();

todos.add([
    { title: 'go to Belgium.', completed: false },
    { title: 'go to China.', completed: false },
    { title: 'go to Austria.', completed: true }
]);

var count = 1;

var list = todos.map(function (model) {
    return count++ + '. ' + model.get('title');
});

_.each(list, function (value) {
    console.log(value);
});

// Above logs:
//1. go to Belgium.
//2. go to China.
//3. go to Austria.
```

#### max()/min() 检索指定属性的最大或最小值

```javascript
var todos = new Backbone.Collection();

todos.add([
    { id: 1, title: 'go to Belgium.', completed: false },
    { id: 2, title: 'go to China.', completed: false },
    { id: 3, title: 'go to Austria.', completed: true }
]);

var maxModel = todos.max(function (model) {
    return model.id;
});

console.log(maxModel.id);   // 3

var minModel = todos.min(function (model) {
    return model.id;
});

console.log(minModel.id);   // 1
```

#### pluck() 提取指定的属性

```javascript
var todos = new Backbone.Collection();

todos.add([
    { title: 'go to Belgium.', completed: false },
    { title: 'go to China.', completed: false },
    { title: 'go to Austria.', completed: true }
]);

var titles = todos.pluck('title');
console.log(titles);

// ["go to Belgium.", "go to China.", "go to Austria."]
```

#### filter() 过滤集合

```javascript
var todos = new Backbone.Collection();

todos.add([
    { title: 'go to Belgium.', completed: false },
    { title: 'go to China.', completed: false },
    { title: 'go to Austria.', completed: true }
]);

var list = todos.filter(function (model) {
    return model.get('completed') === false;
});

list.forEach(function (model) {
   console.log(model.toJSON());
});

// Object {title: "go to Belgium.", completed: false}
// Object {title: "go to China.", completed: false}
```

#### indexOf() 返回指定项在在集合中的索引

```javascript
var people = new Backbone.Collection();

var tom = new Backbone.Model({name: 'Tom'});
var rob = new Backbone.Model({name: 'Rob'});
var tim = new Backbone.Model({name: 'Tim'});

people.add([tom, rob, tim]);

console.log(people.indexOf(tom));   // 0
console.log(people.indexOf(rob));   // 1
console.log(people.indexOf(tim));   // 2
```

#### some()/any() 检查集合中是否有一个值通过为真的检测

```javascript
var people = new Backbone.Collection();

var tom = new Backbone.Model({name: 'Tom'});
var rob = new Backbone.Model({name: 'Rob'});
var tim = new Backbone.Model({name: 'Tim'});

people.add([tom, rob, tim]);

var r = people.some(function (model) {
   return model.get('name') === 'Tom';
});
console.log(r); // true
```

#### size() 返回集合的长度

```javascript
todos.size();

// 等价于
todos.length;
```

#### isEmpty() 判断集合是否为空

```javascript
var isEmpty = todos.isEmpty();
```

#### groupBy() 把集合根据指定的属性分组

```javascript
var todos = new Backbone.Collection();

todos.add([
    { title: 'go to Belgium.', completed: false },
    { title: 'go to China.', completed: false },
    { title: 'go to Austria.', completed: true }
]);

var byCompleted = todos.groupBy('completed');
console.log(byCompleted['true'].length);    // 1
console.log(byCompleted['false'].length);   // 2
```


另外，一些Underscore的Object方法也可以应用在Model上。

#### pick() 从model中提取指定的属性

```javascript
var Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    }
});

var todo = new Todo({title: 'go to Austria.'});
console.log(todo.pick('title'));    // Object {title: "go to Austria."}
```

#### omit() 和pick()相反提取除了指定的属性

```javascript
var Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    }
});

var todo = new Todo({title: 'go to Austria.'});
console.log(todo.omit('title')); // Object {completed: false}
```

#### keys(),values() 获取属性或值的集合

```javascript
var Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    }
});

var todo = new Todo({title: 'go to Austria.'});
console.log(todo.keys());   //["title", "completed"]
console.log(todo.values()); //["go to Austria.", false]
```

#### pairs() 获取属性的列表作为[key, value]对

```javascript
var Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    }
});

var todo = new Todo({title: 'go to Austria.'});
console.log(todo.pairs());  //[['title', 'go to Austria.'], ['completed', 'false']]
```

#### invert() 把对象的属性和值互相转换返回一个新的对象。

```javascript
var Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    }
});

var todo = new Todo({title: 'go to Austria.'});
console.log(todo.invert());  //Object {go to Austria.: "title", false: "completed"}
```

#### 链式API

说到utility函数，另一个语法糖就是Backbone也支持Underscore的`chain()`方法。链式调用是面向对象语言中惯用的语法。它是在同一个对象上执行的一串有序的方法调用以表现出一种单一的状态。然而Backbone使Underscore的数组操作作为Collection对象的方法可用，它们不能直接被链式调用因为它们返回的是数组而不是原始的Collection。

幸运的是，包含在Underscore中的`chain`方法使你可以在集合上使用链式调用。

`chain()`方法返回了一个对象，这个对象带有所有的Underscore数组操作方法，这些方法会返回当前的对象。`chain()`终止于`value()`方法。它可以简单的返回数组的结果。可链式调用的API看起来像这样：

```javascript
var collection = new Backbone.Collection([
    { name: 'Tim', age: 5 },
    { name: 'Ida', age: 26 },
    { name: 'Rob', age: 55 }
]);

var filteredNames = collection.chain()  // start chain, returns wrapper around collection's models
    .filter(function (item) {
        return item.get('age') > 10;
    })  // returns wrapped array excluding Tim
    .map(function (item) {
        return item.get('name');
    })  // returns wrapped array containing remaining names
    .value();   // terminates the chain and returns the resulting array

console.log(filteredNames); // logs: ['Ida', 'Rob']
```

一些Backbone特定的方法会返回`this`，意味着它们可以直接进行链式调用。

```javascript
var collection = new Backbone.Collection();

collection
    .add({ name: 'John', age: 23 })
    .add({ name: 'Harry', age: 33 })
    .add({ name: 'Steve', age: 41 });

var names = collection.pluck('name');

console.log(names); // logs: ['John', 'Harry', 'Steve']
```
