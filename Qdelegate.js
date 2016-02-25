//inspired by oui-dom-events https://github.com/oneuijs/oui-dom-events/blob/master/src/index.js


function $q(selector) {
    var el = document.querySelectorAll(selector)
    return new onObj(el)

    function onObj(el) {
        this.el = el
        this.fn = []
        this.fnName = []
        onObj.prototype.on = function(eve, selector, fn) {
            var el = this.el;
            if (selector instanceof Function) {
                fn = selector;
                els = el
            } else {
                els = document.querySelectorAll(selector)
            }
            var matched;
            // 判断有无选择器            
            this.fn.push(
                function(e) {
                    for (var i = 0; i < els.length; i++) {
                        var _el = els[i]
                        if (_el === e.target || _el.contains(e.target)) {
                            matched = _el;
                            break;
                        }
                    }
                    if (matched) {
                        fn.apply(matched, [].slice.call(arguments));
                    }
                })
            this.fnName.push(fn.name)

            for (var j = 0; j < el.length; j++) {
                el[j].addEventListener(eve, this.fn[this.fn.length - 1])
            }
        }
        onObj.prototype.off = function(eve, fn) {
            fn = !(fn instanceof Function) && arguments[2] ? arguments[2] : fn

            var el = this.el;
            var index = this.fnName.indexOf(fn.name)
            if (index !== -1) {
                for (var j = 0; j < el.length; j++) {
                    el[j].removeEventListener(eve, this.fn[index])
                }
                this.fn.splice(index, 1)
            }
        }
    }
}




//example
//不接触的话，可以使用匿名函数，可以链式绑定
//$q('#ntp-contents').on('click', 'div', fn)
//如果要解除事件代理，不能绑定匿名函数，不能链式绑定，之后再接触
// var  a  = $q('#ntp-contents')
// a.on('click', 'div', fn)
//a.off('click', 'div', fn)
//
// 不支持这样
// $q('#ntp-contents').off('click', fn)
