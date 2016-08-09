---
layout:     post
title:      "Backbone学习笔记1"
subtitle:   "Backbone Models"
date:       2016-01-05 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - Backbone
    - 翻译
---

### Models

Backbone models包含应用的数据和围绕着这些数据的逻辑。例如，我们可以用模型来描述一个todo items。在这个模型中包含了它的一些属性像是`title`(todo的内容),`completed`(当前状态)

通过扩展`Backbone.Model`可以创建Model

```javascript
var Todo = Backbone.Model.extend({});

// 创建一个Todo model的实例
// 这个model没有任何的值
var todo1 = new Todo();
// {}
console.log(JSON.stringify(todo1));

// 附加一些数据
var todo2 = new Todo({
    title: 'Check the attributes of both model instances in the console.',
    completed: true
});
// {"title":"Check the attributes of both model instances in the console.","completed":true}
console.log(JSON.stringify(todo2));
```

#### Initialization

当一个新的Model实例被创建时`initialize()`方法会被调用。

```javascript
var Todo = Backbone.Model.extend({
    initialize: function () {
        console.log('This model has been initialized.');
    }
});

var myTodo = new Todo();
// Logs: This model has been initialized.
```

#### Default values

如果你想让你的Model有一组默认值，使用`defaults`属性来设置。

```javascript
var Todo = Backbone.Model.extend({
    // 默认的属性值
    defaults: {
        title: '',
        completed: false
    }
});

// 现在我们创建一个带有默认值的Model的实例
var todo1 = new Todo();

// {"title":"","completed":false}
console.log(JSON.stringify(todo1));

// 我们可以创建一个带有自己属性值的实例
var todo2 = new Todo({
    title: 'Check attributes of the logged models in the console.'
});

// {"title":"Check attributes of the logged models in the console.","completed":false}
console.log(JSON.stringify(todo2));

// 覆盖所有的默认属性
var todo3 = new Todo({
    title: 'This todo is done, so take no action on this one.',
    completed: true
});

// {"title":"This todo is done, so take no action on this one.","completed":true}
console.log(JSON.stringify(todo3));
```

#### Model.get()

`Model.get()`提供了一个简单的访问Model属性的方法。

```javascript
var Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    }
});

var todo1 = new Todo();
console.log(todo1.get('title'));    // 空字符串
console.log(todo1.get('completed'));// false

var todo2 = new Todo({
    title: "Retrieved with model's get() method.",
    completed: true
});

console.log(todo2.get('title'));    // Retrieved with model's get() method.
console.log(todo2.get('completed'));// true
```

如果你需要读取或克隆一个模型的所有属性，使用它的`toJSON()`方法。这个方法返回了一个对象(它不是一个JSON字符串)，这个对象包含了所有的属性。然而`JSON.stringify()`则是把toJSON()方法所生成的对象转换成相应的字符串形式。上面的例子正是利用了这个特性来使用`JSON.stringify()`方法打印Model实例。

```javascript
var Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    }
});

var todo1 = new Todo();
var todo1Attributes = todo1.toJSON();
// {title: "", completed: false}
console.log(todo1Attributes);

var todo2 = new Todo({
    title: "Try these examples and check results in console.",
    completed: true
});
// {title: "Try these examples and check results in console.", completed: true}
console.log(todo2.toJSON());
```

#### Model.set()

`Model.set()`方法用来给Model设置一个或多个属性值。当Model的任何一个属性值被改变时`change`事件被触发。change事件对于每个属性值的变化可以单独被触发（例如：`change:name`, `change:age`）

```javascript
var Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    }
});

var myTodo = new Todo({
    title: "Set through instantiation."
});

console.log('Todo title: ' + myTodo.get('title'));  // Todo title: Set through instantiation.
console.log('Completed: ' + myTodo.get('completed'));// Completed: false

// 通过Model.set()设置一个属性
myTodo.set("title", "Title attribute set through Model.set().");
console.log('Todo title: ' + myTodo.get('title'));  // Todo title: Title attribute set through Model.set().
console.log('Completed: ' + myTodo.get('completed')); // Completed: false

// 通过Model.set()设置多个属性
myTodo.set({
    title: "Both attributes set through Model.set().",
    completed: true
});
console.log('Todo title: ' + myTodo.get('title'));  // Todo title: Both attributes set through Model.set().
console.log('Completed: ' + myTodo.get('completed')); // Completed: true
```

#### 直接访问

Model暴露了一个`.attributes`属性。它返回一个包含Model所有内部属性的一个对象。通过`.attributes`给Model设置属性不会触发事件。
给set()方法传递`{silent:true}`不会触发`change:attr`事件。

```javascript
var Person = new Backbone.Model();

Person.on('change:name', function () {
    console.log('Name changed');
});

// 通过set()方法设置属性会触发change事件，这里会打印Name changed
Person.set({name: 'Andrew'});

// 不会触发change事件，无输出
Person.set({name: 'Jeremy'}, {silent: true});

// 'name'属性被改变，true
console.log(Person.hasChanged("name"));
// 任何属性被改变，true
console.log(Person.hasChanged(null));
```

记住尽可能的使用set()方法赋值，或者在实例化时就初始化属性值。

#### 监听Model的变化

当Backbone Model发生变化时，如果你想接收一个通知。你可以绑定监听器到这个Model上来监听`change`事件。添加监听器最合适的位置就是在`initialize()`方法中。

```javascript
var Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    },
    initialize: function () {
        console.log('This model has been initialized.');
        this.on('change', function () {
            console.log('- Values for this model have changed.');
        });
    }
});

var myTodo = new Todo();
myTodo.set('title', 'The listener is triggered whenever an attribute value changes.');
console.log('Title has changed: ' + myTodo.get('title'));

myTodo.set('completed', true);
console.log('Completed has changed: ' + myTodo.get('completed'));

myTodo.set({
    title: 'Changing more than one attribute at the same time only triggers the listener once.',
    completed: true
});

// Above logs:
// This model has been initialized.
// - Values for this model have changed.
// Title has changed: The listener is triggered whenever an attribute value changes.
// - Values for this model have changed.
// Completed has changed: true
// - Values for this model have changed.
```

你也可以监听Model中的单独的一个属性的变化，在下面的例子中我们记录了Todo Model中title的变化。

```javascript
var Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    },
    initialize: function () {
        console.log('This model has been initialized.');
        this.on('change:title', function () {
            console.log('Title value for this model has changed.');
        });
    },
    setTitle: function (newTitle) {
        this.set('title', newTitle);
    }
});

var myTodo = new Todo();
// 下面两处变化都能触发监听
myTodo.set('title', 'Check what\'s logged.');
myTodo.setTitle('Go fishing on Sunday.');

// 这次变化不会被触发
myTodo.set('completed', true);
console.log('Todo set as completed: ' + myTodo.get('completed'));

// Above logs:
// This model has been initialized.
// Title value for this model has changed.
// Title value for this model has changed.
// Todo set as completed: true
```

#### 校验

Backbone通过`model.validate()`方法支持Model的校验。它允许在设置属性之前来检查这些值。默认情况下校验方法发生在save()方法被调用时或者带有`{validate:true}`参数的set()方法。

```javascript
var Person = new Backbone.Model({name: 'Jeremy'});

Person.validate = function (attrs) {
    if (!attrs.name) {
        return 'I need your name';
    }
};

Person.set({name: 'Samuel'});
console.log(Person.get('name'));

// 删除name属性，强制进行校验
Person.unset('name', {validate: true});
```

上面我们使用了`unset()`方法，它可以从Model内部的属性集合中删除一个指定的属性值。

校验方法可以简单，必要的话也可以复杂。如果提供的属性值有效`.validate()`方法什么都不返回。如果属性无效会返回一个错误值。

当校验函数返回错误时：

* `invalid`事件被触发。 带有错误值的Model属性`validationError`会被方法返回（即`this.validationError`就是返回的错误值）
* `.save()`方法不会被调用，Model的属性不会被更改。

下面是一个完整的校验例子：

```javascript
var Todo = Backbone.Model.extend({
    defaults: {
        completed: false
    },

    validate: function (attributes) {
        if (attributes.title === undefined) {
            return "Remember to set a title for your todo.";
        }
    },

    initialize: function () {
        console.log('This model has been initialized.');
        this.on('invalid', function (model, error) {
            console.log(error);
        });
    }
});

var myTodo = new Todo();
myTodo.set('completed', true, {validate: true});    // Remember to set a title for your todo.
console.log('completed: ' + myTodo.get('completed'));   // completed: false
```

**注意** 传递给`validate()`方法的`attributes`只是Model属性的一个浅拷贝，而不是属性本身。

同样注意虽然在初始化中校验是可以的，但是应该尽量避免使用。例如下面：
`var emptyTodo = new Todo(null, {validate: true});`
