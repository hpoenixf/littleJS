function uniqArr(arr) {
    if (arr.length > 1) {
        arr.sort((a, b) => a - b)
        var last = arr[0]
        var uniq = []
        uniq[0] = last
        for (var i = 1; i < arr.length; i++) {
            if (arr[i] !== last) {
                uniq.push(arr[i]);
                last = arr[i]
            }
        }
        return uniq
    } else {
        return arr
    }
}

//利用对象属性的哈希特性
function uniq(arr) {
    'use strict'
    const obj = {}
    arr.forEach(function(i) {
        if (obj[i] === undefined) { obj[i] = i }
    })
    return Object.keys(obj).map(j => Number(j))
}

// 返回数组最大最小值 
function maxArr(arr) {
    return (arr && arr instanceof Array) ? Math.max.apply(null, arr) : false
}

function minArr(arr) {
    return (arr && arr instanceof Array) ? Math.min.apply(null, arr) : false
}

// 打乱数组，快排有用？
function shuffle(arr) {
    if (!arr && arr instanceof Array) {
        return false
    }
    var len = arr.length
    var randVal
    var rand 
    var nArr = []
    for (var i = 0; i < len; i++) {
        (function(i) {
            rand = Math.floor(Math.random() * (i + 1))
            nArr[i] = nArr[rand]
            nArr[rand] = arr[i]
        }(i))
    }
    return nArr
}
// 主要用于arguments
function toArray(arg) {
    return Array.prototype.slice.call(arg)
}





var arr = [1, 3, 4, 1, 6, 7, 1]

console.log(shuffle(arr))
