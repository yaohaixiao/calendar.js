'use strict'

/**
 * 判断是否为 String 类型
 * ========================================================================
 * @param {*} o - 要测试的数据
 * @returns {boolean}
 */
export const isString = (o) => {
  return typeof o === 'string'
}

/**
 * 判断是否为 Number 类型
 * ========================================================================
 * @param {*} o - 要测试的数据
 * @returns {boolean}
 */
export const isNumber = (o) => {
  return typeof o === 'number'
}

/**
 * 判断是否为 Array 类型
 * ========================================================================
 * @param {*} o - 要测试的数据
 * @returns {boolean}
 */
export const isArray = (o) => {
  if (Array.isArray) {
    return Array.isArray(o)
  } else {
    return Object.prototype.toString.apply(o) === '[object Array]'
  }
}

/**
 * 判断是否为 Function 类型
 * ========================================================================
 * @param {*} o - 要测试的数据
 * @returns {boolean}
 */
export const isFunction = (o) => {
  return (typeof o === 'function') || Object.prototype.toString.apply(o) === '[object Function]'
}

/**
 * 检测是否为 HTMLElement 元素节点
 * ========================================================================
 * @param {*} o - 要测试的数据
 * @returns {boolean}
 */
export const isElement = (o) => {
  return o && o.nodeName && o.tagName && o.nodeType === 1
}

/**
 * 移除字符串两端的空白
 * ========================================================================
 * @param {String} str - 要处理的字符串
 * @returns {string}
 */
export const trim = (str) => {
  return str.replace(/^\s+/g, '').replace(/\s+$/g, '')
}

/**
 * 移除字符串中的 HTML 代码
 * ========================================================================
 * @param {String} str - 要处理的字符串
 * @returns {*|void|string}
 */
export const stripTags = (str) => {
  return str.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?(\/)?>|<\/\w+>/gi, '')
}

/**
 * 移除字符串中的 script 代码片段
 * ========================================================================
 * @param {String} str - 要处理的字符串
 * @returns {*|void|string}
 */
export const stripScripts = (str) => {
  let scriptFragment = '<script[^>]*>([\\S\\s]*?)<\/script\\s*>'

  return str.replace(new RegExp(scriptFragment, 'img'), '')
}

/**
 * 过滤字符串中的危险字符
 * ========================================================================
 * @param {String} str - 要处理的字符串
 * @returns {string}
 */
export const toSafeText = (str) => {
  return trim(stripTags(stripScripts(str)))
}

/**
 * 简单粗暴的数据拷贝
 * ========================================================================
 * @param {Object|Array} o - 要拷贝的数据（对象）
 * @returns {any}
 */
export const clone = (o) => {
  return JSON.parse(JSON.stringify(o))
}

/**
 * 生成 GUID 编号
 * ========================================================================
 * @param {Number} len - 生成的编号长度
 * @param {Number} [radix] - 编码类型的数值
 * @returns {string}
 */
export const guid = (len, radix) => {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = []
  let i

  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | Math.random() * radix]
    }
  } else {
    // rfc4122, version 4 form
    let r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}

const Utils = {
  isArray,
  isElement,
  isFunction,
  isNumber,
  isString,
  trim,
  stripScripts,
  stripTags,
  toSafeText,
  clone,
  guid
}

export default Utils
