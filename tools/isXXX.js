function  isNum(number) {
    return number!==''&&!isNaN(''+number)
}



function isNum2(num) {
	return  ( /^\d*$/g).test(String(num))
}


function isObject(obj) {
    return obj !== null && typeof(obj) === 'object'
}
