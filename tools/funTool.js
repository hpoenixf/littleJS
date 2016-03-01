function delay(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function() {
        return func.apply(null, args);
    }, wait);
};


// 函数节流方法, throttle方法主要用于控制函数的执行频率, 在被控制的时间间隔内, 频繁调用函数不会被多次执行
// 在时间间隔内如果多次调用了函数, 时间隔截止时会自动调用一次, 不需要等到时间截止后再手动调用(自动调用时不会有返回值)
// throttle函数一般用于处理复杂和调用频繁的函数, 通过节流控制函数的调用频率, 节省处理资源
// 例如window.onresize绑定的事件函数, 或element.onmousemove绑定的事件函数, 可以用throttle进行包装
// throttle方法返回一个函数, 该函数会自动调用func并进行节流控制
function throttle(func, wait) {
    var context, args, timeout, throttling, more, result;
    // whenDone变量调用了debounce方法, 因此在多次连续调用函数时, 最后一次调用会覆盖之前调用的定时器, 清除状态函数也仅会被执行一次
    // whenDone函数在最后一次函数执行的时间间隔截止时调用, 清除节流和调用过程中记录的一些状态
    var whenDone = _.debounce(function() {
        more = throttling = false;
    }, wait);
    // 返回一个函数, 并在函数内进行节流控制
    return function() {
        // 保存函数的执行上下文和参数
        context = this;
        args = arguments;
        // later函数在上一次函数调用时间间隔截止时执行
        var later = function() {
            // 清除timeout句柄, 方便下一次函数调用
            timeout = null;
            // more记录了在上一次调用至时间间隔截止之间, 是否重复调用了函数
            // 如果重复调用了函数, 在时间间隔截止时将自动再次调用函数
            if (more)
                func.apply(context, args);
            // 调用whenDone, 用于在时间间隔后清除节流状态
            whenDone();
        };
        // timeout记录了上一次函数执行的时间间隔句柄
        // timeout时间间隔截止时调用later函数, later中将清除timeout, 并检查是否需要再次调用函数
        if (!timeout)
            timeout = setTimeout(later, wait);
        // throttling变量记录上次调用的时间间隔是否已经结束, 即是否处于节流过程中
        // throttling在每次函数调用时设为true, 表示需要进行节流, 在时间间隔截止时设置为false(在whenDone函数中实现)
        if (throttling) {
            // 节流过程中进行了多次调用, 在more中记录一个状态, 表示在时间间隔截止时需要再次自动调用函数
            more = true;
        } else {
            // 没有处于节流过程, 可能是第一次调用函数, 或已经超过上一次调用的间隔, 可以直接调用函数
            result = func.apply(context, args);
        }
        // 调用whenDone, 用于在时间间隔后清除节流状态
        whenDone();
        // throttling变量记录函数调用时的节流状态
        throttling = true;
        // 返回调用结果
        return result;
    };
}


// debounce与throttle方法类似, 用于函数节流, 它们的不同之处在于:
// -- throttle关注函数的执行频率, 在指定频率内函数只会被执行一次;
// -- debounce函数更关注函数执行的间隔, 即函数两次的调用时间不能小于指定时间;
// 如果两次函数的执行间隔小于wait, 定时器会被清除并重新创建, 这意味着连续频繁地调用函数, 函数一直不会被执行, 直到某一次调用与上一次调用的时间不小于wait毫秒
// debounce函数一般用于控制需要一段时间之后才能执行的操作, 例如在用户输入完毕200ms后提示用户, 可以使用debounce包装一个函数, 绑定到onkeyup事件
// ----------------------------------------------------------------
// @param {Function} func 表示被执行的函数
// @param {Number} wait 表示允许的时间间隔, 在该时间范围内重复调用会被重新推迟wait毫秒
// @param {Boolean} immediate 表示函数调用后是否立即执行, true为立即调用, false为在时间截止时调用
// debounce方法返回一个函数, 该函数会自动调用func并进行节流控制
function debounce(func, wait, immediate) {
    // timeout用于记录函数上一次调用的执行状态(定时器句柄)
    // 当timeout为null时, 表示上一次调用已经结束
    var timeout;
    // 返回一个函数, 并在函数内进行节流控制
    return function() {
        // 保持函数的上下文对象和参数
        var context = this,
            args = arguments;
        var later = function() {
            // 设置timeout为null
            // later函数会在允许的时间截止时被调用
            // 调用该函数时, 表明上一次函数执行时间已经超过了约定的时间间隔, 此时之后再进行调用都是被允许的
            timeout = null;
            if (!immediate)
                func.apply(context, args);
        };
        // 如果函数被设定为立即执行, 且上一次调用的时间间隔已经过去, 则立即调用函数
        if (immediate && !timeout)
            func.apply(context, args);
        // 创建一个定时器用于检查和设置函数的调用状态
        // 创建定时器之前先清空上一次setTimeout句柄, 无论上一次绑定的函数是否已经被执行
        // 如果本次函数在调用时, 上一次函数执行还没有开始(一般是immediate设置为false时), 则函数的执行时间会被推迟, 因此timeout句柄会被重新创建
        clearTimeout(timeout);
        // 在允许的时间截止时调用later函数
        timeout = setTimeout(later, wait);
    };
};

function once(func) {
    // ran记录函数是否被执行过
    // memo记录函数最后一次执行的结果
    var ran = false,
        memo;
    return function() {
        // 如果函数已被执行过, 则直接返回第一次执行的结果
        if (ran)
            return memo;
        ran = true;
        return memo = func.apply(this, arguments);
    };
};


// 函数第n次开始就不能执行，返回undefined..感觉好奇怪lodash作者的思路
function before(n, func) {
  var result;
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  return function() {
    if (--n > 0) {
     return result = func.apply(this, arguments);
    }
    if (n <= 1) {
      func = undefined;
    }
    return result;
  };
}

// 照搬至上面的before，函数最多可以执行n次
function doTimes(func,n) {
  var result;
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  return function() {
    if (--n > 0) {
     return result = func.apply(this, arguments);
    }
    if (n <= 0) {
      func = undefined;
    }
    return result;
  };
}

