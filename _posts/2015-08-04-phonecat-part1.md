---
layout:     post
title:      "Angular PhoneCat的实现1"
subtitle:   "视图 模板 控制器"
date:       2015-08-04 12:00:00
author:     "wangxu"
header-img: "img/post-bg-2015.jpg"
tags:
    - Angular
---

#### 静态页面

```html
<ul>
    <li>
        <span>Nexus S</span>
        <p>
            Fast just got faster with Nexus S.
        </p>
    </li>
    <li>
        <span>Motorola XOOM™ with Wi-Fi</span>
        <p>
            The Next, Next Generation tablet.
        </p>
    </li>
</ul>
```

#### 视图(View)和模板(Template)

在AngularJS中，一个**视图(View)**是模型通过HTML**模板(Template)**渲染之后的映射。这意味着，不论模型什么时候发生变化，AngularJS会实时更新结合点，随之更新视图。

原文：In Angular, the view is a projection of the model through the HTML template. This means that whenever the model changes, Angular refreshes the appropriate binding points, which updates the view.


**模板(Template)**，**模型(Model)**，**模型变量**？

这是一个模板：

```html
{% raw %}
<body ng-controller="PhoneListCtrl">
<ul>
    <li ng-repeat="phone in phones">
        {{phone.name}}
        <p>{{phone.snippet}}</p>
    </li>
</ul>
</body>
{% endraw %}
```

* 在`<li>`标签里面的`ng-repeat="phone in phones"`语句是一个AngularJS迭代器。这个迭代器告诉AngularJS用这个`<li>`标签作为模板为列表中的每一部手机创建一个`<li>`元素。
* 包裹在`phone.name`和`phone.snippet`周围的花括号标识着数据绑定。这里的表达式实际上是我们应用的一个**数据模型**引用，这些我们在`PhoneListCtrl`控制器里面都设置好了

![Image](https://docs.angularjs.org/img/tutorial/tutorial_02.png)

#### 模型(Model)和控制器(Controller)

在`PhoneListCtrl`控制器里面初始化了**数据模型**

定义了一个函数，函数名为`PhoneListCtrl`即`ng-controller`的值。函数参数为`$scope`，函数中定义了`$scope`属性`phones`为一个包含了3个对象的数组。

```javascript
function PhoneListCtrl($scope) {
    $scope.phones = [
        {name: "Nexus S",
            snippet: "Fast just got faster with Nexus S."},
        {name: "Motorola XOOM™ with Wi-Fi",
            snippet: "The Next, Next Generation tablet."},
        {name: "MOTOROLA XOOM™",
            snippet: "The Next, Next Generation tablet."}
    ];
}
```
*以上代码执行仍然会出错*

注意到原文中有句话：We have specified an Angular Module to load using ng-app="phonecatApp", where phonecatApp is the name of our module. This module will contain the PhoneListCtrl.
> 要指定一个模块名如`ng-app="phonecatApp"`，这个模块要包含`PhoneListCtrl`。


```html
{% raw %}
<!DOCTYPE html>
<html lang="en" ng-app="phonecatApp">
<head>
    <meta charset="UTF-8">
    <title></title>
    <script src="angular.min.js"></script>
    <script src="controller.js"></script>
</head>
<body ng-controller="PhoneListCtrl">
<ul>
    <li ng-repeat="phone in phones">
        {{phone.name}}
        <p>{{phone.snippet}}</p>
    </li>
</ul>
</body>
</html>
{% endraw %}
```

```javascript
var phonecatApp = angular.module('phonecatApp', []);

phonecatApp.controller('PhoneListCtrl', function($scope) {
    $scope.phones = [
        {name: "Nexus S",
            snippet: "Fast just got faster with Nexus S."},
        {name: "Motorola XOOM™ with Wi-Fi",
            snippet: "The Next, Next Generation tablet."},
        {name: "MOTOROLA XOOM™",
            snippet: "The Next, Next Generation tablet."}
    ];
});
```

上面的js可以如下改写：

```javascript
// 使用angular.module注册一个angularJS模型，第一个参数为ng-app的值
var app = angular.module('phonecatApp', []);

// 定义一个函数，参数为$scope
var phonelist = function($scope) {
    // 给$scope添加phones属性
    $scope.phones = [
        {name: "Nexus S",
            snippet: "Fast just got faster with Nexus S."},
        {name: "Motorola XOOM™ with Wi-Fi",
            snippet: "The Next, Next Generation tablet."},
        {name: "MOTOROLA XOOM™",
            snippet: "The Next, Next Generation tablet."}
    ];
};

// 调用这个模型的controller方法，第一个参数为ng-controller的值。第二个参数是自定义的函数
app.controller('PhoneListCtrl', phonelist);
```

#### 过滤器

controller代码不做任何改变，只修改html代码，增加一个`<input>`框。增加一个`ng-model`值为`query`。
添加一个`<input>`标签，使用Angular的过滤函数`filter`去处理ngRepeat(ng迭代器)的过滤。
用户在input框中输入一个关键字，会立刻在list列表中看到变化

```html
{% raw %}
<body ng-controller="PhoneListCtrl">
<div class="container-fluid">
    <div class="row">
        <div class="col-md-2">
            <!--Sidebar content-->

            Search: <input ng-model="query">

        </div>
        <div class="col-md-10">
            <!--Body content-->

            <ul class="phones">
                <li ng-repeat="phone in phones | filter:query">
                    {{phone.name}}
                    <p>{{phone.snippet}}</p>
                </li>
            </ul>

        </div>
    </div>
</div>
</body>
{% endraw %}
```

![Image](https://docs.angularjs.org/img/tutorial/tutorial_03.png)

* 数据绑定：这是AngularJS的一个核心特性。当页面加载的时候，AngularJS会根据输入框的属性值名字（这里的属性值为`query`），将其与**数据模型**中相同名字的变量`query`绑定在一起，以确保两者的同步性。
* 在这段代码中，用户在输入框中输入数据，名字称作`query`。会立即作为列表迭代器的过滤器`phone in phones | filter:query`。当用户输入引起**数据模型**变化时，迭代器可以高效得更新DOM将数据模型最新的状态反映出来。
* 使用`filter`进行过滤，`filter`函数会使用`query`这个值创建一个仅仅包含匹配了`query`的记录新的数组。
* `ngRepeat`会根据`filter`过滤器生成的手机记录数据数组来自动更新视图。整个过程对于开发者来说都是透明的。

#### 双向绑定

* 增加一个名为`ng-model="orderProp"`的`select`标签，我们的用户可以选择提供的两种排序方式。
* 给`ng-repeat`增加`orderBy`过滤器来处理进入迭代器中的数据，过滤器以一个数组作为输入。复制一份副本，然后把副本重排序再输出到迭代器。

```html
{% raw %}
<body ng-controller="PhoneListCtrl">
<div class="container-fluid">
    <div class="row">
        <div class="col-md-2">
            <!--Sidebar content-->

            Search: <input ng-model="query">
            Sort by:
            <select ng-model="orderProp">
                <option value="name">Alphabetical</option>
                <option value="age">Newest</option>
            </select>
        </div>
        <div class="col-md-10">
            <!--Body content-->

            <ul class="phones">
                <li ng-repeat="phone in phones | filter:query | orderBy:orderProp">
                    {{phone.name}}
                    <p>{{phone.snippet}}</p>
                </li>
            </ul>

        </div>
    </div>
</div>
</body>
{% endraw %}
```

![Image](https://docs.angularjs.org/img/tutorial/tutorial_04.png)

AngularJS会在`<select>`和`orderProp`模型之间创建一个双向的数据绑定。而后，`orderProp`会被用作`orderBy`过滤器的输入。
正如在前面讨论数据绑定和迭代器的时候所说的一样，无论什么时候**数据模型**发生了改变（比如用户在下拉菜单中选了不同的顺序），AngularJS的数据绑定会让视图自动更新。没有任何笨拙的DOM操作！

修改phonelist函数

```javascript
var phonelist = function($scope) {
    // 给数组中的每个对象增加age属性
    $scope.phones = [
        {
            name: "Nexus S",
            snippet: "Fast just got faster with Nexus S.",
            age: 1
        },
        {
            name: "Motorola XOOM™ with Wi-Fi",
            snippet: "The Next, Next Generation tablet.",
            age: 2
        },
        {
            name: "MOTOROLA XOOM™",
            snippet: "The Next, Next Generation tablet.",
            age: 3
        }
    ];

    // 设置orderProp的默认值
    $scope.orderProp = 'age';
};
```
* 我们修改了`phones`模型—— 手机的数组 ——为每一个手机记录其增加了一个`age`属性。我们会根据`age`属性来对手机进行排序
* 我们在控制器代码里加了一行`orderProp`的默认值为age。如果我们不设置默认值，这个模型会在我们的用户在下拉菜单选择一个顺序之前一直处于未初始化状态。

现在我们该好好谈谈双向数据绑定了。注意到当应用在浏览器中加载时，“Newest”在下拉菜单中被选中。这是因为我们在控制器中把`orderProp`设置成了‘age’。所以绑定在从我们模型到用户界面的方向上起作用——即数据从模型到视图的绑定。现在当你在下拉菜单中选择“Alphabetically”，数据模型会被同时更新，并且手机列表数组会被重新排序。这个时候数据绑定从另一个方向产生了作用——即数据从视图到模型的绑定

#### XHR和依赖注入

```javascript
var app = angular.module('phonecatApp', []);

// 修改phonelist，数据通过$http来获取
var phonelist = function($scope, $http) {
    $http.get('app/phones/phones.json').success(function(data) {
        $scope.phones = data;
    });

    $scope.orderProp = 'age';
};

// 第二个参数为一个数组，数组最后面的元素是phonelist函数的引用，前面两个元素为phonelist的两个参数
app.controller('PhoneListCtrl', ['$scope', '$http', phonelist]);//或者 app.controller('PhoneListCtrl', phonelist);
```


控制器：
我们在控制器中使用AngularJS服务`$http`向你的Web服务器发起一个HTTP请求，以此从`app/phones/phones.json`文件中获取数据。`$http`仅仅是AngularJS众多内建服务中之一，这些服务可以处理一些Web应用的通用操作。AngularJS能将这些服务注入到任何你需要它们的地方。

为了使用AngularJS的服务，你只需要在控制器的构造函数里面作为参数声明出所需服务的名字，就像这样：

```javascript
function PhoneListCtrl($scope, $http) {...}
```

当控制器构造的时候，AngularJS的依赖注入器会将这些服务注入到你的控制器中。当然，依赖注入器也会处理所需服务可能存在的任何传递性依赖（一个服务通常会依赖于其他的服务）。*注意到参数名字非常重要，因为注入器会用他们去寻找相应的依赖。*
![Image](https://docs.angularjs.org/img/tutorial/tutorial_05.png)

#### '$'前缀命名习惯

你可以创建自己的服务。作为一个命名习惯，AngularJS内建服务，作用域方法，以及一些其他的AngularJS API都在名字前面使用一个‘$’前缀。不要使用‘$’前缀来命名你自己的服务和模型，否则可能会产生名字冲突。

#### 关于JS压缩

由于AngularJS是通过控制器构造函数的参数名字来推断依赖服务名称的。所以如果你要压缩`PhoneListCtrl`控制器的JS代码，它所有的参数也同时会被压缩，这时候依赖注入系统就不能正确的识别出服务了。

为了克服压缩引起的问题，只要在控制器函数里面给$inject属性赋值一个依赖服务标识符的数组:

```javascript
var app = angular.module('phonecatApp', []);
function PhoneListCtrl($scope, $http) {
    $http.get('phones.json').success(function(data) {
        $scope.phones = data;
    });

    $scope.orderProp = 'age';
}

// 给PhoneListCtrl添加$inject属性，并赋值一个数组
PhoneListCtrl.$inject = ['$scope', '$http'];
app.controller('PhoneListCtrl', PhoneListCtrl);
```
另一种方法：使用Javascript数组方式构造控制器：把要注入的服务放到一个字符串数组（代表依赖的名字）里，数组最后一个元素是控制器的方法函数：

```javascript
var app = angular.module('phonecatApp', []);
function PhoneListCtrl($scope, $http) {
    $http.get('phones.json').success(function(data) {
        $scope.phones = data;
    });

    $scope.orderProp = 'age';
}

app.controller('PhoneListCtrl', ['$scope', '$http', PhoneListCtrl]);
```

```javascript
// 使用如下形式，则函数参数名可以自定义
app.controller('PhoneListCtrl', ['$scope', '$http', function($s, $h) {
    // ...
}]);

// 但不使用数组形式，参数则不能自定义
app.controller('PhoneListCtrl', function($scope, $http) {
    // ...
});
```


#### 链接与图片模板

修改模板如下：

```html
{% raw %}
<body ng-controller="PhoneListCtrl">
<div class="container-fluid">
    <div class="row">
        <div class="col-md-2">
            <!--Sidebar content-->

            Search: <input ng-model="query">
            Sort by:
            <select ng-model="orderProp">
                <option value="name">Alphabetical</option>
                <option value="age">Newest</option>
            </select>
        </div>
        <div class="col-md-10">
            <!--Body content-->

            <ul class="phones">
                <li ng-repeat="phone in phones | filter:query | orderBy:orderProp" class="thumbnail">
                    <a href="#/phones/{{phone.id}}" class="thumb"><img ng-src="{{phone.imageUrl}}"></a>
                    <a href="#/phones/{{phone.id}}">{{phone.name}}</a>
                    <p>{{phone.snippet}}</p>
                </li>
            </ul>

        </div>
    </div>
</div>
</body>
{% endraw %}
```
关于`ng-src`:

我们同样为每条记录添加手机图片，只需要使用`ng-src`指令代替`<img>`的`src`属性标签就可以了。如果我们仅仅用一个正常`src`属性来进行绑定`<img class="diagram" src="{{phone.imageUrl}}">`，浏览器会把AngularJS的`{% raw %}{{ 表达式 }}{% endraw %}`标记直接进行字面解释，并且发起一个向非法url`http://localhost:8000/app/{{phone.imageUrl}}`的请求。因为浏览器载入页面时，同时也会请求载入图片，AngularJS在页面载入完毕时才开始编译——浏览器请求载入图片时`{{phone.imageUrl}}`还没得到编译！有了这个`ng-src`指令会避免产生这种情况，使用`ng-src`指令防止浏览器产生一个指向非法地址的请求。

json文件中为每个对象增加两个属性'id'和'imageUrl':

```json
[
    {
        "id": "nexus-s",
        "imageUrl": "img/phones/nexus-s.0.jpg",
        "name": "Nexus S",
        "snippet": "Fast just got faster with Nexus S.",
        "age": 1
    },
    {
        "id": "motorola-xoom-with-wi-fi",
        "imageUrl": "img/phones/motorola-xoom-with-wi-fi.0.jpg",
        "name": "Motorola XOOM™ with Wi-Fi",
        "snippet": "The Next, Next Generation tablet.",
        "age": 2
    },
    {
        "id": "motorola-xoom",
        "imageUrl": "img/phones/motorola-xoom.0.jpg",
        "name": "MOTOROLA XOOM™",
        "snippet": "The Next, Next Generation tablet.",
        "age": 3
    }
]
```

