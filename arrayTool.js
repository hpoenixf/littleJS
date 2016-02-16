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

function uniq(arr) {
  var hash = {};
  var newA = [];
	for(var i = 0; i < arr.length; i++) {
	hash[arr[i]] == undefined && (hash[arr[i]] = arr[i])
	};
	for(var o in hash) {newA.push(o)} 
	return newA
}
