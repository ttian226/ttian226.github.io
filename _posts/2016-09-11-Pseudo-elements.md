---
layout:     post
title:      "CSS Pseudo Elements"
subtitle:   ""
date:       2016-09-11 12:00:00
author:     "wangxu"
header-img: "img/post-bg-bridge.jpg"
tags:
    - CSS
---

### What are Pseudo-Elements?

A CSS pseudo-element is used to style specified parts of an element.

For example, it can be used to:

* Style the first letter, or line, of an element
* Insert content before, or after, the content of an element


### Syntax

The syntax of pseudo-elements:

```css
selector::pseudo-element {
    property:value;
}
```

**Notice** the double colon notation - `::first-line` versus `:first-line`


### The ::first-line Pseudo-element

The ::first-line pseudo-element is used to add a special style to the first line of a text.

The following example formats the first line of the text in all <p> elements:

```css
p::first-line {
    color: #ff0000;
    font-variant: small-caps;
}
```

**Note:** The `::first-line` pseudo-element can only be applied to block-level elements.

The following properties apply to the `::first-line` pseudo-element:

* font properties
* color properties
* background properties
* word-spacing
* letter-spacing
* text-decoration
* vertical-align
* text-transform
* line-height
* clear

### The ::first-letter Pseudo-element

The `::first-letter` pseudo-element is used to add a special style to the first letter of a text.

The following example formats the first letter of the text in all <p> elements: 

```css
p::first-letter {
    color: #ff0000;
    font-size: xx-large;
}
```

**Note:** The `::first-letter` pseudo-element can only be applied to block-level elements.

The following properties apply to the `::first-letter` pseudo- element: 

* font properties
* color properties 
* background properties
* margin properties
* padding properties
* border properties
* text-decoration
* vertical-align (only if "float" is "none")
* text-transform
* line-height
* float
* clear

### Multiple Pseudo-elements

Several pseudo-elements can also be combined.

In the following example, the first letter of a paragraph will be red, in an xx-large font size. The rest of the first line will be blue, and in small-caps. The rest of the paragraph will be the default font size and color:

```css
p::first-letter {
    color: #ff0000;
    font-size: xx-large;
}

p::first-line {
    color: #0000ff;
    font-variant: small-caps;
}
```

### CSS - The ::before Pseudo-element

The `::before` pseudo-element can be used to insert some content before the content of an element.

The following example inserts an image before the content of each <h1> element:

```css
h1::before {
    content: url(smiley.gif);
}
```

### CSS - The ::after Pseudo-element

The ::after pseudo-element can be used to insert some content after the content of an element.

The following example inserts an image after the content of each <h1> element:

```css
h1::after {
    content: url(smiley.gif);
}
```

### CSS - The ::selection Pseudo-element

The `::selection` pseudo-element matches the portion of an element that is selected by a user.

The following CSS properties can be applied to `::selection`: `color`, `background`, `cursor`, and `outline`.

The following example makes the selected text red on a yellow background:

```css
::selection {
    color: red; 
    background: yellow;
}
```
