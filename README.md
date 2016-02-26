# littleJS



####存放一些上网找到的或者自己写的js文件

#####ie6,ie7 not support,some use es6

##Qdelegate

事件代理类似jquery的on方法。
使用形式为$q(selector).on(event[,selector],handle),$q(selector).off(event[,selector],handle)
使用兼容性良好的node.contains方法而不是事件冒泡。性能更强

目前支持on,off和once，可以使用匿名函数。
但如果需要解除绑定，则不能绑定匿名函数


##arrayTool 

关于数组的函数集合，目前有数组唯一化的函数



##DOMready

功能类似jQuery的$(document).ready。
可以在dom树解析完成时执行dom操作的函数，不用等到图片等资源加载再执行。

>参考自司徒正美的博客http://www.cnblogs.com/rubylouvre/p/4536334.html



##ChineseSort

应对不支持localecompare时需要中文排序的情况（某些型号的三星手机）。
参考自论坛的方法，做了包装和优化



##getCurInteractiveScript

获取正在运行的js文件。
来自司徒正美的书籍《js框架设计》



###etOwnPrototype

将对象中本身（非继承至原型）的属性和值以二维数组的形式返回。
有点接近Object.keys



##IE8cors

启用XDomainRequest，让IE8支持跨域。
照搬至博客,晚点整合进jQuery或是原生js

>http://mcgivery.com/ie8-and-cors/



##isXXX

类型判断。
来自网上或者自己的尝试



##mynodesql

自己写的关于mysql和nodejs交互的工具，免去拼sql的痛苦。





