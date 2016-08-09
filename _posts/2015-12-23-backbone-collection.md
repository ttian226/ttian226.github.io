---
layout:     post
title:      "Backbone学习笔记3"
subtitle:   "Backbone Collection"
date:       2015-12-23 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - Backbone
    - 翻译
---

### Collection

Collections是Model的集合，通过扩展`Backbone.Collection`来创建。

通常，当创建一个集合的时候，你需要定义一个属性来指定在你集合中的Model的类型，与此同时还要包含实例属性。

在下面的例子中，我们创建了一个TodoCollection用来包含我们的Todo Model

```javascript
var Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    }
});

var TodosCollection = Backbone.Collection.extend({
    model: Todo
});

var myTodo = new Todo({title:'Read the whole book', id: 2});

// 通过传Model实例的数组来创建Collection的实例
var todos = new TodosCollection([myTodo]);
console.log("Collection size: " + todos.length);    // Collection size: 1
```

#### 添加或删除Models

前面的例子通过Model的数组来创建Collection的实例。集合被创建后，models可以通过`add()`和`remove()`方法来添加或删除。

```javascript
var Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    }
});

var TodosCollection = Backbone.Collection.extend({
    model: Todo
});

var a = new Todo({ title: 'Go to Jamaica.'}),
    b = new Todo({ title: 'Go to China.'}),
    c = new Todo({ title: 'Go to Disneyland.'});

var todos = new TodosCollection([a, b]);
console.log("Collection size: " + todos.length);    // Collection size: 2

todos.add(c);
console.log("Collection size: " + todos.length);    // Collection size: 3

todos.remove([a, b]);
console.log("Collection size: " + todos.length);    // Collection size: 1

todos.remove(c);
console.log("Collection size: " + todos.length);    // Collection size: 0
```

注意`add()`和`remove()`既支持独立的model也支持model数组。

同时注意当使用`add()`时，如果传参数`{merge: true}`,会把model合并到集合中已经存在的model上去（前提是具有相同id），否则会被忽视。

```javascript
var items = new Backbone.Collection;
items.add([{ id : 1, name: "Dog" , age: 3}, { id : 2, name: "cat" , age: 2}]);
items.add([{ id : 1, name: "Bear" }], {merge: true });
items.add([{ id : 2, name: "lion" }]); // merge: false

console.log(JSON.stringify(items.toJSON()));
// [{"id":1,"name":"Bear","age":3},{"id":2,"name":"cat","age":2}]
```

#### 检索Models

有一些方法来检索集合中的model，最直接的方法就是使用`Collection.get()`它接收id作为参数，如下：

```javascript
var myTodo = new Todo({title:'Read the whole book', id: 2});

// 传一个model数组来实例化集合
var todos = new TodosCollection([myTodo]);

// 获取id=2的model
var todo2 = todos.get(2);

console.log(todo2 === myTodo); // true
```

在客户端-服务器的应用中，collection中的model通常由服务器获取。在任何时候你在客户端和服务器之间交互数据时，你需要一个方法来唯一标识model。在Backbone中通常使用`id`,`cid`,`idAttribute`属性。

每个在Backbone中的model都有一个id，它是一个唯一标识符，既可以是整型又可以是字符串（例如UUID）。model也会拥有一个cid属性，这是在model创建的时候Backbone会自动生成一个cid（客户端id）。任何唯一标识都可以在collection中检索model。

它们主要的不同就是cid是由Backbone生成的，如果你还没有设置id属性这是非常有帮助的，例如你的model已经被存储到服务端或者还没有保存到数据库。

`idAttribute`标识的是从服务端返回的model属性名（例如数据库的id），这回告诉Backbone从服务器返回的那个字段名应该作为model的id属性。默认情况下是作为id属性，但也可以自定义。例如，服务器给给model设置了唯一的属性叫`userid`，那么你可以把`idAttribute`设置为`userid`来作为你model的id属性。

在内部，`Backbone.Collection`包含了通过id属性来枚举的model的数组。当`collection.get(id)`被调用时，会通过关联的id去查找model的实例。

```javascript
// extends the previous example

var todoCid = todos.get(todo2.cid);

// As mentioned in previous example, 
// models are passed by reference
console.log(todoCid === myTodo); // true
```

#### 监听事件

因为Collection表示的是一组子项，当有model被添加或移除时，我们可以监听`add`和`remove`事件，下面是例子：

```javascript
var TodosCollection = new Backbone.Collection();

TodosCollection.on("add", function(todo) {
  console.log("I should " + todo.get("title") + ". Have I done it before? "  + (todo.get("completed") ? 'Yeah!': 'No.' ));
});

TodosCollection.add([
  { title: 'go to Jamaica', completed: false },
  { title: 'go to China', completed: false },
  { title: 'go to Disneyland', completed: true }
]);

// The above logs:
// I should go to Jamaica. Have I done it before? No.
// I should go to China. Have I done it before? No.
// I should go to Disneyland. Have I done it before? Yeah!
```

另外，我们也可以绑定`change`事件去监听Collection中每一个model的变化。

```javascript
var TodosCollection = new Backbone.Collection();

// 如果集合中的model改变了会记录日志
TodosCollection.on("change:title", function(model) {
    console.log("Changed my mind! I should " + model.get('title'));
});

TodosCollection.add([
  { title: 'go to Jamaica.', completed: false, id: 3 },
]);

var myTodo = TodosCollection.get(3);

myTodo.set('title', 'go fishing');
// Logs: Changed my mind! I should go fishing
```

jQuery形式的事件映射`obj.on({click: action})`也可以使用。这样可以比多次调用`.on`先的更清晰，而且有较好的排版。

```javascript
var Todo = Backbone.Model.extend({
  defaults: {
    title: '',
    completed: false
  }
});

var myTodo = new Todo();
myTodo.set({title: 'Buy some cookies', completed: true});

myTodo.on({
   'change:title' : titleChanged,
   'change:completed' : stateChanged
});

function titleChanged(){
  console.log('The title was changed!');
}

function stateChanged(){
  console.log('The state was changed!');
}

myTodo.set({title: 'Get the groceries'});
// The title was changed! 
```

Backbone事件也支持`once()`方法，它确响应事件时回调函数最多被调用一次。类似于jQuery的`one()`方法。

```javascript
// 定义一个带有两个counters的对象
var TodoCounter = { counterA: 0, counterB: 0 };
// 合并Backbone Events
_.extend(TodoCounter, Backbone.Events);

// 增加counterA的值，并触发一次'event'事件
var incrA = function(){ 
  TodoCounter.counterA += 1; 
  // 这次trigger将不会生效
  TodoCounter.trigger('event'); 
};

// 增加counterB的值
var incrB = function(){ 
  TodoCounter.counterB += 1; 
};

// 只调用一次，而不是显示的解绑事件监听
TodoCounter.once('event', incrA);
TodoCounter.once('event', incrB);

// 第一次trigger
TodoCounter.trigger('event');

console.log(TodoCounter.counterA === 1); // true
console.log(TodoCounter.counterB === 1); // true
```

counterA和counterB只被增加一次。

#### 重置/刷新集合

相比单独的添加或删除集合中的models，你可能想一次性的更新整个集合。`Collection.set()`接受一个model数组并执行必要的`add`，`remove`，`change`操作来更新集合。

```javascript
var TodosCollection = new Backbone.Collection();

TodosCollection.add([
    { id: 1, title: 'go to Jamaica.', completed: false },
    { id: 2, title: 'go to China.', completed: false },
    { id: 3, title: 'go to Disneyland.', completed: true }
]);

// we can listen for add/change/remove events
TodosCollection.on("add", function(model) {
  console.log("Added " + model.get('title'));
});

TodosCollection.on("remove", function(model) {
  console.log("Removed " + model.get('title'));
});

TodosCollection.on("change:completed", function(model) {
  console.log("Completed " + model.get('title'));
});

TodosCollection.set([
    { id: 1, title: 'go to Jamaica.', completed: true },
    { id: 2, title: 'go to China.', completed: false },
    { id: 4, title: 'go to Disney World.', completed: false }
]);

// Above logs:
// Completed go to Jamaica.
// Removed go to Disneyland.
// Added go to Disney World.
```

如果你需要简单的替换集合的内容，那么使用`Collection.reset()`方法。

```javascript
var TodosCollection = new Backbone.Collection();

// we can listen for reset events
TodosCollection.on("reset", function() {
  console.log("Collection reset.");
});

TodosCollection.add([
  { title: 'go to Jamaica.', completed: false },
  { title: 'go to China.', completed: false },
  { title: 'go to Disneyland.', completed: true }
]);

console.log('Collection size: ' + TodosCollection.length); // Collection size: 3

TodosCollection.reset([
  { title: 'go to Cuba.', completed: false }
]);
// Above logs 'Collection reset.'

console.log('Collection size: ' + TodosCollection.length); // Collection size: 1
```

使用不带任何参数的`reset()`方法可以清空集合，当动态加载一个新页面的数据时很有用。

```javascript
myCollection.reset();
```

需要注意`Collection.reset()`不会触发add或remove事件，替代的只是会触发`reset`事件。你使用它会使页面的渲染最优化，因为独立的事件开销会很昂贵。

同样注意监听reset事件时，之前的models可以通过`options.previousModels`来访问，非常方便。

```javascript
var todo = new Backbone.Model();
var todos = new Backbone.Collection([todo])
.on('reset', function(todos, options) {
  console.log(options.previousModels);
  console.log([todo]);
  console.log(options.previousModels[0] === todo); // true
});
todos.reset([]);
```

Collection中的`set()`方法可以被用来快速更新集合或models。这个方法会试图使用指定的model列表来执行快速的更新。当列表中的model不在集合中，它将被添加。如果存在将被合并。在集合中存在但没有在列表中的model会被删除。

```javascript
// Define a model of type 'Beatle' with a 'job' attribute
var Beatle = Backbone.Model.extend({
  defaults: {
    job: 'musician'
  }
});

// Create models for each member of the Beatles
var john = new Beatle({ firstName: 'John', lastName: 'Lennon'});
var paul = new Beatle({ firstName: 'Paul', lastName: 'McCartney'});
var george = new Beatle({ firstName: 'George', lastName: 'Harrison'});
var ringo = new Beatle({ firstName: 'Ringo', lastName: 'Starr'});

// Create a collection using our models
var theBeatles = new Backbone.Collection([john, paul, george, ringo]);

// Create a separate model for Pete Best
var pete = new Beatle({ firstName: 'Pete', lastName: 'Best'});

// Update the collection
theBeatles.set([john, paul, george, pete]);

// Fires a `remove` event for 'Ringo', and an `add` event for 'Pete'.
// Updates any of John, Paul and Georges's attributes that may have
// changed over the years.
```
