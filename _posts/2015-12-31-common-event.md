---
layout:     post
title:      "浏览器常用事件小结"
subtitle:   ""
date:       2015-12-31 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - Javascript
    - Event
---

#### 鼠标事件

##### [mousedown](https://developer.mozilla.org/en-US/docs/Web/Events/mousedown)

The mousedown event is fired when a pointing device button (usually a mouse button) is pressed on an element.

##### [mouseup](https://developer.mozilla.org/en-US/docs/Web/Events/mouseup)

The mouseup event is fired when a pointing device button (usually a mouse button) is released over an element

##### [mousemove](https://developer.mozilla.org/en-US/docs/Web/Events/mousemove)

The mousemove event is fired when a pointing device (usually a mouse) is moved while over an element

##### [mouseover](https://developer.mozilla.org/en-US/docs/Web/Events/mouseover)

The mouseover event is fired when a pointing device is moved onto the element that has the listener attached or onto one of its children.

##### [mouseout](https://developer.mozilla.org/en-US/docs/Web/Events/mouseout)

The mouseout event is fired when a pointing device (usually a mouse) is moved off the element that has the listener attached or off one of its children.

#### 属性

##### [MouseEvent.screenX](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)

为只读属性。返回鼠标事件发生时鼠标指针相对于屏幕的水平坐标。


##### [MouseEvent.screenY](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)

为只读属性。返回事件发生时鼠标指针相对于屏幕的垂直坐标


#### UI事件

##### [scroll](https://developer.mozilla.org/en-US/docs/Web/Events/scroll)

当文档视图或页面元素发生滚动时触发

#### 文档事件

##### [readystatechange](https://developer.mozilla.org/en-US/docs/Web/Events/readystatechange)

当文档的`readyState`属性发生变化时触发。

```javascript
document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
        initApplication();
    }
}
```

上面代码可以用`DOMContenLoaded`事件来替代

```javascript
document.addEventListener("DOMContentLoaded", function(event) {
    initApplication();
});
```

`readystatechange`事件也应用在XMLHttpRequest上，例如

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', 'example.php');
xhr.send();
xhr.onreadystatechange = function() {
　　if ( xhr.readyState === 4 && xhr.status === 200 ) {
　　　　alert( xhr.responseText );
　　} else {
　　　　alert( xhr.statusText );
　　}
};
```

##### [DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded)

html文档解析和加载完成触发，而不等待图片等其它资源加载完成。

#### 存储事件

##### [storage](https://developer.mozilla.org/en-US/docs/Web/Events/storage)

每次改变本地存储的值时会触发（前提必须新开个窗口或标签，在同一个窗口中修改不会触发事件）

```html
<button>click</button>
```

```javascript
document.addEventListener('DOMContentLoaded', function () {
    init();
}, false);

function init() {
    var btn = document.getElementsByTagName('button')[0];

    // storage事件的目标是window对象
    window.addEventListener('storage', function (e) {
        if (e.key === 'key-test') {
            alert('key has changed!, old value:'+ e.oldValue +' new value:'+ e.newValue);
        }
    }, false);

    // 每次点击按钮会随机改变key的值
    btn.addEventListener('click', function (e) {
        localStorage.setItem('key-test', Math.random(0, 1));
    }, false);
}
```


