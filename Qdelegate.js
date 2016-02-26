//inspired by oui-dom-events https://github.com/oneuijs/oui-dom-events/blob/master/src/index.js
function $q(selector) {
    // 使用全局变量来保存获取的对象。若不存在则新建变量
    window.$qObj = window.$qObj || {}
        //将选择器替换为可用的变量名，按需要再扩展，已经匹配 '#' '.' ' ' '+'  ':''
    var sel2pro = selector.replace(/\#/g, "$ID").replace(/\./g, "$CL").replace(/\s/g, "$SS").replace(/\+/g, "$AD").replace(/\:/g, "$CO")

    if (window.$qObj[sel2pro] === undefined) {
        window.$qObj[sel2pro] = new onObj(document.querySelectorAll(selector))
    }
    return window.$qObj[sel2pro]

    function onObj(el) {
        this.el = el
        this.fn = []
        this.fnName = []
        var self = this
        onObj.prototype.on = function() {
            bindEvent.apply(this, arguments)
            return this
        }
        onObj.prototype.once = function() {
            var arg = [].slice.call(arguments)
            arg.push(true)
            bindEvent.apply(self, arg)
            return this
        }
        onObj.prototype.off = function(eve, fn) {
            fn = !(fn instanceof Function) && arguments[2] ? arguments[2] : fn
            var el = this.el;
            var index = this.fnName.indexOf(eve + '&' + fn.name)
            if (index !== -1) {
                for (var j = 0; j < el.length; j++) {
                    removeEvent(el[j], eve, this.fn[index])
                }
                this.fn.splice(index, 1)
                this.fnName.splice(index, 1)
            }
            return this
        }
        onObj.prototype.fire = function(eve, selector) {
            var el = self.el
            var target = [];
            if (selector) {
                
                var sel = document.querySelectorAll(selector);
                // 同样是使用contains来判断，不使用冒泡,ie8不支持forEach，真坑爹
                for (var k = 0; k < el.length; k++) {
                    for (var j = 0; j < sel.length; j++) {
                        if (el[k].contains(sel[j])) {
                            target.push(sel[j])
                        }
                    }
                }
            }else {
                target = el
            }
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent(eve, true, true);

            for (var i = 0; i < target.length; i++) {
                target[i].dispatchEvent(evt);
            }
        }
    }

    function addEvent(ele, eve, fn) {
        if (window.addEventListener) {
            ele.addEventListener(eve, fn);
        } else if (window.attachEvent) {
            ele.attachEvent("on" + eve, fn);
        }
        return this;
    }

    function removeEvent(ele, eve, fn) {

        if (window.addEventListener) {
            ele.removeEventListener(eve, fn);
        } else if (window.attachEvent) {
            ele.detachEvent("on" + eve, fn);
        }
        return this;
    }

    function bindEvent(eve, selector, fn, once) {

        var el = this.el;
        var els;
        if (selector instanceof Function) {
            fn = selector;
            els = el
        } else {
            els = document.querySelectorAll(selector)
        }
        var matched;
        this.fnName.push(eve + '&' + fn.name)
        var that = this
        this.fn.push(function(e) {
            e = e || window.event
            target = e.target || e.srcElement
            for (var i = 0; i < els.length; i++) {
                var _el = els[i]
                if (_el === target || _el.contains(target)) {
                    matched = _el;
                    break;
                }
            }
            if (matched) {
                fn.apply(matched, [].slice.call(arguments));
                //黑科技callee
                if (once) {
                    for (var j = 0; j < el.length; j++) {
                        el[j].removeEventListener(eve, arguments.callee)
                    }
                    var index = that.fnName.indexOf(fn.name)
                    that.fn.splice(index, 1)
                    that.fnName.splice(index, 1)
                }
            }
        })
        for (var j = 0; j < el.length; j++) {
            addEvent(el[j], eve, this.fn[this.fn.length - 1])
        }

    }
}



//可以使用匿名函数，可以链式绑定
//如果要解除事件代理，不能绑定匿名函数
//once是只响应一次的事件，严格模式不支持，once事件也可以取消

//example
// function con() { console.log(this) }

// function bon() { console.log(new Date) }

// $q('body').on('click', 'div', con)
    // $q('body').once('click', 'div', bon)
    // $q('body').off('click', 'div', bon)
