'use strict'

import {
  isFunction,
  guid
} from './utils'

import {
  getYear,
  getMonth,
  getDate,
  getDay,
  getToday,
  getRanges,
  getWeekRanges,
  getYears,
  isDatesEqual,
  isToday,
  isLeapYear
} from './time'

import {
  createElement,
  hasClass,
  addClass,
  removeClass
} from './dom'

import {
  on,
  off
} from './delegate'

import 'babel-polyfill'

/**
 * Calendar 类
 */
class Calendar {
  /**
   * 构造函数
   * ========================================================================
   * @constructor
   * @param {Object} [options] - 日历控件的配置参数
   * @param [options.parent] - 日历显示的位置（DOM 节点 ID）
   * @param [options.time] - 日历初始化显示的时间
   * @param [options.viewMode] - 日历的试图模式：0 - 日期试图（默认值）
   *                                           1 - 月份试图
   *                                           2 - 年代试图
   * @param [options.pickMode] - 日历的日期选择模式: single - 单选模式（默认值）
   *                                               multiple - 多选模式
   *                                               range - 范围选择模式
   *                                               week - 星期选择模式
   * @param [options.hasSwitcher] - 是否显示上下切换按钮（默认值：true）
   * @param [options.hasFooter] - 是否显示日历页脚（默认值：true）
   * @param [options.hasClock] - 是否显示当前时间（默认值：true）
   * @param [options.onDatePick] - 选择日期后的自定义事件处理器
   * @param [options.onMonthPick] - 选择月份后的自定义事件处理器
   * @param [options.onYearPick] - 选择年份后的自定义事件处理器
   * @param [options.onTodayPick] - 点击当前日期的自定义事件处理器
   * @param [options.MONTHS] - 月份常量（格式：去年11/12月 + 今天月份 + 明年1/2月）
   * @param [options.DAYS] - 星期常量（周日为一周的第一天，周六为一周的最后一天）
   * @param [options.DATES] - 月份天数常量（2月为28天，闰年则 28 + 1）
   * @param [options.STYLES] - 日历控件的样式常量
   * @returns {Calendar}
   */
  constructor (options) {
    /**
     * Calendar 控件的配置属性
     * ========================================================================
     */
    this.attributes = {
      // 日历显示的位置（DOM 节点 ID）
      parent: '',
      // 日历初始化显示的时间
      time: '',
      // 日历的试图模式：
      // 0 - 日期试图（默认值）
      // 1 - 月份试图
      // 2 - 年代试图
      viewMode: 0,
      // 日历的日期选择模式
      // single - 单选模式（默认值）
      // multiple - 多选模式
      // range - 范围选择模式
      // week - 星期选择模式
      pickMode: 'single',
      // 是否显示上下切换按钮（默认值：true）
      hasSwitcher: true,
      // 是否显示日历页脚（默认值：true）
      hasFooter: true,
      // 是否显示当前时间（默认值：true）
      hasClock: true,
      // 选择日期后的自定义事件处理器
      // time - 选中的日期时间范围
      // $el - 点击的 DOM 节点
      // calendar - 日历控件的实例
      // onDatePick: function (time, $el, calendar) {
      //   console.log('选择时间：' + time)
      //   console.log('选择的 DOM 节点：' + $el)
      //   console.log('日历实例：' + calendar)
      // },
      onDatePick: null,
      // 选择月份后的自定义事件处理器
      // time - 选中的日期时间
      // $el - 点击的 DOM 节点
      // calendar - 日历控件的实例
      // onMonthPick: function (time, $el, calendar) {
      //   console.log('选择时间：', time)
      //   console.log('选择DOM：', $el)
      //   console.log('日历实例：', calendar)
      // }
      onMonthPick: null,
      // 选择年份后的自定义事件处理器
      // time - 选中的日期时间
      // $el - 点击的 DOM 节点
      // calendar - 日历控件的实例
      // onYearPick: function (time, $el, calendar) {
      //   console.log('选择时间：', time)
      //   console.log('选择DOM：', $el)
      //   console.log('日历实例：', calendar)
      // }
      onYearPick: null,
      // 点击当前日期的自定义事件处理器
      // time - 选中的日期时间
      // $el - 点击的 DOM 节点
      // calendar - 日历控件的实例
      // onTodayPick: function (time, $el, calendar) {
      //   console.log('选择时间：', time)
      //   console.log('选择的 DOM 节点：', $el)
      //   console.log('日历实例：', calendar)
      // }
      onTodayPick: null,
      // 月份常量
      MONTHS: [],
      // 星期常量
      DAYS: [],
      // 月份天数常量
      DATES: [],
      // 日历控件的样式常量
      STYLES: {}
    }

    /**
     * Calendar 控件相关的 DOM 节点属性
     * ========================================================================
     */
    this.elements = {
      // 显示日历控件的父节点
      parent: null,
      // 日历控件的根节点
      wrap: null,
      // 日历控件的头部节点
      header: null,
      // 日历控件的标题节点
      title: null,
      // 日历控件的切换器节点
      switcher: null,
      // 日历控件向上切换按钮节点
      prev: null,
      // 日历控件向下切换按钮节点
      next: null,
      // 日历控件的主体内容节点
      body: null,
      // 日历控件的星期栏节点
      week: null,
      // 日历控件的日期显示节点
      dates: null,
      // 日历控件的月份显示节点
      months: null,
      // 日历控件的年代显示节点
      years: null,
      // 日历控件的页脚节点
      footer: null,
      // 日历控件的当前日期显示节点
      today: null,
      // 日历控件的当前时间显示节点
      time: null
    }

    /**
     * Calendar 控件相关的数据属性
     * ========================================================================
     */
    this.data = {
      // 日历可以显示的最小年份
      minYear: 0,
      // 日历可以显示的最大年份
      maxYear: 0,
      // 当前选中日期的年份
      year: 0,
      // 当前选中日期的月份
      month: 0,
      // 选中的日期信息
      date: {
        // 年份
        year: 0,
        // 月份
        month: 0,
        // 日期
        date: 0,
        // 星期几
        day: 0,
        // 日期的英文表示（格式：2019-6-2）
        text: '',
        // 日期的完整中文表示（格式：2019年6月2日 星期日）
        fullText: ''
      },
      // 多选（multiple/range/week）模式下，选中的日期数据
      picked: []
    }

    // 执行初始化操作
    // 绘制界面
    // 绑定事件处理器
    this.initialize(options)
        .render()
        .addEventListeners()

    return this
  }

  /**
   * 初始化方法
   * ========================================================================
   * 1. 初始化配置信息；
   * 2. 初始化数据信息；
   * 3. 初始化 DOM 信息（创建控件相关的 DOM 节点）；
   * ========================================================================
   * @param {Object} options - 配置信息
   * @see this.attributes
   * @returns {Calendar}
   */
  initialize (options) {
    let year = getYear().value
    let pickMode
    let time
    let month
    let monthText
    let dateRanges
    let startDate
    let endDate

    // 初始化配置
    this.set(Calendar.defaults)
        .set(options)

    time = this.get('time')
    pickMode = this.get('pickMode')
    month = getMonth(time)
    monthText = month.text

    // 初始化数据
    this.setYear(time)
        .setMonth(time)
        .setDate(time)
        ._setYears(time)

    // 初始化（多选模式）选中的时间
    switch (pickMode) {
      case 'multiple':
        this.data.picked.push(this.getDate().text)

        break
      case 'range':
        startDate = monthText + '-' + 1
        endDate = monthText + '-' + this.get('DATES')[month.value - 1]

        // 默认选中整个月
        this.data.picked = [
          startDate,
          endDate
        ]

        break
      case 'week':
        dateRanges = getWeekRanges(time)
        startDate = dateRanges[0]
        endDate = dateRanges[dateRanges.length - 1]

        // 默认选中配置日期所在的那个星期
        this.data.picked = [
          startDate,
          endDate
        ]

        break
    }

    // 设置日历控件可以显示的年份范围
    this.data.minYear = year - 100
    this.data.maxYear = year + 100

    // 创建控件相关的 DOM 节点
    this._createElements()

    return this
  }

  /**
   * 绘制日历控件界面的方法
   * ========================================================================
   * @returns {Calendar}
   */
  render () {
    let elements = this.getEls()
    let $wrap = elements.wrap
    let $header = elements.header
    let $switcher = elements.switcher
    let $body = elements.body
    let $footer = elements.footer
    let $fragment = document.createDocumentFragment()

    // 绘制头部
    this._renderTitle()
    $header.appendChild(elements.title)

    // 配置了显示上下切换按钮
    if (this.get('hasSwitcher')) {
      $switcher.appendChild(elements.prev)
      $switcher.appendChild(elements.next)
      $header.appendChild($switcher)
    }

    // 绘制星期栏
    this._renderDays()
    $body.appendChild(elements.week)

    // 绘制日期
    this._renderDates()
    $body.appendChild(elements.dates)

    // 绘制月份
    this._renderMonths()
    $body.appendChild(elements.months)

    // 绘制年代
    this._renderYears()
    $body.appendChild(elements.years)

    // 配置了显示页脚
    if (this.get('hasFooter')) {
      // 绘制页脚
      this._renderFooter()
      $footer.appendChild(elements.today)

      // 配置了显示当前时间
      if (this.get('hasClock')) {
        $footer.appendChild(elements.time)
      }
    }

    // 将主体模块绘制出来
    $wrap.appendChild($header)
    $wrap.appendChild($body)

    // 配置了显示页脚
    if (this.get('hasFooter')) {
      $wrap.appendChild($footer)
    }

    // 将控件零时保存在文档碎片中
    $fragment.appendChild($wrap)

    // 一次性绘制出整个日历控件
    elements.parent.appendChild($fragment)

    return this
  }

  /**
   * 给日历控件相关的 DOM 节点绑定事件处理器
   * ========================================================================
   * @returns {Calendar}
   */
  addEventListeners () {
    const DOT = '.'
    const STYLES = this.get('STYLES')
    const CLICK = 'click'
    const selectorTitle = DOT + STYLES.TITLE
    const selectorPrev = DOT + STYLES.PREV
    const selectorNext = DOT + STYLES.NEXT
    const selectorDate = DOT + STYLES.DATE
    const selectorMonth = DOT + STYLES.MONTH
    const selectorYear = DOT + STYLES.YEAR
    const selectorToday = DOT + STYLES.TODAY
    let $wrap = this.getEls().wrap

    // 绑定点击标题的事件处理器
    on($wrap, selectorTitle, CLICK, this._titleClick, this)

    if (this.get('hasSwitcher')) {
      // 绑定点击向上按钮的事件处理器
      on($wrap, selectorPrev, CLICK, this._prevClick, this)
      // 绑定点击向下按钮的事件处理器
      on($wrap, selectorNext, CLICK, this._nextClick, this)
    }

    // 绑定点击日期的事件处理器
    on($wrap, selectorDate, CLICK, this._dateClick, this)
    // 绑定点击月份的事件处理器
    on($wrap, selectorMonth, CLICK, this._monthClick, this)
    // 绑定点击年份的事件处理器
    on($wrap, selectorYear, CLICK, this._yearClick, this)

    if (this.get('hasClock')) {
      // 绑定点击今天的事件处理器
      on($wrap, selectorToday, CLICK, this._todayClick, this)
    }

    return this
  }

  /**
   * 重启日历控件
   * ========================================================================
   * 1. 销毁日历控件：
   *    1.1 移除所有的绑定的事件处理器
   *    1.2 隐藏控件
   *    1.3 移除所有 DOM 节点
   *    1.4 重置所有属性
   * 2. 初始化控件
   * 3. 绘制控件
   * 4. 绑定事件处理起
   * ========================================================================
   * @param {Object} options - 配置信息
   * @see this.attributes
   * @returns {Calendar}
   */
  reload (options) {
    this.destroy().initialize(options).render().addEventListeners()

    return this
  }

  /**
   * 销毁日历控件
   * ========================================================================
   * 1 移除所有的绑定的事件处理器
   * 2 隐藏控件
   * 3 移除所有 DOM 节点
   * 4 重置所有属性
   * ========================================================================
   * @returns {Calendar}
   */
  destroy () {
    this.removeEventListeners().hide().remove().reset()

    return this
  }

  /**
   * 移除所有绑定的事件处理器
   * ========================================================================
   * @returns {Calendar}
   */
  removeEventListeners () {
    const CLICK = 'click'
    let $wrap = this.getEls().wrap

    off($wrap, CLICK, this._titleClick)

    if (this.get('hasSwitcher')) {
      off($wrap, CLICK, this._prevClick)
      off($wrap, CLICK, this._nextClick)
    }

    off($wrap, CLICK, this._dateClick)
    off($wrap, CLICK, this._monthClick)
    off($wrap, CLICK, this._yearClick)

    if (this.get('hasClock')) {
      off($wrap, CLICK, this._todayClick)
    }

    return this
  }

  /**
   * 移除所有 DOM 节点
   * ========================================================================
   * @returns {Calendar}
   */
  remove () {
    let elements = this.getEls()

    elements.parent.removeChild(elements.wrap)

    return this
  }

  /**
   * 重置所有属性
   * ========================================================================
   * @returns {Calendar}
   */
  reset () {
    this.attributes = {
      parent: '',
      time: '',
      viewMode: 0,
      pickMode: 'single',
      hasSwitcher: true,
      hasFooter: true,
      hasClock: true,
      MONTHS: [],
      DAYS: [],
      DATES: [],
      STYLES: {}
    }

    this.elements = {
      parent: null,
      wrap: null,
      header: null,
      title: null,
      switcher: null,
      prev: null,
      next: null,
      body: null,
      week: null,
      dates: null,
      months: null,
      years: null,
      footer: null,
      today: null,
      time: null,
      year: null,
      month: null,
      date: null
    }

    this.data = {
      minYear: 0,
      maxYear: 0,
      years: {
        start: 0,
        end: 0
      },
      year: 0,
      month: 0,
      date: {
        year: 0,
        month: 0,
        date: 0,
        day: 0,
        text: '',
        fullText: ''
      },
      picked: []
    }

    return this
  }

  /**
   * 获取配置信息
   * ========================================================================
   * @param {String} attr - 配置属性名称
   * @returns {*} - 返回对应属性的值
   */
  get (attr) {
    return this.attributes[attr]
  }

  /**
   * 设置配置信息
   * ========================================================================
   * @param {Object} [options] - 配置信息对象
   * @returns {Calendar}
   */
  set (options = {}) {
    Object.assign(this.attributes, options)

    return this
  }

  /**
   * 获取日历控件所有相关的 DOM 节点的对象
   * ========================================================================
   * @see Calendar.elements
   * @returns {Object}
   */
  getEls () {
    return this.elements
  }

  /**
   * 获取日历控件当前显示的年份信息
   * ========================================================================
   * @returns {Number} - 返回日历控件当前显示的年份
   */
  getYear () {
    return this.data.year
  }

  /**
   * 设置日历控件当前的年份
   * ========================================================================
   * @param {String|Number} [time] - 表示年份的字符串或数字（默认值：今年）
   *                                 字符串格式：'2019'、'2019-2' 或 '2019-2-2'
   *                                 数字格式：  1546300800000
   * @returns {Calendar}
   */
  setYear (time) {
    this.data.year = getYear(time).value

    return this
  }

  /**
   * 获得日历控件当前显示的月份信息
   * ========================================================================
   * @returns {Number} - 返回日历控件当前显示的月份
   */
  getMonth () {
    return this.data.month
  }

  /**
   * 设置日历控件当前显示的月份
   * ========================================================================
   * @param {String|Number} [time] - 表示月份的字符串或数字（默认值：本月）
   * @returns {Calendar}
   */
  setMonth (time) {
    this.data.month = getMonth(time).value

    return this
  }

  /**
   * 获取日历控件当前选中的日期
   * ========================================================================
   * @returns {Object} - 返回日历控件当前选中的日期
   */
  getDate () {
    return this.data.date
  }

  /**
   * 设置日历控件当前选中的日期
   * ========================================================================
   * @param {String|Number} [time] - 表示日期的字符串或者数字（默认值：今天）
   * @returns {Calendar}
   */
  setDate (time) {
    this.data.date = getDate(time)

    return this
  }

  /**
   * 获取日历控件当前显示的年份所在的年代信息
   * ========================================================================
   * @returns {Object} - 返回当前所在年代信息
   */
  getYears () {
    return this.data.years
  }

  /**
   * 获取日历控件在多选（multiple/range/week）模式下选中的日期信息
   * ========================================================================
   * @returns {Array} - 返回选中的日期信息
   */
  getPicked () {
    return this.data.picked
  }

  /**
   * 根据试图显示模式
   * ========================================================================
   * 1. 切换日历控件的显示模式
   * 2. 更新显示内容
   * ========================================================================
   * @param {Number} viewMode - 显示模式的值：
   *                            0 - 日期显示模式（默认值）
   *                            1 - 月份显示模式
   *                            2 - 年代显示模式
   * @returns {Calendar}
   */
  update (viewMode = 0) {
    this.updateViewMode(viewMode).updateView()

    return this
  }

  /**
   * 更新试图显示模式的配置信息
   * ========================================================================
   * @param {Number} viewMode - 显示模式的值（默认值：0）
   * @see this.update
   * @returns {Calendar}
   */
  updateViewMode (viewMode = 0) {
    let mode = viewMode

    if (mode > 2) {
      mode = 2
    } else {
      if (mode < 0) {
        mode = 0
      }
    }

    this.set({
      viewMode: mode
    })

    return this
  }

  /**
   * 更新日历控件的显示内容
   * ========================================================================
   * 1. 更新标题内容
   *    1.1 日期显示模式：显示年份和月份
   *    1.2 月份显示模式：显示年份
   *    1.3 年份显示模式：显示年代区间信息
   * 2. 更细主体内容
   *    2.1 日期显示模式：隐藏年份和月份的 DOM 节点，显示星期栏和日期信息
   *    2.2 月份显示模式：隐藏年份、星期栏以及日期信息
   *    2.3 年份显示模式：隐藏月份 DOM 节点、星期栏以及日期信息
   * ========================================================================
   * @returns {Calendar}
   */
  updateView () {
    const STYLES = this.get('STYLES')
    const CLS_HIDDEN = STYLES.HIDDEN
    let elements = this.getEls()
    let $week = elements.week
    let $dates = elements.dates
    let $months = elements.months
    let $years = elements.years

    this._renderTitle()

    switch (this.get('viewMode')) {
      // 日期显示模式
      case 0:
        addClass($months, CLS_HIDDEN)
        addClass($years, CLS_HIDDEN)

        removeClass($week, CLS_HIDDEN)
        removeClass($dates, CLS_HIDDEN)

        // 重新绘制日期
        this._repaintDates()

        break
      // 月份显示模式
      case 1:
        addClass($week, CLS_HIDDEN)
        addClass($dates, CLS_HIDDEN)
        addClass($years, CLS_HIDDEN)

        removeClass($months, CLS_HIDDEN)

        // 重新绘制月份
        this._repaintMonths()

        break
      // 年份显示模式
      case 2:
        addClass($week, CLS_HIDDEN)
        addClass($dates, CLS_HIDDEN)
        addClass($months, CLS_HIDDEN)

        removeClass($years, CLS_HIDDEN)

        // 重新绘制年份
        this._repaintYears()

        break
    }

    return this
  }

  /**
   * 向上翻页
   * ========================================================================
   * 1. 日期显示模式：向上翻页，显示上一个月份的日期信息
   * 2. 月份显示模式：向上翻页，显示上一年的月份信息
   * 3. 年份显示模式：向上翻页，显示上一个年代（10前）的年份信息
   * ========================================================================
   * @returns {Calendar}
   */
  prev () {
    let years = this.getYears()
    let startYear = years.start
    let year = this.getYear()
    let month = this.getMonth()
    let minYear = this.data.minYear
    let time

    // 针对显示模式，处理相应的翻页逻辑
    switch (this.get('viewMode')) {
      // 日期显示模式
      case 0:
        // 切换月份
        month -= 1

        // 到了上一年，切换年份
        if (month < 1) {
          month = 12
          year -= 1

          // 确保不小于最小可以显示的年份
          if (year < minYear) {
            year = minYear
          }
        }

        time = year + '-' + month + '-1'

        this.setYear(time)
            .setMonth(time)

        break
      case 1:
        // 切换年份
        year -= 1

        if (year < minYear) {
          year = minYear
        }

        time = year + '-1-1'

        this.setYear(time)

        break
      case 2:
        // 切换年代
        startYear -= 10

        if (startYear < minYear) {
          startYear = minYear + 9
        }

        this._setYears(startYear.toString())

        break
    }

    // 更新显示内容
    this.updateView()

    return this
  }

  /**
   * 向下翻页
   * ========================================================================
   * 1. 日期显示模式：向下翻页，显示下一个月份的日期信息
   * 2. 月份显示模式：向下翻页，显示下一年的月份信息
   * 3. 年份显示模式：向下翻页，显示下一个年代（10后）的年份信息
   * ========================================================================
   * @returns {Calendar}
   */
  next () {
    let years = this.getYears()
    let startYear = years.start
    let year = this.getYear()
    let month = this.getMonth()
    let maxYear = this.data.maxYear
    let time

    switch (this.get('viewMode')) {
      case 0:
        month += 1

        if (month > 12) {
          month = 1
          year += 1

          if (year > maxYear) {
            year = maxYear
          }
        }

        time = year + '-' + month + '-1'

        this.setYear(time)
            .setMonth(time)

        break
      case 1:
        year += 1

        if (year > maxYear) {
          year = maxYear
        }

        time = year + '-1-1'

        this.setYear(time)

        break
      case 2:
        startYear += 10

        if (startYear > maxYear) {
          startYear = maxYear - 9
        }

        this._setYears(startYear.toString())

        break
    }

    this.updateView()

    return this
  }

  /**
   * 选择日期
   * ========================================================================
   * 1. 选择了选中状态的日期：
   *    1.1 星期区间和单选模式：不做任何处理
   *    1.2 多选模式：取消选中 DOM 节点的选中状态，并且将选中的日期在选中信息移除
   *    1.3 日期区间选择模式下：取消之前选中区间的选中样式，将当前选中的日期 DOM 节点
   *        设置为选中状态。移除之前选中日期信息，并将选中日期信息保存起来
   * 2. 选择了未选中状态的日期：
   *    2.1 单选模式：获取选中日期信息，并用这个信息替换之前选中的信息。移除之前选中样
   *        式，并设置当前选中日期的选中样式
   *    2.2 多选模式：获取选中的日期信息，然后保存到选中信息中，最后设置选中日期的样式
   *    2.3 日期区间选择模式下：
   *    2.4 星期区间选择模式：获取当前选择日期的星期区间信息，移除之前保存的区间信息将
   *        新的区间信息保存起来，移除之前的区间选中样式，并设置当前选中区间的选中样式
   * ========================================================================
   * @param {HTMLElement} $date - 选中的日期 DOM 节点
   * @returns {*}
   */
  pickDate ($date) {
    const STYLES = this.get('STYLES')
    const CLS_PICKED = STYLES.PICKED
    let pickMode = this.get('pickMode')
    let elements = this.getEls()
    let time = $date.getAttribute('data-date')
    let callback = this.get('onDatePick')
    let $picked = null
    let pickedDates

    // 选择了选中状态的日期
    if (hasClass($date, CLS_PICKED)) {
      switch (pickMode) {
        // 单选/星期选择模式
        case 'single':
        case 'week':
          return false
        // 多选模式
        case 'multiple':
          // 取消选中样式
          removeClass($date, CLS_PICKED)
          // 移除选中的日期信息
          this._removePicked(time)

          // 设置最后一个选中的时间为当前选中日期
          pickedDates = this.getPicked()
          this.setDate(pickedDates[pickedDates.length - 1])

          if (isFunction(callback)) {
            callback(pickedDates, $date, this)
          }

          break
        case 'range':
          // 清除之前选中的数据
          this.data.picked = []
          // 将当前选中的日期数据保存起来
          this.data.picked.push(time)

          this.setDate(time)

          // 绘制选中样式
          elements.date = $date
          this._updateDateRanges()

          if (isFunction(callback)) {
            callback(this.getPicked(), $date, this)
          }

          break
      }
    } else {
      this.setYear(time)
          .setMonth(time)

      // 选择了未选中状态的日期
      switch (pickMode) {
        case 'single':
          $picked = elements.date

          // 移除之前选中日期的选中样式
          if ($picked) {
            removeClass($picked, CLS_PICKED)
          }

          // 设置当前选中日期的选中样式
          addClass($date, CLS_PICKED)
          elements.date = $date

          this.setDate(time)

          if (isFunction(callback)) {
            callback(time, $date, this)
          }

          break
        case 'multiple':
          // 保存选中的日期，并对选中时间排序
          this.data.picked.push(time)
          this.data.picked.sort()

          // 设置最晚的那个日期为当前选中日期
          pickedDates = this.getPicked()
          this.setDate(pickedDates[pickedDates.length - 1])

          addClass($date, CLS_PICKED)

          if (isFunction(callback)) {
            callback(this.getPicked(), $date, this)
          }

          break
        case 'range':
          // 根据已经选中的日期长度，处理数据的保存
          switch (this.data.picked.length) {
            case 0:
            case 1:
              // 保存选中的日期
              this.data.picked.push(time)

              // 如果选择两个不同的日期，则完成了范围选择，需要对日期排序
              if (this.data.picked.length === 2) {
                this.data.picked.sort()
              }

              // 设置选中日期范围的最后一天为当前选中日期
              pickedDates = this.getPicked()
              this.setDate(pickedDates[pickedDates.length - 1])

              elements.date = $date

              this._updateDateRanges()

              if (isFunction(callback)) {
                callback(pickedDates, $date, this)
              }

              break
            case 2:
              // 之前已经选中了一个日期范围，现在需要清除之前的数据
              this.data.picked = []
              // 保存第一个日期点
              this.data.picked.push(time)

              elements.date = $date

              this._updateDateRanges()

              break
          }

          break
        case 'week':
          // 获得当前选中日期的星期范围
          let ranges = getWeekRanges(time)

          // 清除之前的数据，保存现在的星期日期范围
          this.data.picked = [
            ranges[0],
            ranges[ranges.length - 1]
          ]

          this.setDate(ranges[ranges.length - 1])

          elements.date = $date

          this._updateWeekRanges()

          if (isFunction(callback)) {
            callback(this.getPicked(), $date, this)
          }

          break
      }
    }

    return this
  }

  /**
   * 选择月份
   * ========================================================================
   * 1. 选择了已选中状态的月份：直接切换试图模式到日期试图模式
   * 2. 选择了未选中状态的月份：移除之前选中的月份的选中样式，并当前选中的月份的选中
   *    样式。然后更新选中年份和月份的数据，并切换到日期试图模式
   * ========================================================================
   * @param {HTMLElement} $month - 选中的月份 DOM 节点
   * @returns {Calendar}
   */
  pickMonth ($month) {
    const CLS_PICKED = this.get('STYLES').PICKED
    let elements = this.getEls()
    let $picked = elements.month
    let time = $month.getAttribute('data-month')
    let callback = this.get('onMonthPick')

    // 点击已经选中的年份
    if (hasClass($month, CLS_PICKED)) {
      // 切换到月份试图模式
      this.update()
    } else {
      // 移除之前选中的年份选中样式
      if ($picked) {
        removeClass($picked, CLS_PICKED)
      }

      // 设置选中样式
      addClass($month, CLS_PICKED)
      elements.month = $month

      this.setYear(time)
          .setMonth(time)
          ._setYears(time)
          .update()
    }

    if (isFunction(callback)) {
      callback(time, $month, this)
    }

    return this
  }

  /**
   * 选择年份
   * ========================================================================
   * 1. 选择了已选中状态的年份：更新选中的年份信息，并切换到月份试图模式
   * 2. 选择了未选中状态的年份：移除之前选中的年份的选中样式，将当前选中的年份设为选中
   *    样式，并切换到月份试图模式
   * ========================================================================
   * @param {HTMLElement} $year - 选中的年份 DOM 节点
   * @returns {Calendar}
   */
  pickYear ($year) {
    const CLS_PICKED = this.get('STYLES').PICKED
    let elements = this.getEls()
    let $picked = elements.year
    let time = $year.getAttribute('data-year')
    let callback = this.get('onYearPick')

    // 点击已经选中的月份
    if (hasClass($year, CLS_PICKED)) {
      // 切换到日期试图模式
      this.setYear(time).update(1)
    } else {
      // 移除之前选中的年份选中样式
      if ($picked) {
        removeClass($picked, CLS_PICKED)
      }

      // 设置选中样式
      addClass($year, CLS_PICKED)
      elements.year = $year

      // 更新年份并切换到月份试图
      this.setYear(time)
          ._setYears(time)
          .update(1)
    }

    if (isFunction(callback)) {
      callback(time, $year, this)
    }

    return this
  }

  /**
   * 选择今天
   * ========================================================================
   * 将今天的年份、月份以及日期信息设置为当前选中日期，并切换到日期试图模式
   * ========================================================================
   * @returns {Calendar}
   */
  pickToday () {
    let time = getToday().value
    let callback = this.get('onTodayPick')

    this.setYear(time)
        .setMonth(time)
        .setDate(time)
        ._setYears(time)
        .update()

    if (isFunction(callback)) {
      callback(time, this.getEls().dates.querySelector('[data-date=' + time + ']'), this)
    }

    return this
  }

  /**
   * 隐藏日历控件
   * ========================================================================
   * @returns {Calendar}
   */
  hide () {
    const CLS_HIDDEN = this.get('STYLES').HIDDEN
    let $wrap = this.getEls().wrap

    addClass($wrap, CLS_HIDDEN)

    return this
  }

  /**
   * 显示日历控件
   * ========================================================================
   * @returns {Calendar}
   */
  show () {
    const CLS_HIDDEN = this.get('STYLES').HIDDEN
    let $wrap = this.getEls().wrap

    removeClass($wrap, CLS_HIDDEN)

    return this
  }

  /**
   * 隐藏/显示之间切换
   * ========================================================================
   * @returns {Calendar}
   */
  toggle () {
    const CLS_HIDDEN = this.get('STYLES').HIDDEN

    let $wrap = this.getEls().wrap

    if (hasClass($wrap, CLS_HIDDEN)) {
      this.show()
    } else {
      this.hide()
    }

    return this
  }

  /**
   * 设置当前的年代信息
   * ========================================================================
   * @param {String|Number} [time] - 表示年份的字符串或者数字（默认值：今年）
   * @returns {Calendar}
   * @private
   */
  _setYears (time) {
    this.data.years = getYears(time)

    return this
  }

  /**
   * （多选模式）移除选中的日期
   * ========================================================================
   * @param {String|Number} time - 表示日期的字符串或者数字
   * @returns {Calendar}
   * @private
   */
  _removePicked (time) {
    let pickedDates = this.getPicked()
    let index = pickedDates.indexOf(time)

    if (index > -1) {
      pickedDates.splice(index, 1)
    }

    return this
  }

  /**
   * 绘制日历控件的各个主要 DOM 节点
   * ========================================================================
   * @returns {Calendar}
   * @private
   */
  _createElements () {
    const STYLES = this.get('STYLES')
    const CLS_WRAP = STYLES.WRAP
    const CLS_WRAP_WITHOUT_FOOTER = STYLES.WRAP_WITHOUT_FOOTER
    const CLS_HEADER = STYLES.HEADER
    const CLS_TITLE = STYLES.TITLE
    const CLS_SWITCHER = STYLES.SWITCHER
    const CLS_PREV = STYLES.PREV
    const CLS_ICON_PREV = STYLES.ICON_PREV
    const CLS_NEXT = STYLES.NEXT
    const CLS_ICON_NEXT = STYLES.ICON_NEXT
    const CLS_BODY = STYLES.BODY
    const CLS_WEEK = STYLES.WEEK
    const CLS_DATES = STYLES.DATES
    const CLS_MONTHS = STYLES.MONTHS
    const CLS_YEARS = STYLES.YEARS
    const CLS_FOOTER = STYLES.FOOTER
    const CLS_FOOTER_DATE = STYLES.FOOTER_DATE
    const CLS_TODAY = STYLES.TODAY
    const CLS_FOOTER_TIME = STYLES.FOOTER_TIME
    const CLS_TIME = STYLES.TIME
    const CLS_TEXT = STYLES.TEXT
    const CLS_HIDDEN = STYLES.HIDDEN
    const SPACE = ' '
    let hasFooter = this.get('hasFooter')
    let elements = this.getEls()
    let wrapClassName = CLS_WRAP
    let weekClassName = CLS_WEEK
    let datesClassName = CLS_DATES
    let monthsClassName = CLS_MONTHS
    let yearsClassName = CLS_YEARS

    switch (this.get('viewMode')) {
      case 0:
        monthsClassName += SPACE + CLS_HIDDEN
        yearsClassName += SPACE + CLS_HIDDEN
        break
      case 1:
        weekClassName += SPACE + CLS_HIDDEN
        datesClassName += SPACE + CLS_HIDDEN
        yearsClassName += SPACE + CLS_HIDDEN
        break
      case 2:
        weekClassName += SPACE + CLS_HIDDEN
        datesClassName += SPACE + CLS_HIDDEN
        monthsClassName += SPACE + CLS_HIDDEN
        break
    }

    if (!hasFooter) {
      wrapClassName += SPACE + CLS_WRAP_WITHOUT_FOOTER
    }

    elements.parent = document.getElementById(this.get('parent'))

    // wrap
    elements.wrap = createElement('div', {
      id: guid(4, 10),
      className: wrapClassName
    })
    // header
    elements.header = createElement('div', {
      className: CLS_HEADER
    })
    elements.title = createElement('h4', {
      className: CLS_TITLE
    }, [
      createElement('span', {
        className: CLS_TEXT
      })
    ])

    // 配置了显示上下切换按钮
    if (this.get('hasSwitcher')) {
      elements.switcher = createElement('div', {
        className: CLS_SWITCHER
      })
      elements.prev = createElement('div', {
        className: CLS_PREV
      }, [
        createElement('span', {
          className: CLS_TEXT
        }, [
          createElement('i', {
            className: CLS_ICON_PREV
          })
        ])
      ])
      elements.next = createElement('div', {
        className: CLS_NEXT
      }, [
        createElement('span', {
          className: CLS_TEXT
        }, [
          createElement('i', {
            className: CLS_ICON_NEXT
          })
        ])
      ])
    }

    // body
    elements.body = createElement('div', {
      className: CLS_BODY
    })
    elements.week = createElement('div', {
      className: weekClassName
    })
    elements.dates = createElement('div', {
      className: datesClassName
    })
    elements.months = createElement('div', {
      className: monthsClassName
    })
    elements.years = createElement('div', {
      className: yearsClassName
    })

    // 配置了显示页脚
    if (hasFooter) {
      // footer
      elements.footer = createElement('div', {
        className: CLS_FOOTER
      })
      elements.today = createElement('div', {
        className: CLS_FOOTER_DATE
      }, [
        createElement('p', {
          className: CLS_TODAY
        }, [
          createElement('span', {
            className: CLS_TEXT
          })
        ])
      ])

      // 配置了显示当前时间
      if (this.get('hasClock')) {
        elements.time = createElement('div', {
          className: CLS_FOOTER_TIME
        }, [
          createElement('p', {
            className: CLS_TIME
          }, [
            createElement('span', {
              className: CLS_TEXT
            })
          ])
        ])
      }
    }

    return this
  }

  /**
   * 绘制日历控件的标题
   * ========================================================================
   * @returns {Calendar}
   * @private
   */
  _renderTitle () {
    let $title = this.getEls().title.querySelector('.' + this.get('STYLES').TEXT)
    let years = this.getYears()
    let year = this.getYear()
    let value = ''

    switch (this.get('viewMode')) {
      case 0:
        // 显示完整的年月日式时间
        value = year + '年' + this.getMonth() + '月'
        break
      case 1:
        // 显示年份+月份格式时间
        value = getYear(year.toString()).text
        break
      case 2:
        // 显示年代范围格式时间
        value = years.start + ' - ' + years.end
        break
    }

    $title.innerHTML = value

    return this
  }

  /**
   * 绘制日历控件的星期栏
   * ========================================================================
   * @returns {Calendar}
   * @private
   */
  _renderDays () {
    const STYLES = this.get('STYLES')
    const CLS_DAY = STYLES.DAY
    const CLS_WEEKEND = STYLES.WEEKEND
    const CLS_TEXT = STYLES.TEXT
    const DAYS = this.get('DAYS')
    let fragment = document.createDocumentFragment()

    DAYS.forEach((day, i) => {
      let className = i === 0 || i === DAYS.length - 1 ? CLS_DAY + ' ' + CLS_WEEKEND : CLS_DAY

      // 先将创建的星期几的 DOM 节点保存到文档碎片
      fragment.appendChild(createElement('div', {
        className: className
      }, [
        createElement('span', {
          className: CLS_TEXT
        }, [
          day
        ])
      ]))
    })

    // 然后一次性添加到页面，性能会更好
    this.getEls().week.appendChild(fragment)

    return this
  }

  /**
   * 绘制日历控件的日期信息
   * ========================================================================
   * @returns {Calendar}
   * @private
   */
  _renderDates () {
    const DATES = this.get('DATES')
    // fragments
    let fragment = document.createDocumentFragment()
    // current month
    let year = this.getYear()
    let month = this.getMonth()
    let days = DATES[month - 1]
    let firstDateDay = getDay(year + '-' + month + '-' + 1).value
    // prev month
    let prevYear = month - 2 < 0 ? year - 1 : year
    let prevMonth = month - 2 < 0 ? 12 : month - 1
    let prevDays = DATES[prevMonth - 1]
    // next month
    let nextYear = month === 12 ? year + 1 : year
    let nextMonth = month === 12 ? 1 : month + 1
    let nextDays

    // 如果当前是闰年，上个月是二月份，则闰年二月为29天
    if (isLeapYear(year) && prevMonth === 2) {
      prevDays += 1
    } else {
      // 如果当前是闰年，当前月份是二月，则本月有29天
      if (isLeapYear(year) && month === 2) {
        days += 1
      }
    }

    nextDays = 42 - (firstDateDay + days)

    // 绘制上个月月底的最后几天
    if (firstDateDay !== 0) {
      fragment.appendChild(this._getDatesFragment({
        year: prevYear,
        month: prevMonth,
        start: prevDays - (firstDateDay - 1),
        end: prevDays,
        isPrev: true,
        isNext: false
      }))
    }

    // 绘制本月的日期
    fragment.appendChild(this._getDatesFragment({
      year: year,
      month: month,
      start: 1,
      end: days,
      isPrev: false,
      isNext: false
    }))

    // 绘制下个月月头的几天
    if (nextDays > 0) {
      fragment.appendChild(this._getDatesFragment({
        year: nextYear,
        month: nextMonth,
        start: 1,
        end: nextDays,
        isPrev: false,
        isNext: true
      }))
    }

    this.getEls().dates.appendChild(fragment)

    return this
  }

  /**
   * 重绘日历控件的日期信息
   * ========================================================================
   * @returns {Calendar}
   * @private
   */
  _repaintDates () {
    const CLS_HIDDEN = this.get('STYLES').HIDDEN
    let $dates = this.getEls().dates

    addClass($dates, CLS_HIDDEN)
    $dates.innerHTML = ''
    removeClass($dates, CLS_HIDDEN)

    this._renderDates()

    return this
  }

  /**
   * 获得绘制日期信息时的文档碎片
   * ========================================================================
   * @param {Object} options - 参数对象
   * @param {Number} options.year - 年份
   * @param {Number} options.month - 月份
   * @param {Number} options.start - 开始的日期
   * @param {Number} options.end - 结束的日期
   * @param {Boolean} options.isPrev - 是否为上个月的日期
   * @param {Boolean} options.isNext - 是否为下个月的日期
   * @returns {DocumentFragment}
   * @private
   */
  _getDatesFragment (options) {
    const {year, month, start, end, isPrev, isNext} = options
    const SPACE = ' '
    const STYLES = this.get('STYLES')
    const CLS_DATE = STYLES.DATE
    const CLS_DATE_PREV = STYLES.DATE_PREV
    const CLS_DATE_NEXT = STYLES.DATE_NEXT
    const CLS_CURRENT = STYLES.CURRENT
    const CLS_PICKED = STYLES.PICKED
    const CLS_PICKED_RANGE = STYLES.PICKED_RANGE
    const CLS_WEEKEND = STYLES.WEEKEND
    const CLS_TEXT = STYLES.TEXT
    let fragment = document.createDocumentFragment()
    let elements = this.getEls()
    let date = start
    let pickMode = this.get('pickMode')
    let pickedDates = this.getPicked()

    for (; date <= end; date += 1) {
      let fullDate = year + '-' + month + '-' + date
      let isCurrent = isToday(fullDate)
      let day = getDay(fullDate)
      let $children = [
        createElement('span', {
          className: CLS_TEXT
        }, [
          date
        ])
      ]
      let className = ''
      let $date

      $date = createElement('div', {
        'data-date': fullDate
      }, $children)

      className += CLS_DATE

      if (isPrev) {
        className += (SPACE + CLS_DATE_PREV)
      } else {
        if (isNext) {
          className += (SPACE + CLS_DATE_NEXT)
        }
      }

      // 当前（今天）的日期
      if (isCurrent) {
        className += (SPACE + CLS_CURRENT)
      }

      // 周末
      if (day.value === 0 || day.value === 6) {
        className += (SPACE + CLS_WEEKEND)
      }

      switch (pickMode) {
        // 单选模式
        case 'single':
          let pickedDate = this.getDate().text
          let isPickedDate = isDatesEqual(fullDate, pickedDate)

          if (isPickedDate) {
            className += (SPACE + CLS_PICKED)
            elements.date = $date
          }
          break
        // 多选模式
        case 'multiple':
          pickedDates.forEach((picked) => {
            let isPicked = isDatesEqual(fullDate, picked)

            if (isPicked) {
              className += (SPACE + CLS_PICKED)
            }
          })

          break
        // 区间模式
        case 'range':
        case 'week':
          let dateRanges = []

          // 只有选中了两个节点，才绘制选中日期区间的样式
          if (pickedDates.length === 2) {
            dateRanges = getRanges(pickedDates[0], pickedDates[1])

            dateRanges.forEach((picked, i) => {
              let isPicked = isDatesEqual(fullDate, picked)

              if (!isPicked) {
                return false
              }

              // 设置中间日期的样式
              if (i !== 0 && i !== (dateRanges.length - 1)) {
                className += (SPACE + CLS_PICKED)
                className += (SPACE + CLS_PICKED_RANGE)
              } else {
                if (i === 0 || i === dateRanges.length - 1) {
                  className += (SPACE + CLS_PICKED)
                }
              }
            })
          } else {
            if (pickedDates.length === 1) {
              className += (SPACE + CLS_PICKED)
            }
          }

          break
      }

      $date.className = className

      fragment.appendChild($date)
    }

    return fragment
  }

  /**
   * 绘制选中的日期区间选中样式
   * ========================================================================
   * @returns {Calendar}
   * @private
   */
  _updateDateRanges () {
    const STYLES = this.get('STYLES')
    const CLS_PICKED = STYLES.PICKED
    const CLS_PICKED_RANGE = STYLES.PICKED_RANGE
    let elements = this.getEls()
    let $date = this.elements.date
    let $dates = elements.dates
    let $pickedDates = $dates.querySelectorAll('.' + CLS_PICKED)

    switch (this.data.picked.length) {
      case 1:
        // 移除之前的选中样式
        $pickedDates.forEach(($picked) => {
          removeClass($picked, CLS_PICKED)

          if (hasClass($picked, CLS_PICKED_RANGE)) {
            removeClass($picked, CLS_PICKED_RANGE)
          }
        })

        // 绘制选中的第一个端点的选中样式
        addClass($date, CLS_PICKED)

        break
      case 2:
        let ranges = getRanges(this.data.picked[0], this.data.picked[1])

        ranges.forEach((picked, i) => {
          let $picked = $dates.querySelector('[data-date="' + picked + '"]')

          // 绘制中间区域的选中样式
          if (i > 0 && i < ranges.length - 1) {
            addClass($picked, CLS_PICKED)
            addClass($picked, CLS_PICKED_RANGE)
          }
        })

        // 绘制选中的第二个端点的选中样式
        addClass($date, CLS_PICKED)
    }

    return this
  }

  /**
   * 绘制选中的星期区间
   * ========================================================================
   * @returns {Calendar}
   * @private
   */
  _updateWeekRanges () {
    const STYLES = this.get('STYLES')
    const CLS_PICKED = STYLES.PICKED
    const CLS_PICKED_RANGE = STYLES.PICKED_RANGE
    let elements = this.getEls()
    let $dates = elements.dates
    let $pickedDates = $dates.querySelectorAll('.' + CLS_PICKED)
    let picked = this.getPicked()
    let ranges = getWeekRanges(picked[0])

    // 移除之前选中区域的样式
    $pickedDates.forEach(($picked) => {
      removeClass($picked, CLS_PICKED_RANGE)
      removeClass($picked, CLS_PICKED)
    })

    // 设置新的选中区域的样式
    ranges.forEach((picked, i) => {
      let $picked = $dates.querySelector('[data-date="' + picked + '"]')

      // 绘制中间区域
      if (i > 0 && i < ranges.length - 1) {
        addClass($picked, CLS_PICKED)
        addClass($picked, CLS_PICKED_RANGE)
      } else {
        // 绘制两头的节点
        if (i === 0 || i === ranges.length - 1) {
          addClass($picked, CLS_PICKED)
        }
      }
    })

    return this
  }

  /**
   * 绘制日历控件的月份信息
   * ========================================================================
   * @returns {Calendar}
   * @private
   */
  _renderMonths () {
    const SPACE = ' '
    const STYLES = this.get('STYLES')
    const CLS_CURRENT = STYLES.CURRENT
    const CLS_PICKED = STYLES.PICKED
    const CLS_MONTH = STYLES.MONTH
    const CLS_MONTH_PREV = STYLES.MONTH_PREV
    const CLS_MONTH_NEXT = STYLES.MONTH_NEXT
    const CLS_TEXT = STYLES.TEXT
    const MONTHS = this.get('MONTHS')
    let fragment = document.createDocumentFragment()
    let elements = this.getEls()
    let year = this.getYear()
    let today = getToday()

    MONTHS.forEach((MONTH, i) => {
      let pickedDate = this.getDate()
      let className = CLS_MONTH
      let $month

      // 去年的月份
      if (i < 2) {
        className += SPACE + CLS_MONTH_PREV

        // 判断是否被选中了
        if ((year - 1) === pickedDate.year && MONTH === pickedDate.month) {
          className += SPACE + CLS_PICKED
        }

        // 创建月份的 DOM 节点
        $month = createElement('div', {
          className: className,
          'data-month': (year - 1) + '-' + MONTH + '-1'
        }, [
          createElement('span', {
            className: CLS_TEXT
          }, [
            MONTH
          ])
        ])
      } else {
        // 今年的月份
        if (i >= 2 && i <= 13) {
          // 判断是否为今天
          if (year === today.year && MONTH === today.month) {
            className += ' ' + CLS_CURRENT
          }

          // 判断是否被选中了
          if (year === pickedDate.year && MONTH === pickedDate.month) {
            className += SPACE + CLS_PICKED
          }

          // 创建月份的 DOM 节点
          $month = createElement('div', {
            className: className,
            'data-month': year + '-' + MONTH + '-1'
          }, [
            createElement('span', {
              className: CLS_TEXT
            }, [
              MONTH
            ])
          ])
        } else {
          // 明年的月份
          if (i > 13 && i <= 15) {
            className += SPACE + CLS_MONTH_NEXT

            // 判断是否被选中了
            if ((year + 1) === pickedDate.year && MONTH === pickedDate.month) {
              className += SPACE + CLS_PICKED
            }

            // 创建月份的 DOM 节点
            $month = createElement('div', {
              className: className,
              'data-month': (year + 1) + '-' + MONTH + '-1'
            }, [
              createElement('span', {
                className: CLS_TEXT
              }, [
                MONTH
              ])
            ])
          }
        }
      }

      // 将所有月份 DOM 节点缓存到文档碎片中
      fragment.appendChild($month)
    })

    elements.months.appendChild(fragment)

    return this
  }

  /**
   * 重绘日历控件的月份信息
   * ========================================================================
   * @returns {Calendar}
   * @private
   */
  _repaintMonths () {
    const CLS_HIDDEN = this.get('STYLES').HIDDEN
    let $months = this.getEls().months

    addClass($months, CLS_HIDDEN)
    $months.innerHTML = ''
    removeClass($months, CLS_HIDDEN)

    this._renderMonths()

    return this
  }

  /**
   * 绘制日历控件的年份信息
   * ========================================================================
   * @returns {Calendar}
   * @private
   */
  _renderYears () {
    let years = this.getYears()
    let yearsStart = years.start
    let yearsEnd = years.end
    let prevStartYear = yearsStart - 3
    let prevEndYear = yearsStart - 1
    let nextStartYear = yearsEnd + 1
    let nextEndYear = yearsEnd + 3
    let fragment = document.createDocumentFragment()

    fragment.appendChild(this._getYearsFragment({
      start: prevStartYear,
      end: prevEndYear,
      isPrev: true,
      isNext: false
    }))
    fragment.appendChild(this._getYearsFragment({
      start: yearsStart,
      end: yearsEnd,
      isPrev: false,
      isNext: false
    }))
    fragment.appendChild(this._getYearsFragment({
      start: nextStartYear,
      end: nextEndYear,
      isPrev: false,
      isNext: true
    }))

    this.getEls().years.appendChild(fragment)

    return this
  }

  /**
   * 重绘日历控件的年份信息
   * ========================================================================
   * @returns {Calendar}
   * @private
   */
  _repaintYears () {
    const CLS_HIDDEN = this.get('STYLES').HIDDEN
    let $years = this.getEls().years

    addClass($years, CLS_HIDDEN)
    $years.innerHTML = ''
    removeClass($years, CLS_HIDDEN)

    this._renderYears()

    return this
  }

  /**
   * 获取绘制年份信息的文档碎片
   * ========================================================================
   * @param {Object} options - 参数对象
   * @param {Number} options.start - 开始年份
   * @param {Number} options.end - 结束年份
   * @param {Boolean} options.isPrev - 是否为上个年代的年份
   * @param {Boolean} options.isNext - 是否为下个年带的年份
   * @returns {DocumentFragment}
   * @private
   */
  _getYearsFragment (options) {
    const {start, end, isPrev, isNext} = options
    const STYLES = this.get('STYLES')
    const CLS_YEAR = STYLES.YEAR
    const CLS_YEAR_PREV = STYLES.YEAR_PREV
    const CLS_YEAR_NEXT = STYLES.YEAR_NEXT
    const CLS_CURRENT = STYLES.CURRENT
    const CLS_PICKED = STYLES.PICKED
    const CLS_DISABLED = STYLES.DISABLED
    const CLS_TEXT = STYLES.TEXT
    let fragment = document.createDocumentFragment()
    let elements = this.getEls()
    let minYear = this.data.minYear
    let maxYear = this.data.maxYear
    let year = start

    for (; year <= end; year += 1) {
      let pickedDate = this.getDate()
      let isCurrent = (year === getToday().year)
      let isPicked = (year === pickedDate.year)
      let className = CLS_YEAR
      let $year = createElement('div', {
        'data-year': year + '-1-1'
      }, [
        createElement('span', {
          className: CLS_TEXT
        }, [
          year
        ])
      ])

      if (isPrev) {
        className += ' ' + CLS_YEAR_PREV
      } else {
        if (isNext) {
          className += ' ' + CLS_YEAR_NEXT
        }
      }

      if (isCurrent) {
        className += ' ' + CLS_CURRENT
      }

      if (isPicked) {
        className += ' ' + CLS_PICKED
        elements.year = $year
      }

      if (year < minYear || year > maxYear) {
        className += ' ' + CLS_DISABLED
      }

      $year.className = className

      fragment.appendChild($year)
    }

    return fragment
  }

  /**
   * 绘制日历控件的页脚
   * ========================================================================
   * @returns {Calendar}
   * @private
   */
  _renderFooter () {
    const STYLES = this.get('STYLES')
    const CLS_TEXT = STYLES.TEXT
    let elements = this.getEls()
    let $today = elements.today.querySelector('.' + CLS_TEXT)
    let today = getToday()
    let timer = null

    let renderTime = () => {
      let $time = elements.time.querySelector('.' + CLS_TEXT)
      let time = new Date()
      let hours = time.getHours()
      let minutes = time.getMinutes()
      let seconds = time.getSeconds()

      if (timer) {
        clearTimeout(timer)
      }

      if (hours < 10) {
        hours = '0' + hours
      }

      if (minutes < 10) {
        minutes = '0' + minutes
      }

      if (seconds < 10) {
        seconds = '0' + seconds
      }

      $time.innerHTML = hours + ':' + minutes + ':' + seconds

      timer = setTimeout(renderTime, 1000)
    }

    $today.innerHTML = '今天：' + today.text
    $today.setAttribute('data-date', today.value)

    if (this.get('hasClock')) {
      renderTime()
    }

    return this
  }

  /**
   * 点击标题的事件处理器
   * ========================================================================
   * @returns {Calendar}
   * @private
   */
  _titleClick () {
    let viewMode = this.get('viewMode')

    viewMode += 1

    if (viewMode > 2) {
      viewMode = 2
    }

    this.update(viewMode)

    return this
  }

  /**
   * 点击向上翻页的事件处理器
   * ========================================================================
   * @returns {Calendar}
   * @private
   */
  _prevClick () {
    this.prev()

    return this
  }

  /**
   * 点击向下翻页的事件处理起
   * ========================================================================
   * @returns {Calendar}
   * @private
   */
  _nextClick () {
    this.next()

    return this
  }

  /**
   * 点击日期的事件处理器
   * ========================================================================
   * @param {Event} evt - 事件对象
   * @returns {Calendar}
   * @private
   */
  _dateClick (evt) {
    this.pickDate(evt.delegateTarget)

    return this
  }

  /**
   * 点击月份的事件处理器
   * ========================================================================
   * @param {Event} evt - 事件对象
   * @returns {Calendar}
   * @private
   */
  _monthClick (evt) {
    this.pickMonth(evt.delegateTarget)
    return this
  }

  /**
   * 点击年份的事件处理器
   * ========================================================================
   * @param {Event} evt - 事件对象
   * @returns {Calendar}
   * @private
   */
  _yearClick (evt) {
    this.pickYear(evt.delegateTarget)

    return this
  }

  /**
   * 点击今天的事件处理器
   * ========================================================================
   * @returns {Calendar}
   * @private
   */
  _todayClick () {
    let elements = this.getEls()
    let time = getToday().text

    this.pickToday()

    // 触发日期选择逻辑
    this.pickDate(elements.dates.querySelector('[data-date="' + time + '"]'))

    return this
  }
}

/**
 * 日历控件默认的配置信息
 * ========================================================================
 */
Calendar.defaults = {
  parent: 'calendar',
  time: getDate().text,
  // 0 - 日期显示模式（默认值）
  // 1 - 月份显示模式
  // 2 - 年代显示模式
  viewMode: 0,
  // single - 单选（默认值）
  // multiple - 多选
  // range - 范围多选
  // week - 整个星期选择
  pickMode: 'single',
  hasSwitcher: true,
  hasFooter: true,
  hasClock: true,
  onDatePick: null,
  onMonthPick: null,
  onYearPick: null,
  onTodayPick: null,
  MONTHS: [
    11,
    12,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    1,
    2
  ],
  DAYS: [
    '日',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六'
  ],
  DATES: [
    31,
    28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ],
  STYLES: {
    WRAP: 'cal-md',
    WRAP_WITHOUT_FOOTER: 'cal-md-without-footer',
    HEADER: 'cal-hd',
    TITLE: 'cal-title',
    SWITCHER: 'cal-switcher',
    PREV: 'cal-prev',
    ICON_PREV: 'icon-cheveron-up',
    NEXT: 'cal-next',
    ICON_NEXT: 'icon-cheveron-down',
    BODY: 'cal-bd',
    WEEK: 'cal-week',
    WEEKEND: 'cal-weekend',
    DAY: 'cal-day',
    DATES: 'cal-dates',
    DATE: 'cal-date',
    DATE_PREV: 'cal-date-prev',
    DATE_NEXT: 'cal-date-next',
    MONTHS: 'cal-months',
    MONTH: 'cal-month',
    MONTH_PREV: 'cal-month-prev',
    MONTH_NEXT: 'cal-month-next',
    YEARS: 'cal-years',
    YEAR: 'cal-year',
    YEAR_PREV: 'cal-year-prev',
    YEAR_NEXT: 'cal-year-next',
    FOOTER: 'cal-ft',
    FOOTER_DATE: 'cal-ft-date',
    TODAY: 'cal-today',
    FOOTER_TIME: 'cal-ft-time',
    TIME: 'cal-time',
    TEXT: 'cal-text',
    CURRENT: 'cal-current',
    PICKED: 'cal-picked',
    PICKED_RANGE: 'cal-picked-range',
    PICKED_POINT: 'cal-picked-point',
    DISABLED: 'cal-disabled',
    HIDDEN: 'cal-hidden'
  }
}

export default Calendar
