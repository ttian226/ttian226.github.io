---
layout:     post
title:      "TS基本数据类型"
subtitle:   ""
date:       2017-11-20 12:00:00
author:     "wangxu"
header-img: "img/post-bg-Tokyo-City.jpg"
tags:
    - TypeScript
---

### Boolean

```typescript
let isDone: boolean = false;
```

### Number

```typescript
let decimal: number = 10;
```

### String

```typescript
let color: string = 'red';
```

也可以使用模板字符串，例如：

```typescript
let fullName: string = `Bob Bobbington`;
let age: number = 37;
let sentence: string = `Hello, my name is ${fullName}.

I'll be ${age + 1} years old next month.`;
```

### Array

TypeScript允许你使用以下两种方式来定义数组，第一种使用`elemType[]`来定义：

```typescript
let list: number[] = [1, 2, 3];
```

第二种使用`Array<elemType>`来定义：

```typescript
let list: Array<number> = [1, 2, 3];
```

### Tuple（元组）

元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。

```typescript
// 声明一个元组
let x: [string, number];
// 正确的初始化
x = ['hello', 10]; // OK
// 错误的初始化
x = [10, 'hello']; // Error
```

当访问一个已知索引的元素，会得到正确的类型

```typescript
console.log(x[0].substr(1)); // OK
console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'
```

当访问一个越界的元素，会使用联合类型来替代

```typescript
x[3] = 'world'; // OK 字符串可以赋给（String | Number）类型
console.log(x[5].toString()); // OK 'String','Number'都有toString方法
x[6] = true; // Error 布尔不是（String | Number）类型
```

### Enum（枚举）

Enum类型是JavaScript标准数据类型的一个补充，使用枚举类型可以为一组数值赋予友好的名字。

```typescript
enum Color {Red, Green, Blue}
let c: Color = Color.Green; // c = 1
```

默认情况下，从0开始为元素编号，也可以手动指定成员的数值。例如：

```typescript
enum Color {Red = 1, Green, Blue}
let c: Color = Color.Green; // c = 2
```

甚至可以设置所有成员的值：

```typescript
enum Color {Red = 1, Green = 2, Blue = 4}
let c: Color = Color.Green;
```

还可以通过数值来返回它对应的名字：

```typescript
enum Color {Red = 1, Green, Blue}
let colorName: string = Color[2]; // colorName = 'Green'
```

### Any

我们需要描述一种这样一种类型，在我们写一个应用时不知道它的类型是什么。这些值也许是来自动态的内容，例如来自其它用户或第三方库的。这种情况下我们不需要进行类型检查而是让它通过编译阶段的检查。我们使用`any`来标记这些变量。

```typescript
let notSure: any = 4;
notSure = 'maybe a string instead';
notSure = false;
```

不要使用`Object`来代替`any`，Object允许你赋予任何值，但不允许调用它的方法，即使这个方法本来就存在。

```typescript
let notSure: any = 4;
let notSure: any = 4;
notSure.ifItExists(); // OK ifItExists也许在运行时存在
notSure.toFixed(); // OK toFixed存在，但编译器不会检查

let prettySure: Object = 4;
prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.
```

用于定义包含多种数据类型的数组

```typescript
let list: any[] = [1, true, 'free'];
```

### Void

`void`和`any`正相反，它表示什么类型都没有，你通常会看到一个不返回任何值的函数：

```typescript
function warnUser(): void {
    alert('This is my warning message');
}
```

给变量声明`void`类型没有什么用，因为你只能赋给它`undefined`或`null`

```typescript
let unusable: void = undefined;
```

### Null and Undefined

在TypeScript中，`undefined`和`null`它们都有各自的类型`undefined`和`null`，但是用处不是很大。

```typescript
let u: undefined = undefined;
let n: null = null;
```

默认情况下，`undefined`和`null`是其它类型的子类型，这就意味着你可以把`undefined`和`null`赋值给像是`number`类型。

然而当使用了`--strictNullChecks`，`undefined`和`null`只能被赋予`void`或它们各自的类型。这将帮你避免一些常见的错误。

### Never

`never`表示哪些根本不会存在的类型。例如`never`用于函数表达式或箭头函数表达式中总是抛出异常的返回值。

```typescript
function error(message: string): never {
    throw new Error(message);
}
```

### Type assertions（断言）

有时候你会比TypeScript本身更清楚一个值的类型。断言就是告诉编译器“相信我，我知道自己在干什么”。断言有些像其它语言的强制类型转换，但没有特殊的数据类型检查和解构。它没有运行时刻的影响，只发生在编译阶段。TypeScript假设你是个程序员并且已经进行了必要的检查。

断言有两种形式，一是`尖括号`语法：

```typescript
let someValue: any = 'this is a string';
let strLength: number = (<string>someValue).length;
```

另一种是`as`语法：

```typescript
let someValue: any = 'this is a string';
let strLength: number = (someValue as string).length;
```

这两种方式是等价的。用哪一个取决于你的个人偏好，但是在JSX中只允许使用`as`语法。