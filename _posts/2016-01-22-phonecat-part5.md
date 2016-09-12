---
layout:     post
title:      "Angular PhoneCat的实现5"
subtitle:   "加入动画"
date:       2016-01-22 12:00:00
author:     "wangxu"
header-img: "img/post-bg-2015.jpg"
tags:
    - Angular
---

### 动画

#### 如何产生动画

##### 产生动画的第一个条件：引入模块ngAnimate。它是在angular-animate.js中，所以需要事先引入这个js文件

首先，添加一个模块如phonecatAnimations来控制动画。

```javascript
var phonecatApp = angular.module('phonecatApp', [
  'ngRoute',
  'phonecatAnimations',

  'phonecatControllers',
  'phonecatFilters',
  'phonecatServices'
]);
```

其次，在phonecatAnimations添加依赖ngAnimate

`var phonecatAnimations = angular.module('phonecatAnimations', ['ngAnimate']);`

上面代码执行完，实际上是看不到动画效果的。但是angular会自动元素添加一些属性，比如在index.html页面中，进入一个新的模板时，会给ng-view所在的节点上添加ng-enter类，切换模板时会添加ng-leave类，又如给列表添加新的元素时在li上添加ng-enter类。删除一个元素时给li元素上添加ng-leave类。

所有的动画完成时（结束的瞬间）会添加*-active类，如ng-enter-active,ng-leave-active等。

##### 产生动画的第二个条件：通过添加css来控制动画

为了能让列表动起来，我们给列表中添加了样式类phone-listing，它是用来配合css来产生动画效果

```html
{% raw %}
<ul class="phones">
        <li ng-repeat="phone in phones | filter:query | orderBy:orderProp"
            class="thumbnail phone-listing">
          <a href="#/phones/{{phone.id}}" class="thumb"><img ng-src="{{phone.imageUrl}}"></a>
          <a href="#/phones/{{phone.id}}">{{phone.name}}</a>
          <p>{{phone.snippet}}</p>
        </li>
      </ul>
{% endraw %}
```

动画执行的流程是(那插入新元素来说):首先设置了插入起始的样式（opcaity:0;height:0;overflow:hidden这是在添加了ng-enter后才会生效），又设置了插入结束的样式（opacity:1;height:120px）。当有新的元素插入到列表中，angular会自动给元素添加ng-enter样式类，这时会触发transition。它会在0.5s内把opacity从0变化到1，把height从0变化到120px。ng-leave和ng-move原理也相同

```css
/*当元素被angular添加了ng-enter，ng-leave，ng-move类时，通过transition来控制动画*/
.phone-listing.ng-enter,
.phone-listing.ng-leave,
.phone-listing.ng-move {
  -webkit-transition: 0.5s linear all;
  -moz-transition: 0.5s linear all;
  -o-transition: 0.5s linear all;
  transition: 0.5s linear all;
}

/*当列表中加入新的元素瞬间,angular会自动给当前元素添加ng-enter类*/
/*这里其实是控制动画起始的样式*/
.phone-listing.ng-enter,
.phone-listing.ng-move {
  opacity: 0;
  height: 0;
  overflow: hidden;
}

/*当加入元素完成后，angular会自动给当前元素添加ng-enter-active类*/
/*这里是控制动画结束的样式*/
.phone-listing.ng-move.ng-move-active,
.phone-listing.ng-enter.ng-enter-active {
  opacity: 1;
  height: 120px;
}

/*当开始移除元素瞬间，angular自动添加ng-leave类*/
.phone-listing.ng-leave {
  opacity: 1;
  overflow: hidden;
}

/*当移除元素结束，angular自动添加ng-leave-active类*/
.phone-listing.ng-leave.ng-leave-active {
  opacity: 0;
  height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
```
