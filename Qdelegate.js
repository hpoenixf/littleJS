//inspired by oui-dom-events https://github.com/oneuijs/oui-dom-events/blob/master/src/index.js


function $q(selector) {
    // 使用全局变量来保存获取的对象。
    if(window.$qObj===undefined){
        window.$qObj ={}
    }
    //将选择器替换为可用的变量名，按需要再扩展，已经匹配 '#' '.' ' ' '+'  ':''
    var sel2pro = selector.replace(/\#/g, "$ID").replace(/\./g, "$CL").replace(/\s/g, "$SS").replace(/\+/g, "$AD").replace(/\:/g, "$CO")
    if (window.$qObj[sel2pro]===undefined) {
        var el = document.querySelectorAll(selector)
        window.$qObj[sel2pro] = new onObj(el)
    }
    return window.$qObj[sel2pro]

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
//$q('#ntp-contents').on('click', 'div', fn)
//可以使用匿名函数，可以链式绑定
//如果要解除事件代理，不能绑定匿名函数

