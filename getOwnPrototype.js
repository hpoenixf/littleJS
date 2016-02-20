function getOwnProperty(obj) {

    var proName = [];
    var proValue = []
    for (var i  in obj) {
        if (obj.hasOwnProperty(i)) {
            proName.push(i)
            proValue.push(obj[i])
        }
    }
    return [proName,proValue]
}
