(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./utils"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./utils"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.utils);
    global.dom = mod.exports;
  }
})(this, function (_exports, _utils) {
  'use strict';

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = _exports.replaceClass = _exports.removeClass = _exports.addClass = _exports.hasClass = _exports.setAttribute = _exports.createElement = void 0;

  /**
   * 创建 DOM 节点，并添加属性和子节点
   * ========================================================================
   * @param {String} tagName - 标签名称
   * @param {Object} attributes - 属性对象
   * @param {Array} [children] - 子节点数组
   * @returns {HTMLElement}
   */
  var createElement = function createElement(tagName, attributes, children) {
    var element = document.createElement(tagName);

    for (var attr in attributes) {
      if (attributes.hasOwnProperty(attr)) {
        setAttribute(element, attr, attributes[attr]);
      }
    }

    if ((0, _utils.isArray)(children)) {
      children.forEach(function (child) {
        var childNode;

        if ((0, _utils.isElement)(child)) {
          childNode = child;
        } else {
          if ((0, _utils.isString)(child) || (0, _utils.isNumber)(child)) {
            var text = (0, _utils.isString)(child) ? (0, _utils.trim)((0, _utils.stripTags)(child)) : child.toString();
            childNode = document.createTextNode(text);
          }
        }

        element.appendChild(childNode);
      });
    }

    return element;
  };
  /**
   * 给 DOM 节点设置属性/值
   * ========================================================================
   * @param {Object|HTMLElement} el - DOM 节点
   * @param {String} attr - 属性名称
   * @param {String|Number|Boolean} value - 属性值
   */


  _exports.createElement = createElement;

  var setAttribute = function setAttribute(el, attr, value) {
    var tagName = el.tagName.toLowerCase();

    switch (attr) {
      case 'style':
        el.style.cssText = value;
        break;

      case 'value':
        if (tagName === 'input' || tagName === 'textarea') {
          el.value = value;
        } else {
          el.setAttribute(attr, value);
        }

        break;

      case 'className':
        el.className = value;
        break;

      default:
        el.setAttribute(attr, value);
        break;
    }
  };
  /**
   * 检测 DOM 节点是否包含名为 className 的样式
   * ========================================================================
   * @param {Object|HTMLElement} el - DOM 节点
   * @param {String} className - 样式名称
   * @returns {*}
   */


  _exports.setAttribute = setAttribute;

  var hasClass = function hasClass(el, className) {
    var allClass = el.className;

    if (!allClass) {
      return false;
    }

    return allClass.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
  };
  /**
   * 给 DOM 节点添加名为 className 的样式
   * ========================================================================
   * @param {Object|HTMLElement} el - DOM 节点
   * @param {String} className - 样式名称
   * @returns {Boolean}
   */


  _exports.hasClass = hasClass;

  var addClass = function addClass(el, className) {
    var allClass = el.className;

    if (hasClass(el, className)) {
      return false;
    }

    allClass += allClass.length > 0 ? ' ' + className : className;
    el.className = allClass;
  };
  /**
   * 移除 DOM 节点的 className 样式
   * ========================================================================
   * @param {Object|HTMLElement} el - DOM 节点
   * @param {String} className - 样式名称
   * @returns {Boolean}
   */


  _exports.addClass = addClass;

  var removeClass = function removeClass(el, className) {
    var allClass = el.className;

    if (!allClass || !hasClass(el, className)) {
      return false;
    }

    allClass = (0, _utils.trim)(allClass.replace(className, ''));
    el.className = allClass;
  };
  /**
   * 替换 DOM 节点的 className 样式
   * ========================================================================
   * @param {Object|HTMLElement} el - DOM 节点
   * @param {String} newClass - 样式名称
   * @param {String} oldClass - 样式名称
   * @returns {Boolean}
   */


  _exports.removeClass = removeClass;

  var replaceClass = function replaceClass(el, newClass, oldClass) {
    var allClass = el.className;

    if (!allClass || !hasClass(el, oldClass)) {
      return false;
    }

    allClass = (0, _utils.trim)(allClass.replace(oldClass, newClass));
    el.className = allClass;
  };

  _exports.replaceClass = replaceClass;
  var DOM = {
    createElement: createElement,
    setAttribute: setAttribute,
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    replaceClass: replaceClass
  };
  var _default = DOM;
  _exports["default"] = _default;
});