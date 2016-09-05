---
layout:     post
title:      "Learn Sass"
subtitle:   "Sass入门"
date:       2016-09-04 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - SASS
    - CSS
---

### Variables

使用`$`来定义变量

scss：

```scss
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```

编译后的css:

```css
body {
  font: 100% Helvetica, sans-serif;
  color: #333; }
```

### Nesting

scss：

```scss
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: inline-block;
  }

  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }
}
```

编译后的css:

```css
nav ul {
  margin: 0;
  padding: 0;
  list-style: none; }
nav li {
  display: inline-block; }
nav a {
  display: block;
  padding: 6px 12px;
  text-decoration: none; }
```

### Partials

使用下划线`_`定义Sass模块。例如`_partial.scss`。使用`@import`来导入模块。

### Import

使用`@import`来导入模块，例如有两个Sass文件`_reset.scss`和`base.scss`。我们把`_reset.scss`导入到`base.scss`中。

_reset.scss:

```scss
html,
body,
ul,
ol {
  margin: 0;
  padding: 0;
}
```

base.scss:

```scss
@import "reset";

body {
  font: 100% Helvetica, sans-serif;
  background-color: #efefef;
}
```

注意这里使用`@import 'reset'`来导入，既没有下划线`_`又不带后缀`.scss`。编译后的css:

```css
html,
body,
ul,
ol {
  margin: 0;
  padding: 0; }

body {
  font: 100% Helvetica, sans-serif;
  background-color: #efefef; }
```

### Mixins

使用`@mixin`关键字来定义。

使用关键字`@mixin`定义一个名为`border-radius`的方法，允许传入参数。需要使用`@include`来引入`@mixin`定义的方法，如下：

```scss
@mixin border-radius($radius) {
  -webkit-border-radius: $radius;
  -moz-border-radius: $radius;
  -ms-border-radius: $radius;
  border-radius: $radius;
}

.box {
  @include border-radius(10px);
}
```

编译后的css:

```css
.box {
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  -ms-border-radius: 10px;
  border-radius: 10px; }
```

### Extend

使用`@extend`关键字来分享公共样式。下面例子中`.success``.error``.warning`都包含`.message`中的样式。

```scss
.message {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

.success {
  @extend .message;
  border-color: green;
}

.error {
  @extend .message;
  border-color: red;
}

.warning {
  @extend .message;
  border-color: yellow;
}
```

编译后的css:

```css
.message, .success, .error, .warning {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333; }

.success {
  border-color: green; }

.error {
  border-color: red; }

.warning {
  border-color: yellow; }
```

### Operators

Sass中允许使用标准的算术运算符，如`+``-``*``/`和`%`。

```scss
.container { width: 100%; }

article[role="main"] {
  float: left;
  width: 600px / 960px * 100%;
}

aside[role="complementary"] {
  float: right;
  width: 300px / 960px * 100%;
}
```

编译后的css:

```css
.container {
  width: 100%; }

article[role="main"] {
  float: left;
  width: 62.5%; }

aside[role="complementary"] {
  float: right;
  width: 31.25%; }
```

