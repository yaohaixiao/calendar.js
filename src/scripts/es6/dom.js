'use strict'

import {
  isArray,
  isString,
  isElement,
  isNumber,
  stripTags,
  trim
} from './utils'

/**
 * 创建 DOM 节点，并添加属性和子节点
 * ========================================================================
 * @param {String} tagName - 标签名称
 * @param {Object} attributes - 属性对象
 * @param {Array} [children] - 子节点数组
 * @returns {HTMLElement}
 */
export const createElement = (tagName, attributes, children) => {
  let element = document.createElement(tagName)

  for (let attr in attributes) {
    if (attributes.hasOwnProperty(attr)) {
      setAttribute(element, attr, attributes[attr])
    }
  }

  if (isArray(children)) {
    children.forEach((child) => {
      let childNode

      if (isElement(child)) {
        childNode = child
      } else {
        if (isString(child) || isNumber(child)) {
          let text = isString(child) ? trim(stripTags(child)) : child.toString()

          childNode = document.createTextNode(text)
        }
      }

      element.appendChild(childNode)
    })
  }

  return element
}

/**
 * 给 DOM 节点设置属性/值
 * ========================================================================
 * @param {Object|HTMLElement} el - DOM 节点
 * @param {String} attr - 属性名称
 * @param {String|Number|Boolean} value - 属性值
 */
export const setAttribute = (el, attr, value) => {
  let tagName = el.tagName.toLowerCase()

  switch (attr) {
    case 'style':
      el.style.cssText = value
      break
    case 'value':
      if (tagName === 'input' || tagName === 'textarea') {
        el.value = value
      } else {
        el.setAttribute(attr, value)
      }
      break
    case 'className':
      el.className = value
      break
    default:
      el.setAttribute(attr, value)
      break
  }
}

/**
 * 检测 DOM 节点是否包含名为 className 的样式
 * ========================================================================
 * @param {Object|HTMLElement} el - DOM 节点
 * @param {String} className - 样式名称
 * @returns {*}
 */
export const hasClass = (el, className) => {
  let allClass = el.className

  if (!allClass) {
    return false
  }

  return allClass.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

/**
 * 给 DOM 节点添加名为 className 的样式
 * ========================================================================
 * @param {Object|HTMLElement} el - DOM 节点
 * @param {String} className - 样式名称
 * @returns {Boolean}
 */
export const addClass = (el, className) => {
  let allClass = el.className

  if (hasClass(el, className)) {
    return false
  }

  allClass += allClass.length > 0 ? ' ' + className : className

  el.className = allClass
}

/**
 * 移除 DOM 节点的 className 样式
 * ========================================================================
 * @param {Object|HTMLElement} el - DOM 节点
 * @param {String} className - 样式名称
 * @returns {Boolean}
 */
export const removeClass = (el, className) => {
  let allClass = el.className

  if (!allClass || !hasClass(el, className)) {
    return false
  }

  allClass = trim(allClass.replace(className, ''))

  el.className = allClass
}

/**
 * 替换 DOM 节点的 className 样式
 * ========================================================================
 * @param {Object|HTMLElement} el - DOM 节点
 * @param {String} newClass - 样式名称
 * @param {String} oldClass - 样式名称
 * @returns {Boolean}
 */
export const replaceClass = (el, newClass, oldClass) => {
  let allClass = el.className

  if (!allClass || !hasClass(el, oldClass)) {
    return false
  }

  allClass = trim(allClass.replace(oldClass, newClass))

  el.className = allClass
}

const DOM = {
  createElement,
  setAttribute,
  hasClass,
  addClass,
  removeClass,
  replaceClass
}

export default DOM
