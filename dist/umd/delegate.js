(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./dom"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./dom"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.dom);
    global.delegate = mod.exports;
  }
})(this, function (_exports, _dom) {
  'use strict';

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = _exports.getDelegateTarget = _exports.preventDefault = _exports.stopPropagation = _exports.stop = _exports.off = _exports.once = _exports.on = void 0;

  /**
   * @description delegate 模块是在 Nicolas Gallagher 的 delegate.js 修改而来的
   * @see https://github.com/necolas/delegate.js
   */

  /**
   * 绑定代理事件
   * ========================================================================
   * @param {HTMLElement} el - 绑定代理事件的 DOM 节点
   * @param {String} selector - 触发 el 代理事件的 DOM 节点的选择器
   * @param {String} type - 事件类型
   * @param {Function} callback - 绑定事件的回调函数
   * @param {Object} [context] - callback 回调函数的 this 上下文（默认值：el）
   * @param {Boolean} [capture] - 是否采用事件捕获（默认值：false - 事件冒泡）
   * @param {Boolean} [once] - 是否只触发一次（默认值：false - 事件冒泡）
   * @returns {Function}
   */
  var on = function on(el, selector, type, callback, context, capture,
  /* private */
  once) {
    var wrapper = function wrapper(e) {
      var delegateTarget = getDelegateTarget(el, e.target, selector);
      e.delegateTarget = delegateTarget;

      if (delegateTarget) {
        if (once === true) {
          off(el, type, wrapper);
        }

        callback.call(context || el, e);
      }
    };

    if (type === 'mouseenter' || type === 'mouseleave') {
      capture = true;
    }

    callback._delegateWrapper = callback;
    el.addEventListener(type, wrapper, capture || false);
    return callback;
  };
  /**
   * 绑定只触发一次的事件
   * ========================================================================
   * @param {HTMLElement} el - 绑定代理事件的 DOM 节点
   * @param {String} selector - 触发 el 代理事件的 DOM 节点的选择器
   * @param {String} type - 事件类型
   * @param {Function} callback - 绑定事件的回调函数
   * @param {Object} [context] - callback 回调函数的 this 上下文（默认值：el）
   * @param {Boolean} [capture] - 是否采用事件捕获（默认值：false - 事件冒泡）
   * @returns {Function}
   */


  _exports.on = on;

  var once = function once(el, type, selector, callback, context, capture) {
    return on(el, type, selector, callback, context, capture, true);
  };
  /**
   * 取消事件绑定
   * ========================================================================
   * @param {HTMLElement} el - 取消绑定（代理）事件的 DOM 节点
   * @param {String} type - 事件类型
   * @param {Function} callback - 绑定事件的回调函数
   * @param {Boolean} [capture] - 是否采用事件捕获（默认值：false - 事件冒泡）
   */


  _exports.once = once;

  var off = function off(el, type, callback, capture) {
    if (callback._delegateWrapper) {
      callback = callback._delegateWrapper;
      delete callback._delegateWrapper;
    }

    if (type === 'mouseenter' || type === 'mouseleave') {
      capture = true;
    }

    el.removeEventListener(type, callback, capture || false);
  };
  /**
   * 停止事件（阻止默认行为和阻止事件的捕获或冒泡）
   * ========================================================================
   * @param {Event} evt - 事件对象
   */


  _exports.off = off;

  var stop = function stop(evt) {
    stopPropagation(evt);
    preventDefault(evt);
  };
  /**
   * 终止事件在传播过程的捕获或冒泡
   * ========================================================================
   * @param {Event} evt - 事件对象
   */


  _exports.stop = stop;

  var stopPropagation = function stopPropagation(evt) {
    var event = window.event;

    if (evt.stopPropagation) {
      evt.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  };
  /**
   * 阻止事件的默认行为
   * ========================================================================
   * @param {Event} evt - 事件对象
   */


  _exports.stopPropagation = stopPropagation;

  var preventDefault = function preventDefault(evt) {
    var event = window.event;

    if (evt.preventDefault) {
      evt.preventDefault();
    } else {
      event.returnValue = false;
    }
  };
  /**
   * 通过 className 获得事件代理节点的事件代理目标节点
   * ========================================================================
   * @param {HTMLElement} el - 绑定事件代理的节点
   * @param target - （触发事件后）事件的目标对象
   * @param selector - 目标节点的类选择器
   * @returns {HTMLElement|Null}
   */


  _exports.preventDefault = preventDefault;

  var getDelegateTarget = function getDelegateTarget(el, target, selector) {
    while (target && target !== el) {
      if ((0, _dom.hasClass)(target, selector.replace('.', ''))) {
        return target;
      }

      target = target.parentElement;
    }

    return null;
  };

  _exports.getDelegateTarget = getDelegateTarget;
  var Delegate = {
    on: on,
    once: once,
    off: off,
    stop: stop,
    stopPropagation: stopPropagation,
    preventDefault: preventDefault
  };
  var _default = Delegate;
  _exports["default"] = _default;
});