(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.utils = mod.exports;
  }
})(this, function (_exports) {
  'use strict';
  /**
   * 判断是否为 String 类型
   * ========================================================================
   * @param {*} o - 要测试的数据
   * @returns {boolean}
   */

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = _exports.guid = _exports.clone = _exports.toSafeText = _exports.stripScripts = _exports.stripTags = _exports.trim = _exports.isElement = _exports.isFunction = _exports.isArray = _exports.isNumber = _exports.isString = void 0;

  var isString = function isString(o) {
    return typeof o === 'string';
  };
  /**
   * 判断是否为 Number 类型
   * ========================================================================
   * @param {*} o - 要测试的数据
   * @returns {boolean}
   */


  _exports.isString = isString;

  var isNumber = function isNumber(o) {
    return typeof o === 'number';
  };
  /**
   * 判断是否为 Array 类型
   * ========================================================================
   * @param {*} o - 要测试的数据
   * @returns {boolean}
   */


  _exports.isNumber = isNumber;

  var isArray = function isArray(o) {
    if (Array.isArray) {
      return Array.isArray(o);
    } else {
      return Object.prototype.toString.apply(o) === '[object Array]';
    }
  };
  /**
   * 判断是否为 Function 类型
   * ========================================================================
   * @param {*} o - 要测试的数据
   * @returns {boolean}
   */


  _exports.isArray = isArray;

  var isFunction = function isFunction(o) {
    return typeof o === 'function' || Object.prototype.toString.apply(o) === '[object Function]';
  };
  /**
   * 检测是否为 HTMLElement 元素节点
   * ========================================================================
   * @param {*} o - 要测试的数据
   * @returns {boolean}
   */


  _exports.isFunction = isFunction;

  var isElement = function isElement(o) {
    return o && o.nodeName && o.tagName && o.nodeType === 1;
  };
  /**
   * 移除字符串两端的空白
   * ========================================================================
   * @param {String} str - 要处理的字符串
   * @returns {string}
   */


  _exports.isElement = isElement;

  var trim = function trim(str) {
    return str.replace(/^\s+/g, '').replace(/\s+$/g, '');
  };
  /**
   * 移除字符串中的 HTML 代码
   * ========================================================================
   * @param {String} str - 要处理的字符串
   * @returns {*|void|string}
   */


  _exports.trim = trim;

  var stripTags = function stripTags(str) {
    return str.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?(\/)?>|<\/\w+>/gi, '');
  };
  /**
   * 移除字符串中的 script 代码片段
   * ========================================================================
   * @param {String} str - 要处理的字符串
   * @returns {*|void|string}
   */


  _exports.stripTags = stripTags;

  var stripScripts = function stripScripts(str) {
    var scriptFragment = '<script[^>]*>([\\S\\s]*?)<\/script\\s*>';
    return str.replace(new RegExp(scriptFragment, 'img'), '');
  };
  /**
   * 过滤字符串中的危险字符
   * ========================================================================
   * @param {String} str - 要处理的字符串
   * @returns {string}
   */


  _exports.stripScripts = stripScripts;

  var toSafeText = function toSafeText(str) {
    return trim(stripTags(stripScripts(str)));
  };
  /**
   * 简单粗暴的数据拷贝
   * ========================================================================
   * @param {Object|Array} o - 要拷贝的数据（对象）
   * @returns {any}
   */


  _exports.toSafeText = toSafeText;

  var clone = function clone(o) {
    return JSON.parse(JSON.stringify(o));
  };
  /**
   * 生成 GUID 编号
   * ========================================================================
   * @param {Number} len - 生成的编号长度
   * @param {Number} [radix] - 编码类型的数值
   * @returns {string}
   */


  _exports.clone = clone;

  var guid = function guid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [];
    var i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) {
        uuid[i] = chars[0 | Math.random() * radix];
      }
    } else {
      // rfc4122, version 4 form
      var r; // rfc4122 requires these characters

      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4'; // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5

      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[i === 19 ? r & 0x3 | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  };

  _exports.guid = guid;
  var Utils = {
    isArray: isArray,
    isElement: isElement,
    isFunction: isFunction,
    isNumber: isNumber,
    isString: isString,
    trim: trim,
    stripScripts: stripScripts,
    stripTags: stripTags,
    toSafeText: toSafeText,
    clone: clone,
    guid: guid
  };
  var _default = Utils;
  _exports["default"] = _default;
});