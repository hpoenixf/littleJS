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
    }
    else {
        return arr
    }
}

//利用对象属性的哈希特性
function uniq(arr) {
    'use strict'
    const obj = {}
    arr.forEach(function(i) {
        if (obj[i]==='undefined') { obj[i] = i }
    })
    return Object.keys(obj).map(j=>Number(j))
}
