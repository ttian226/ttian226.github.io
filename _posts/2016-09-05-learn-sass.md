---
layout:     post
title:      "Learn Sass"
subtitle:   "Sass深入学习"
date:       2016-09-05 12:00:00
author:     "wangxu"
header-img: "img/post-bg-js-version.jpg"
tags:
    - SASS
    - CSS
---

### &

用于伪类如`hover`等

```scss
a {
  font-weight: bold;
  text-decoration: none;
  &:hover { text-decoration: underline; }
}
```

编译后的css:

```css
a {
  font-weight: bold;
  text-decoration: none; }
  a:hover {
    text-decoration: underline; }
```

用作占位符，下面例子中`&`替换了外层的`a`：

```scss
a {
  body & { font-weight: normal; }
}
```

编译后的css:

```css
body a {
  font-weight: normal; }
```

使用`&`用作连接符

```scss
#main {
  color: black;
  &-sidebar { border: 1px solid; }
}
```

编译后的css:

```css
#main {
  color: black; }
  #main-sidebar {
    border: 1px solid; }
```


### namespace

CSS has quite a few properties that are in “namespaces;” for instance, font-family, font-size, and font-weight are all in the font namespace. In CSS, if you want to set a bunch of properties in the same namespace, you have to type it out each time. Sass provides a shortcut for this: just write the namespace once, then nest each of the sub-properties within it. For example:

```scss
.funky {
  font: {
    family: fantasy;
    size: 30em;
    weight: bold;
  }
}
```

编译后的css:

```css
.funky {
  font-family: fantasy;
  font-size: 30em;
  font-weight: bold; }
```

### #{}

可以在选择器和属性名上使用`$`定义的变量。通过`#{}`来引用已经定义的变量，如下：

```scss
$name: foo;
$attr: border;
p.#{$name} {
  #{$attr}-color: blue;
}
```

编译后的css:

```css
p.foo {
  border-color: blue; }
```

### @extend

可以使用`@extend`来继承公共的样式，如下：

```scss
.error {
  border: 1px #f00;
  background-color: #fdd;
}

.seriousError {
  @extend .error;
  border-width: 3px;
}
```

这时`seriousError`也具有了`error`的样式，编译后的css:

```css
.error, .seriousError {
  border: 1px #f00;
  background-color: #fdd; }

.seriousError {
  border-width: 3px; }
```

### !default

使用`$`定义的变量，后面的值会覆盖前面的值，如下：

```scss
$content: 'first';
$content: 'second';
#main {
  content: $content;
}
```

编译后如下：

```css
#main {
  content: "second"; }
```

如果后面定义的`$content`结尾使用了`!default`，则不会覆盖前面的值。

```scss
$content: 'first';
$content: 'second' !default;
#main {
  content: $content;
}
```

编译后如下，first没有被覆盖。使用`!default`可以保证变量不会覆盖以前同名的变量。

```css
#main {
  content: "first"; }
```

如果变量的值为`null`则`!default`会认为它是一个未赋值的变量，并去覆盖这个变量的值。

```scss
$content: null;
$content: "Non-null content" !default;
#main {
  content: $content;
}
```

编译后：

```css
#main {
  content: "Non-null content"; }
```

### 数据类型

SassScript支持7种数据类型：

* numbers (e.g. 1.2, 13, 10px)
* strings of text, with and without quotes (e.g. "foo", 'bar', baz)
* colors (e.g. blue, #04a3f9, rgba(255, 0, 0, 0.5))
* booleans (e.g. true, false)
* nulls (e.g. null)
* lists of values, separated by spaces or commas (e.g. 1.5em 1em 0 2em, Helvetica, Arial, sans-serif)
* maps from one value to another (e.g. (key1: value1, key2: value2))

#### Strings

CSS specifies two kinds of strings: those with quotes, such as `"Lucida Grande"` or `'http://sass-lang.com'`, and those without quotes, such as `sans-serif` or `bold`. 

#### Lists

Lists are how Sass represents the values of CSS declarations like `margin: 10px 15px 0 0` or `font-face: Helvetica, Arial, sans-serif`. Lists are just a series of other values, separated by either spaces or commas.

[SassScript list functions](http://sass-lang.com/documentation/Sass/Script/Functions.html#list-functions)

#### Maps

map是用圆括号包含键值对：`(key1: value1, key2: value2, key3: value3)`

[SassScript map functions](http://sass-lang.com/documentation/Sass/Script/Functions.html#map-functions)

#### Colors

Any CSS color expression returns a SassScript Color value. This includes [a large number of named colors](https://github.com/sass/sass/blob/stable/lib/sass/script/value/color.rb#L28-L180) which are indistinguishable from unquoted strings.

### Control Directives & Expressions

#### @if

```scss
$type: monster;
p {
  @if $type == ocean {
    color: blue;
  } @else if $type == matador {
    color: red;
  } @else if $type == monster {
    color: green;
  } @else {
    color: black;
  }
}
```

编译后：

```css
p {
  color: green; }
```

#### @each

The `@each` directive usually has the form `@each $var in <list or map>`. `$var` can be any variable name, like `$length` or `$name`, and `<list or map>`` is a SassScript expression that returns a list or a map.

用`@each`遍历一个lists：

```scss
@each $animal in puma, sea-slug, egret, salamander {
  .#{$animal}-icon {
    background-image: url('/images/#{$animal}.png');
  }
}
```

编译后：

```css
.puma-icon {
  background-image: url("/images/puma.png"); }

.sea-slug-icon {
  background-image: url("/images/sea-slug.png"); }

.egret-icon {
  background-image: url("/images/egret.png"); }

.salamander-icon {
  background-image: url("/images/salamander.png"); }
```

### Function Directives

使用`@function`定义函数。使用`@return`返回函数的值。

```scss
$grid-width: 40px;
$gutter-width: 10px;

@function grid-width($n) {
  @return $n * $grid-width + ($n - 1) * $gutter-width;
}

#sidebar {
  width: grid-width(5);
}
```

编译后：

```css
#sidebar {
  width: 240px; }
```








