// from vue source code


var camelizeRE = /-(\w)/g
export function camelize (str) {
  return str.replace(camelizeRE, toUpper)
}

function toUpper (_, c) {
  return c ? c.toUpperCase() : ''
}

/**
 * Hyphenate a camelCase string.
 *
 * @param {String} str
 * @return {String}
 */

var hyphenateRE = /([a-z\d])([A-Z])/g
export function hyphenate (str) {
  return str
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase()
}

/**
 * Converts hyphen/underscore/slash delimitered names into
 * camelized classNames.
 *
 * e.g. my-component => MyComponent
 *      some_else    => SomeElse
 *      some/comp    => SomeComp
 *
 * @param {String} str
 * @return {String}
 */

var classifyRE = /(?:^|[-_\/])(\w)/g
export function classify (str) {
  return str.replace(classifyRE, toUpper)
}



//限制输入框输入最大值

function lengthLimit(selector,limit) {
  [].slice.call(document.querySelectorAll(selector)).forEach(function(i){
    i.addEventListener('change',function(){
      if(i.value.length>limit) {
        i.value=i.value.substr(0,limit)
      }
    })
  })
}
