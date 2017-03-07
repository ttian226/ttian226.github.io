---
layout:     post
title:      "materializecss源码剖析"
subtitle:   ""
date:       2016-09-08 12:00:00
author:     "wangxu"
header-img: "img/post-bg-bridge.jpg"
tags:
    - SASS
    - CSS
---

### grid

**关于`.container`的宽度：**

1. 当浏览器窗口宽度<601px时，width=90%
2. 当>=601px时并且<993px时，width=85%
3. 当>=993px时，width=70%，并且width最大为1280px（max-width: 1280px）

也就是窗口拉的越宽，width的百分比越小，但是最宽也不会超过1280px。

`.container .row`的margin-left和margin-right默认是-1.5rem/2。html的默认行高line-height也是1.5。从这里看出它的左右外边距宽度是默认行高的一半（1.5*font-size/2）

**关于font-size:**

1. html的line-height为1.5
2. 当浏览器窗口宽度<992px时，font-size为14px
3. 当>=992px并且小于<1200px时，font-size为14.5px
4. 当>=1200px时，font-size为15px

**关于栅格的边界值：**

1. 无论浏览器窗口宽度为多大，`s`类型都生效，包括`.s1`，`.offset-s1`，`.push-s1`，`.pull-s1`
2. 当>=601px时，`m`类型生效，包括`.m1`，`.offset-m1`，`.push-m1`，`.pull-m1`
3. 当>=993px时，`l`类型生效，包括`.l1`，`.offset-l1`，`.push-l1`，`.pull-l1`

**清除浮动**
由于`row`里面的`col`都是浮动元素，所以`row`无法包裹住里面的`col`。需要清除`col`的浮动：

```css
.row::after {
    content: "";
    display: table;
    clear: both;
  }
```

### 引用外部字体Roboto

同一种字体一般会有多种粗细的文件。
例如`Roboto`字体font-weight由小到大共包含以下几个文件：

1. Roboto-Thin
2. Roboto-Light
3. Roboto-Regular
4. Roboto-Medium
5. Roboto-Bold

通过font-face来定义字体，拿Roboto-Thin举例：

```scss
$roboto-font-path: "../fonts/roboto/" !default;
@font-face {
    font-family: "Roboto";
    src: local(Roboto Thin), url('#{$roboto-font-path}Roboto-Thin.eot');
    src: url("#{$roboto-font-path}Roboto-Thin.eot?#iefix") format('embedded-opentype'),
        url("#{$roboto-font-path}Roboto-Thin.woff2") format("woff2"),
        url("#{$roboto-font-path}Roboto-Thin.woff") format("woff"),
        url("#{$roboto-font-path}Roboto-Thin.ttf") format("truetype");

    font-weight: 200;
}
```

其中`font-family`都是同一个名字（自定义的）。`font-weight`也是自定义设置的。Roboto-Thin是200。也就是如果想显示Roboto-Thin的字体，就要在css中设置`font-weight`为200（也就是说font-family是同一个，如果要选择用那种粗细的外部字体，只能通过font-weight来区分）

### 使用flex布局进行垂直居中对齐

```html
<div class="box">
  <span class="inner">hello world</span>
</div>
```

```css
.box {
      display: flex;
      align-items: center;
      width: 500px;
      height: 300px;
      background-color: #eee;
    }

    .inner {
      width: 100%;
      text-align: center;
    }
```

[完整代码](http://plnkr.co/edit/SfhbkOV6eFCsfJy624Ne)

### 用`...`截断长字符串

文本超出长度后使用`...`来截断。

```css
.truncate {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

### Hover实现阴影效果

应该把`transition`属性放在初始属性的class中。当有`transition`指定的属性变化时，会产生动画。（本身transition不会产生动画，只有外部作用时才会生效，比如hover时，或者通过js触发时）

```css
.card {
      margin: 50px auto;
      width: 200px;
      height: 100px;
      background: gold;
      box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);//初始的阴影
      transition: box-shadow .25s;//当box-shadow属性变化时生效
    }

    .card:hover {
      box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);//变化后的阴影
    }
```

[完整代码](http://plnkr.co/edit/twphzXvXSeeBLjXpZfV1)

### 阴影

`.z-depth-n`class都是由两层阴影组成，并遵循以下的规则：

* 内层阴影模糊半径比外层半径小
* 外层的颜色要比内层的颜色浅（外层的透明度比内层的透明度小）
* 阴影的水平距离都是0，阴影的垂直距离<模糊距离，第四个参数spread-radius也为0

```css
.z-depth-1{
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}
.z-depth-5{
  box-shadow: 0 27px 24px 0 rgba(0, 0, 0, 0.2), 0 40px 77px 0 rgba(0, 0, 0, 0.22);
}
```
