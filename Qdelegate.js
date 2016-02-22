
//inspired by oui-dom-events https://github.com/oneuijs/oui-dom-events/blob/master/src/index.js


function $q(selector) {
    var el = document.querySelectorAll(selector)
    return new onObj(el)
}

function onObj(el) {
    this.el = el
}

onObj.prototype.on = function(eve, selector, fn) {
    var el = this.el;
    // 判断有无选择器
    if (selector instanceof Function) {
        fn = selector;
        els = el
    } else {
        els = document.querySelectorAll(selector)
    }
    var matched;
    for (var j = 0; j < el.length; j++) {
        el[j].addEventListener(eve, function(e) {
            for (var i = 0; i < els.length; i++) {
                var _el = els[i]
                    // contains,node节点是否另一另一节点的父元素，来自司徒正美的js框架设计
                if (_el === e.target || _el.contains(e.target)) {
                    matched = _el;
                    break;
                }
            }
            if (matched) {
                fn.apply(matched, [].slice.call(arguments));
            }
        })
    }
}




//example
//$q('#ntp-contents').on('click', 'div', function() {
//    console.log(this)
//})
