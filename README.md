## 简介
最近在使用anki 记单词，作为一款优秀的记忆软件，我不满足于只是用它来记单词，我还要记录工作中、生活中需要记忆的一些文档，概念等。
不过anki 添加卡片效率不是很高，我平时写文档使用的是Markdown，所以我希望能把Markdown 一键导入到anki，这样能节省添加卡片的时间（事实上，如果没有这个工具，我是懒得去自己添加卡片的，不想干那种毫无技术含量却耗时耗力的事情）。

## 使用方式
1、为anki添加AnkiConnect组件，这样就可以在本地通过api操作anki了

https://ankiweb.net/shared/info/2055492159

2、下载代码
```js
git clone git@github.com:mcgtts/md2anki.git
cd md2anki 
npm install
```

3、添加一个新的笔记类型，加通用样式
```js
./bin/md2anki init
```

4、回到anki首页，创建一个deck，比如叫”自定义Deck“，名称需要写到代码里

5、写Markdown文件
随便找个地方，建一个目录，可以在目录中建md文件，格式只对title部分有要求要求，下面是个例子
```md
---
title: JavaScript 中的强制转型（coercion）是指什么？
---

难度：0

在 JavaScript 中，两种不同的内置类型间的转换被称为强制转型。强制转型在 JavaScript 中有两种形式：显式和隐式。
这是一个显式强制转型的例子：

var a = "42";
var b = Number( a );
a;                // "42"
b;                // 42 -- 是个数字!

这是一个隐式强制转型的例子：

var a = "42";
var b = a * 1;    // "42" 隐式转型成 42 
a;                // "42"
b;                // 42 -- 是个数字!

```


6、运行脚本
要求node version > 8.1
```sh
./bin/md2anki import -d md文件目录
```

## TODO
- [ ] 支持自定义Deck
- [ ] 支持创建markdown文件

> 致谢
https://github.com/kanalun/markdown2html.git