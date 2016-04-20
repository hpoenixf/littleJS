function addMethod(obj,name,fn) {
	var old = obj[name] 
	obj[name] = function  () {
		arguments.length==fn.length?fn.apply(this.arguments):typeof old =='function'&&old.apply(this.arguments)
	}
}

//参考自js ninja 利用了闭包的原理来实现函数重载
