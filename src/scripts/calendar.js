/**
 * Calendar 类
 */
class Calendar {
  /**
   * 构造函数
   * ========================================================================
   * @constructor
   * @param options
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
      // 是否显示农历日期
      // false - 不显示（默认值）
      // true - 显示
      isLunarCalendar: false,
      // 是否显示节日（国际节日和农历节气）
      // 目前只支持国际节日
      isFestivalsDisplay: false,
      onDatePick: null,
      onMonthPick: null,
      onYearPick: null,
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
    let year = Calendar.getYear().value
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
    month = Calendar.getMonth(time)
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

        this.data.picked.push(startDate)
        this.data.picked.push(endDate)

        break
      case 'week':
        dateRanges = Calendar.getWeekRanges(time)
        startDate = dateRanges[0]
        endDate = dateRanges[dateRanges.length - 1]

        this.data.picked.push(startDate)
        this.data.picked.push(endDate)

        break
    }

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
    $switcher.appendChild(elements.prev)
    $switcher.appendChild(elements.next)
    $header.appendChild($switcher)

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

    // 绘制页脚
    this._renderFooter()
    $footer.appendChild(elements.today)
    $footer.appendChild(elements.time)

    // 将主体模块绘制出来
    $wrap.appendChild($header)
    $wrap.appendChild($body)
    $wrap.appendChild($footer)
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
    const Delegate = Calendar.Delegate
    let $wrap = this.getEls().wrap

    // 绑定点击标题的事件处理器
    Delegate.on($wrap, selectorTitle, CLICK, this._titleClick, this)
    // 绑定点击向上按钮的事件处理器
    Delegate.on($wrap, selectorPrev, CLICK, this._prevClick, this)
    // 绑定点击向下按钮的事件处理器
    Delegate.on($wrap, selectorNext, CLICK, this._nextClick, this)
    // 绑定点击日期的事件处理器
    Delegate.on($wrap, selectorDate, CLICK, this._dateClick, this)
    // 绑定点击月份的事件处理器
    Delegate.on($wrap, selectorMonth, CLICK, this._monthClick, this)
    // 绑定点击年份的事件处理器
    Delegate.on($wrap, selectorYear, CLICK, this._yearClick, this)
    // 绑定点击今天的事件处理器
    Delegate.on($wrap, selectorToday, CLICK, this._todayClick, this)

    return this
  }

  /**
   * 移除所有绑定的事件处理器
   * ========================================================================
   * @returns {Calendar}
   */
  removeEventListeners () {
    const CLICK = 'click'
    const Delegate = Calendar.Delegate
    let $wrap = this.getEls().wrap

    Delegate.off($wrap, CLICK, this._titleClick)
    Delegate.off($wrap, CLICK, this._prevClick)
    Delegate.off($wrap, CLICK, this._nextClick)
    Delegate.off($wrap, CLICK, this._dateClick)
    Delegate.off($wrap, CLICK, this._monthClick)
    Delegate.off($wrap, CLICK, this._yearClick)
    Delegate.off($wrap, CLICK, this._todayClick)

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
      isLunarCalendar: false,
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
    // let config = JSON.parse(JSON.stringify(options))

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
    this.data.year = Calendar.getYear(time).value

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
    this.data.month = Calendar.getMonth(time).value

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
    this.data.date = Calendar.getDate(time)

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
   * 获取某个年份的所有农历节气信息
   * @param {Number} year - 年份数值
   * @returns {Array}
   */
  getLunarSolarTerms (year) {
    let TERMS = [
      0,
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
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23
    ]
    let terms = []

    TERMS.forEach((term, i) => {
      terms.push(Calendar.Astronomical.getLunarSolarTerm(year, i))
    })

    return terms
  }

  /**
   * 根据试图显示模式，切换日历控件的显示模式和显示内容
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
    const DOM = Calendar.DOM
    const addClass = DOM.addClass
    const removeClass = DOM.removeClass
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

        time = year + '-' + month

        this.setYear(time)
            .setMonth(time)

        break
      case 1:
        // 切换年份
        year -= 1

        if (year < minYear) {
          year = minYear
        }

        this.setYear(year.toString())

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

        time = year + '-' + month

        this.setYear(time)
            .setMonth(time)

        break
      case 1:
        year += 1

        if (year > maxYear) {
          year = maxYear
        }

        this.setYear(year.toString())

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
    const DOM = Calendar.DOM
    const hasClass = DOM.hasClass
    const addClass = DOM.addClass
    const removeClass = DOM.removeClass
    const isFunction = Calendar.Utils.isFunction
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
          this._renderDateRanges()

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

          if ($picked) {
            removeClass($picked, CLS_PICKED)
          }

          addClass($date, CLS_PICKED)
          elements.date = $date

          this.setDate(time)

          if (isFunction(callback)) {
            callback(time, $date, this)
          }

          break
        case 'multiple':
          this.data.picked.push(time)
          this.data.picked.sort()

          pickedDates = this.getPicked()

          this.setDate(pickedDates[pickedDates.length - 1])

          addClass($date, CLS_PICKED)

          if (isFunction(callback)) {
            callback(this.getPicked(), $date, this)
          }

          break
        case 'range':
          switch (this.data.picked.length) {
            case 0:
            case 1:
              this.data.picked.push(time)

              if (this.data.picked.length === 2) {
                this.data.picked.sort()
              }

              pickedDates = this.getPicked()
              this.setDate(pickedDates[pickedDates.length - 1])

              elements.date = $date
              this._renderDateRanges()

              if (isFunction(callback)) {
                callback(pickedDates, $date, this)
              }

              break
            case 2:
              this.data.picked = []
              this.data.picked.push(time)

              elements.date = $date
              this._renderDateRanges()

              break
          }

          break
        case 'week':
          let ranges = Calendar.getWeekRanges(time)

          this.data.picked = []
          this.data.picked.push(ranges[0])
          this.data.picked.push(ranges[ranges.length - 1])

          this.setDate(ranges[ranges.length - 1])

          elements.date = $date
          this._renderWeekRanges()

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
    const DOM = Calendar.DOM
    let elements = this.getEls()
    let $picked = elements.month
    let time = $month.getAttribute('data-month')
    let callback = this.get('onMonthPick')

    // 点击已经选中的年份
    if (DOM.hasClass($month, CLS_PICKED)) {
      // 切换到月份试图模式
      this.update()
    } else {
      // 移除之前选中的年份选中样式
      if ($picked) {
        DOM.removeClass($picked, CLS_PICKED)
      }

      // 设置选中样式
      DOM.addClass($month, CLS_PICKED)
      elements.month = $month

      this.setYear(time)
          .setMonth(time)
          .update()
    }

    if (Calendar.Utils.isFunction(callback)) {
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
    const DOM = Calendar.DOM
    let elements = this.getEls()
    let $picked = elements.year
    let time = $year.getAttribute('data-year')
    let callback = this.get('onYearPick')

    // 点击已经选中的月份
    if (DOM.hasClass($year, CLS_PICKED)) {
      // 切换到日期试图模式
      this.setYear(time).update(1)
    } else {
      // 移除之前选中的年份选中样式
      if ($picked) {
        DOM.removeClass($picked, CLS_PICKED)
      }

      // 设置选中样式
      DOM.addClass($year, CLS_PICKED)
      elements.year = $year

      // 更新年份并切换到月份试图
      this.setYear(time)
          .update(1)
    }

    if (Calendar.Utils.isFunction(callback)) {
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
    let time = Calendar.getToday().value
    let callback = this.get('onTodayPick')

    this.setYear(time)
        .setMonth(time)
        .setDate(time)
        .update()

    if (Calendar.Utils.isFunction(callback)) {
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

    Calendar.DOM.addClass($wrap, CLS_HIDDEN)

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

    Calendar.DOM.removeClass($wrap, CLS_HIDDEN)

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

    if (Calendar.DOM.hasClass($wrap, CLS_HIDDEN)) {
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
    this.data.years = Calendar.getYears(time)

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
    let elements = this.getEls()
    let createElement = Calendar.DOM.createElement
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

    elements.parent = document.getElementById(this.get('parent'))

    // wrap
    elements.wrap = createElement('div', {
      id: Calendar.Utils.guid('calendar'),
      className: CLS_WRAP
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
        value = Calendar.getMonth(year + '-' + this.getMonth()).fullText
        break
      case 1:
        value = Calendar.getYear(year.toString()).text
        break
      case 2:
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
    const createElement = Calendar.DOM.createElement
    let fragment = document.createDocumentFragment()

    DAYS.forEach((day, i) => {
      let className = i === 0 || i === DAYS.length - 1 ? CLS_DAY + ' ' + CLS_WEEKEND : CLS_DAY
      let $day = createElement('div', {
        className: className
      }, [
        createElement('span', {
          className: CLS_TEXT
        }, [
          day
        ])
      ])

      fragment.appendChild($day)
    })

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
    const isLeapYear = Calendar.isLeapYear
    // fragments
    let fragment = document.createDocumentFragment()
    // current month
    let year = this.getYear()
    let month = this.getMonth()
    let days = DATES[month - 1]
    let firstDateDay = Calendar.getDay(year + '-' + month + '-' + 1).value
    // prev month
    let prevYear = month - 2 < 0 ? year - 1 : year
    let prevMonth = month - 2 < 0 ? 12 : month - 1
    let prevDays = DATES[prevMonth - 1]
    // next month
    let nextYear = month === 12 ? year + 1 : year
    let nextMonth = month === 12 ? 1 : month + 1
    let nextDays

    if (isLeapYear(prevYear) && prevMonth === 2) {
      prevDays += 1
    }

    if (isLeapYear(year) && month === 2) {
      days += 1
    }

    nextDays = 42 - (firstDateDay + days)

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

    fragment.appendChild(this._getDatesFragment({
      year: year,
      month: month,
      start: 1,
      end: days,
      isPrev: false,
      isNext: false
    }))

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
    const DOM = Calendar.DOM
    let $dates = this.getEls().dates

    DOM.addClass($dates, CLS_HIDDEN)
    $dates.innerHTML = ''
    DOM.removeClass($dates, CLS_HIDDEN)

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
    const CLS_LUNAR_TEXT = STYLES.LUNAR_TEXT
    const CLS_FESTIVAL_TEXT = STYLES.FESTIVAL_TEXT
    const createElement = Calendar.DOM.createElement
    const isDatesEqual = Calendar.isDatesEqual
    const isLunarCalendar = this.get('isLunarCalendar')
    const isFestivalsDisplay = this.get('isFestivalsDisplay')
    let fragment = document.createDocumentFragment()
    let elements = this.getEls()
    let date = start
    let pickMode = this.get('pickMode')
    let pickedDates = this.getPicked()

    for (; date <= end; date += 1) {
      let fullDate = year + '-' + month + '-' + date
      let isCurrent = Calendar.isToday(fullDate)
      let day = Calendar.getDay(fullDate)
      let festival = isFestivalsDisplay ? Calendar.getFestival(month, date) : ''
      let $children = [
        createElement('span', {
          className: CLS_TEXT
        }, [
          date
        ])
      ]
      let className = ''
      let lunarText = Calendar.getDate(fullDate).lunar.text
      let solarTerm
      let $date

      // 显示节日
      if (festival) {
        // 显示节日时，就不显示该日的农历日期了
        $children.push(createElement('span', {
          className: CLS_FESTIVAL_TEXT
        }, [
          festival
        ]))
      } else {
        // 显示农历日期
        if (isLunarCalendar) {
          solarTerm = this.getLunarSolarTerms(year).filter((term) => {
            return Calendar.isEqual(term.value, fullDate)
          })

          // 有公历的节日，显示公历节日
          if (festival) {
            lunarText = festival
          }

          // 有农历节气，显示农历节气（如果公历节日和农历节气在同一天，目前显示农历节气）
          if (solarTerm.length > 0) {
            lunarText = solarTerm[0].text
          }

          $children.push(createElement('span', {
            className: CLS_LUNAR_TEXT
          }, [
            lunarText
          ]))
        }
      }

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
            dateRanges = Calendar.getRanges(pickedDates[0], pickedDates[1])

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
  _renderDateRanges () {
    const STYLES = this.get('STYLES')
    const CLS_PICKED = STYLES.PICKED
    const CLS_PICKED_RANGE = STYLES.PICKED_RANGE
    const DOM = Calendar.DOM
    const hasClass = DOM.hasClass
    const removeClass = DOM.removeClass
    const addClass = DOM.addClass
    let elements = this.getEls()
    let $date = this.elements.date
    let $dates = elements.dates
    let $pickedDates = $dates.querySelectorAll('.' + CLS_PICKED)

    switch (this.data.picked.length) {
      case 1:
        $pickedDates.forEach(($picked) => {
          removeClass($picked, CLS_PICKED)

          if (hasClass($picked, CLS_PICKED_RANGE)) {
            removeClass($picked, CLS_PICKED_RANGE)
          }
        })

        addClass($date, CLS_PICKED)

        break
      case 2:
        let ranges = Calendar.getRanges(this.data.picked[0], this.data.picked[1])

        ranges.forEach((picked, i) => {
          let $picked = $dates.querySelector('[data-date="' + picked + '"]')

          if (i > 0 && i < ranges.length - 1) {
            addClass($picked, CLS_PICKED)
            addClass($picked, CLS_PICKED_RANGE)
          }
        })

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
  _renderWeekRanges () {
    const STYLES = this.get('STYLES')
    const CLS_PICKED = STYLES.PICKED
    const CLS_PICKED_RANGE = STYLES.PICKED_RANGE
    const DOM = Calendar.DOM
    const removeClass = DOM.removeClass
    const addClass = DOM.addClass
    let elements = this.getEls()
    let $dates = elements.dates
    let $pickedDates = $dates.querySelectorAll('.' + CLS_PICKED)
    let picked = this.getPicked()
    let ranges = Calendar.getWeekRanges(picked[0])

    // 移除之前选中区域的样式
    $pickedDates.forEach(($picked) => {
      removeClass($picked, CLS_PICKED_RANGE)
      removeClass($picked, CLS_PICKED)
    })

    // 设置新的选中区域的样式
    ranges.forEach((picked, i) => {
      let $picked = $dates.querySelector('[data-date="' + picked + '"]')

      if (i > 0 && i < ranges.length - 1) {
        addClass($picked, CLS_PICKED)
        addClass($picked, CLS_PICKED_RANGE)
      } else {
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
    const STYLES = this.get('STYLES')
    const CLS_CURRENT = STYLES.CURRENT
    const CLS_PICKED = STYLES.PICKED
    const CLS_MONTH = STYLES.MONTH
    const CLS_MONTH_NEXT = STYLES.MONTH_NEXT
    const CLS_TEXT = STYLES.TEXT
    const MONTHS = this.get('MONTHS')
    const DOM = Calendar.DOM
    const createElement = DOM.createElement
    const setAttribute = DOM.setAttribute
    let fragment = document.createDocumentFragment()
    let elements = this.getEls()
    let year = this.getYear()
    let today = Calendar.getToday()

    MONTHS.forEach((MONTH, i) => {
      let pickedDate = this.getDate()
      let isCurrent = (year === today.year && MONTH === today.month)
      let isPicked = (year === pickedDate.year && MONTH === pickedDate.month)
      let nextYear = year + 1
      let className = CLS_MONTH
      let $month = createElement('div', {
        'data-month': year + '-' + MONTH
      }, [
        createElement('span', {
          className: CLS_TEXT
        }, [
          MONTH
        ])
      ])

      // 当前（今天）的年份
      if (isCurrent) {
        className += ' ' + CLS_CURRENT
      }

      // 下一年的月份
      if (i >= 12) {
        className += ' ' + CLS_MONTH_NEXT
        setAttribute($month, 'data-month', nextYear + '-' + MONTH)
      }
      else {
        // 选中的月份
        if (isPicked) {
          className += ' ' + CLS_PICKED
          elements.month = $month
        }
      }

      $month.className = className

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
    const DOM = Calendar.DOM
    let $months = this.getEls().months

    DOM.addClass($months, CLS_HIDDEN)
    $months.innerHTML = ''
    DOM.removeClass($months, CLS_HIDDEN)

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
    const DOM = Calendar.DOM
    let $years = this.getEls().years

    DOM.addClass($years, CLS_HIDDEN)
    $years.innerHTML = ''
    DOM.removeClass($years, CLS_HIDDEN)

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
    const DOM = Calendar.DOM
    const createElement = DOM.createElement
    let fragment = document.createDocumentFragment()
    let elements = this.getEls()
    let minYear = this.data.minYear
    let maxYear = this.data.maxYear
    let year = start

    for (; year <= end; year += 1) {
      let pickedDate = this.getDate()
      let isCurrent = (year === Calendar.getToday().year)
      let isPicked = (year === pickedDate.year)
      let className = CLS_YEAR
      let $year = createElement('div', {
        'data-year': year
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
    let $time = elements.time.querySelector('.' + CLS_TEXT)
    let today = Calendar.getToday()
    let timer = null

    let renderTime = () => {
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
    Calendar.DOM.setAttribute($today, 'data-date', today.value)

    renderTime()

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
    let $el = evt.delegateTarget
    let time = $el.getAttribute('data-date')
    let picked

    this.pickDate($el)

    picked = this.getPicked()

    console.log('------------- _dateClick -------------')
    if (this.get('pickMode') === 'single') {
      console.log(time)
    } else {
      console.log(picked)
    }

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
    let $month = evt.delegateTarget
    let time = $month.getAttribute('data-month')

    this.pickMonth($month)

    console.log('------------- _monthClick -------------')
    console.log(time)

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
    let $el = evt.delegateTarget
    let time = $el.getAttribute('data-year')

    this.pickYear($el)

    console.log('------------- _yearClick -------------')
    console.log(time)

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
    let time = Calendar.getToday().text

    this.pickToday()

    // 触发日期选择逻辑
    this.pickDate(elements.dates.querySelector('[data-date="' + time + '"]'))

    console.log('------------- _todayClick -------------')
    console.log(time)

    return this
  }

  /**
   * 获得年份信息
   * ========================================================================
   * @param {String|Number} [val] - 表示年份的字符串或者数字（默认值：今年）
   * @returns {{value: (Number|{value, text, fullText}), text: string, fullText: string}}
   */
  static getYear (val) {
    let time = !val ? new Date() : new Date(val)
    let year = time.getFullYear()

    return {
      value: year,
      text: year.toString(),
      fullText: year + '年'
    }
  }

  /**
   * 获取月份信息
   * ========================================================================
   * @param {String|Number} [val] - 表示月份的字符串或者数字（默认值：本月）
   * @returns {{value: number, text: string, fullText: string}}
   */
  static getMonth (val) {
    let time = !val ? new Date() : new Date(val)
    let year = Calendar.getYear(val)
    let month = time.getMonth()

    month += 1

    return {
      value: month,
      text: year.text + '-' + month,
      fullText: year.fullText + month + '月'
    }
  }

  /**
   * 获取日期信息
   * ========================================================================
   * @param {String|Number} [val] - 表示日期的字符串或者数字（默认值：今天）
   * @returns {{year: (Number|{value, text}), month: number, date: number, day: number, text: string, fullText: string}}
   */
  static getDate (val) {
    let time = !val ? new Date() : new Date(val)
    let year = Calendar.getYear(val)
    let month = Calendar.getMonth(val)
    let date = time.getDate()
    let day = Calendar.getDay(val)
    let fullDate = year.value + '-' + month.value + '-' + date
    let text = month.fullText + date + '日'

    return {
      year: year.value,
      month: month.value,
      date: date,
      day: day.value,
      text: fullDate,
      fullText: text + ' ' + day.fullText,
      lunar: Calendar.Astronomical.getLunarDate(fullDate)
    }
  }

  /**
   * 获取星期信息
   * ========================================================================
   * @param {String|Number} [val] - 表示日期的字符串或者数字（默认值：今天）
   * @returns {{value: number, text: string, fullText: string}}
   */
  static getDay (val) {
    let time = !val ? new Date() : new Date(val)
    let day = time.getDay()
    let text = Calendar.defaults.DAYS[day]

    return {
      value: day,
      text: text,
      fullText: '星期' + text
    }
  }

  /**
   * 获取今天的日期信息
   * ========================================================================
   * @returns {{year: (Number|{value, text}), month: number, date: number, day: number, text: string, fullText: string}}
   */
  static getToday () {
    return Calendar.getDate()
  }

  /**
   * 获取年代信息
   * ========================================================================
   * @param {String|Number} [val] - 表示年份的字符串或者数字（默认值：今年）
   * @returns {{start: (number|Number|{value, text}), end: (*|number)}}
   */
  static getYears (val) {
    let year = Calendar.getYear(val).value
    let numbers = year.toString().split('')
    let lastNumber = parseInt(numbers[numbers.length - 1], 10)
    let yearsStart = 0
    let yearsEnd = 0

    if (lastNumber === 0) {
      yearsStart = year
      yearsEnd = year + 9
    } else {
      if (lastNumber === 9) {
        yearsStart = year - 9
        yearsEnd = year
      } else {
        yearsStart = year - lastNumber
        yearsEnd = year + (9 - lastNumber)
      }
    }

    return {
      start: yearsStart,
      end: yearsEnd
    }
  }

  /**
   * 获取日期所属的整个星期的日期区间信息
   * ========================================================================
   * @param {String} time - 表示日期的字符串
   * @returns {Array}
   */
  static getWeekRanges (time) {
    const DATES = Calendar.defaults.DATES
    const isLeapYear = Calendar.isLeapYear
    let day = Calendar.getDay(time).value
    let begins = time.split('-')
    let year = parseInt(begins[0], 10)
    let month = parseInt(begins[1], 10)
    let date = parseInt(begins[2], 10)
    let days = DATES[month - 1]
    let startYear = year
    let startMonth = month
    let startDate = date - day
    let endYear = year
    let endMonth = month
    let endDate = date + (6 - day)
    let prevMonth = 0

    // 闰年2月为29天，默认值为28天，所以需要+1天
    if (isLeapYear(year) && month === 2) {
      days += 1
    }

    if (startDate < 1) {
      // 上一个月
      prevMonth = month - 2
      startMonth -= 1

      if (prevMonth < 0) {
        startYear -= 1
        startMonth = 12
        startDate = DATES[11] + startDate
      } else {
        // 开始日期
        startDate = DATES[prevMonth] + startDate
      }
    }

    if (endDate > days) {
      endMonth += 1

      // 结束日期
      endDate = endDate - days

      if (prevMonth > 11) {
        endYear += 1
        endMonth = 1
      }
    }

    return Calendar.getRanges((startYear + '-' + startMonth + '-' + startDate), (endYear + '-' + endMonth + '-' + endDate))
  }

  /**
   * 获取两个日期之间的所有日期信息
   * ========================================================================
   * @param {String} begin - 表示日期的字符串
   * @param {String} end - 表示日期的字符串
   * @returns {Array}
   */
  static getRanges (begin, end) {
    const ONE_DAY_TO_SECONDS = 24 * 60 * 60 * 1000
    let ranges = []
    let begins = begin.split('-')
    let ends = end.split('-')
    let beginTime = new Date()
    let endTime = new Date()
    let beginNumber
    let endNumber
    let timeNumber

    beginTime.setUTCFullYear(parseInt(begins[0], 10), parseInt(begins[1], 10) - 1, parseInt(begins[2], 10))
    endTime.setUTCFullYear(parseInt(ends[0], 10), parseInt(ends[1], 10) - 1, parseInt(ends[2], 10))

    beginNumber = beginTime.getTime()
    endNumber = endTime.getTime()
    timeNumber = beginNumber

    for (; timeNumber <= endNumber; timeNumber += ONE_DAY_TO_SECONDS) {
      ranges.push(Calendar.getDate(timeNumber).text)
    }

    return ranges
  }

  /**
   * 获取日期的节日文本
   * ========================================================================
   * @param {Number} month - 月份的数值
   * @param {Number} date - 日期的数值
   * @returns {String}
   */
  static getFestival (month, date) {
    let monthProp = month < 10 ? '0' + month : month.toString()
    let dateProp = date < 10 ? '0' + date : date.toString()

    return Calendar.defaults.FESTIVALS[monthProp + dateProp] || ''
  }

  /**
   * 判断是否为闰年
   * ========================================================================
   * @param {Number} year - 年份数值
   * @returns {boolean}
   */
  static isLeapYear (year) {
    return ((year % 4 === 0) || (year % 400 === 0)) && (year % 100 !== 0)
  }

  /**
   * 判断是否为今天
   * ========================================================================
   * @param {String|Number} time - 表示日期的字符串或者数字
   * @returns {*}
   */
  static isToday (time) {
    return Calendar.isDatesEqual(time)
  }

  /**
   * 判断两个日期是否相等
   * ========================================================================
   * @param {String|Number} dateOne - 表示日期的字符串或者数字
   * @param {String|Number} [dateTwo] - 表示日期的字符串或者数字（默认值：今天）
   * @returns {boolean}
   */
  static isDatesEqual (dateOne, dateTwo) {
    const getDate = Calendar.getDate

    return Calendar.isEqual(getDate(dateOne).text, getDate(dateTwo).text)
  }

  /**
   * 判断两个时间是否相等
   * ========================================================================
   * @param {String|Number} timeOne - 表示日期的字符串或者数字
   * @param {String|Number} timeTwo - 表示日期的字符串或者数字
   * @returns {boolean}
   */
  static isEqual (timeOne, timeTwo) {
    return new Date(timeOne).getTime() === new Date(timeTwo).getTime()
  }
}

/**
 * 日历控件默认的配置信息
 * ========================================================================
 */
Calendar.defaults = {
  parent: 'calendar',
  time: '',
  // 0 - 日期显示模式（默认值）
  // 1 - 月份显示模式
  // 2 - 年代显示模式
  viewMode: 0,
  // single - 单选（默认值）
  // multiple - 多选
  // range - 范围多选
  // week - 整个星期选择
  pickMode: 'single',
  // 是否显示农历日期
  isLunarCalendar: false,
  // 是否显示节日（国际节日和农历节气）
  // 目前只支持国际节日
  isFestivalsDisplay: false,
  onDatePick: null,
  onMonthPick: null,
  onYearPick: null,
  onTodayPick: null,
  FESTIVALS: {
    '0101': '元旦',
    '0214': '情人节',
    '0308': '妇女节',
    '0312': '植树节',
    '0401': '愚人节',
    '0501': '劳动节',
    '0504': '青年节',
    '0512': '护士节',
    '0601': '儿童节',
    '0701': '建党节',
    '0801': '建军节',
    '0910': '教师节',
    '1001': '国庆节',
    '1224': '平安夜',
    '1225': '圣诞节'
  },
  MONTHS: [
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
    2,
    3,
    4
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
    HEADER: 'cal-hd',
    TITLE: 'cal-title',
    SWITCHER: 'cal-switcher',
    PREV: 'cal-prev',
    ICON_PREV: 'icon-angle-up',
    NEXT: 'cal-next',
    ICON_NEXT: 'icon-angle-down',
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
    LUNAR_TEXT: 'cal-lunar-text',
    FESTIVAL_TEXT: 'cal-festival-text',
    CURRENT: 'cal-current',
    PICKED: 'cal-picked',
    PICKED_RANGE: 'cal-picked-range',
    PICKED_POINT: 'cal-picked-point',
    DISABLED: 'cal-disabled',
    HIDDEN: 'cal-hidden'
  }
}

/**
 * 计算农历相关信息的（天文）算法
 * ========================================================================
 */
Calendar.Astronomical = {
  /**
   * 将儒略日期转化为公历（格里高利历）日期
   * ========================================================================
   * @param {Number} JD - 表示儒略日期的数值
   * @returns {{year: number, month: number, date: number}}
   */
  convertJD2CE: (JD) => {
    let A
    let B
    let C
    let D
    let E
    let F
    let Z
    let a
    let year
    let month
    let date

    // 由于儒略日的历元为正午12时，公历历元为半夜12时，为统一计算，将儒略历历元前推至0.5日。即为：JD = JD + 0.5
    JD += 0.5

    // 儒略日整数部分为日数，小数部分为时刻，只对整数部分进行运算
    // Z即为所求日到-4712年0时的日数
    Z = Math.floor(JD)
    F = JD - Z

    // 儒略历
    // 由于儒略历和格里历的岁长不同，需分别处理。即自1582年10月15日0时前适用儒略历（岁长365.25），
    // 此后适用格里历（岁长365.2425）。
    if (Z < 2299161) {
      A = Z
    } else {
      // 格里历
      // 为统一计算，可将格里历转换为儒略历，即假设自-4712年1月1日0时起一直使用的是儒略历。
      // 则针对格里历相对儒略历少置闰（400年3闰）的部分给予补上。由于格里历的历元符合新增置闰规则的年份，
      // 可将历元推至符合400年置闰周期的近距，即1600年1月1日，根据儒略日计算公式，得该日的儒略日为2305447.5。
      a = Math.floor((Z - 2305447.5) / 36524.25)
      // 再补上1582年10月4日到10月15日跳过的10天，即为自-4712年1月1日0时到所求日以儒略历计算的总积日
      A = Z + 10 + a - Math.floor(a / 4)
    }

    // 为避免对负数取整的情况，将历元前推至-4716年3月1日0时，需补上相差的日数，合1524日
    B = A + 1524
    // 对所得的积日（儒略历），除以岁长，即为积年（表达式C）
    C = parseInt((B - 122.1) / 365.25)
    // 其中整数部分为年的积日（表达式D）
    D = parseInt(365.25 * C)
    E = parseInt((B - D) / 30.6)
    // 将B-D除以每月平均日数30.6为积月（表达式E），其中整数部分为月数，小数部分为日数（date）
    date = parseInt(B - D - parseInt(30.6 * E) + F)

    // 最后调整岁首的情况可得month和year
    if (E < 14) {
      month = E - 1
    } else {
      if (E < 16) {
        month = E - 13
      }
    }

    if (month > 2) {
      year = C - 4716
    } else {
      if ([
        1,
        2
      ].includes(month)) {
        year = C - 4715
      }
    }

    return {
      year,
      month,
      date,
      value: year + '-' + month + '-' + date,
      text: year + '年' + month + '月' + date + '日'
    }
  },
  /**
   * 将公历（格里高利历）日期转化为儒略日期
   * ========================================================================
   * @param {String|Number} time - 表示日期的数值
   * @returns {number}
   */
  convertCE2JD: (time) => {
    let ce = Calendar.getDate(time)
    let year = ce.year
    let month = ce.month
    let date = ce.date
    let M = 0
    let Y = 0
    let B = 0
    let JD

    if ([
      1,
      2
    ].includes(month)) {
      M = month + 12
      Y = year - 1
    } else {
      Y = year
      M = month
    }

    if (Y > 1582 || (Y === 1582 && M > 10) || (Y === 1582 && M === 10 && date >= 15)) {
      // 公元1582年10月15日以后每400年减少3闰
      B = 2 - parseInt(Y / 100) + parseInt(Y / 400)
    }

    JD = Math.floor(365.25 * (Y + 4716)) + parseInt(30.6 * (M + 1)) + date + B - 1524.5

    return JD
  },
  /**
   * 将公历年份转化为农历对应的生肖年
   * ========================================================================
   * @param {String|Number} time - 表示时间的字符串或者数值
   * @returns {string}
   */
  getLunarZodiac: (time) => {
    const ZODIAC = [
      '鼠',
      '牛',
      '虎',
      '兔',
      '龙',
      '蛇',
      '马',
      '羊',
      '猴',
      '鸡',
      '狗',
      '猪'
    ]
    let diff = new Date(time).getFullYear() - 1864

    return ZODIAC[diff % 12]
  },
  /**
   * 将公历年份转化为农历年份
   * ========================================================================
   * @param {String|Number} time - 表示时间的字符串或者数值
   * @returns {string}
   */
  getLunarYear: (time) => {
    const HEAVENLY_STEMS = [
      '甲',
      '乙',
      '丙',
      '丁',
      '戊',
      '己',
      '庚',
      '辛',
      '壬',
      '癸'
    ]
    const EARTHLY_BRANCHES = [
      '子',
      '丑',
      '寅',
      '卯',
      '辰',
      '巳',
      '午',
      '未',
      '申',
      '酉',
      '戌',
      '亥'
    ]
    let diff = new Date(time).getFullYear() - 1864

    return HEAVENLY_STEMS[diff % 10] + EARTHLY_BRANCHES[diff % 12]
  },

  getLunarMonth: (time) => {
    const MONTHS = [
      '正',
      '二',
      '三',
      '四',
      '五',
      '六',
      '七',
      '八',
      '九',
      '十',
      '冬',
      '腊'
    ]
    let month = new Date(time).getMonth() - 1

    // 到了上一年的腊月
    if (month < 0) {
      month = 11
    }

    return MONTHS[month] + '月'
  },
  /**
   * 获取公历日期的农历日期
   * ========================================================================
   * @param time
   */
  getLunarDate: (time) => {
    const DATES = {
      PREFIX: [
        '初',
        '十',
        '廿'
      ],
      NUMBERS: [
        '一',
        '二',
        '三',
        '四',
        '五',
        '六',
        '七',
        '八',
        '九',
        '十'
      ]
    }
    /**
     * 获得年内日期序数
     * ========================================================================
     * @param {String} date - 表示日期的字符串
     * @returns {number}
     */
    const getDuringDays = (date) => {
      const DATES = Calendar.defaults.DATES
      let time = new Date(date)
      let year = time.getFullYear()
      let month = time.getMonth() + 1
      let total = time.getDate()

      DATES.forEach((days, i) => {
        if (i < month - 1) {
          if (Calendar.isLeapYear(year) && i === 1) {
            days += 1
          }

          total += days
        }
      })

      return total
    }
    /**
     * 算法公式：
     * ========================================================================
     * 设：公元年数 － 1977（或1901）＝ 4Q ＋ R
     * 则：阴历日期 = 14Q + 10.6(R+1) + 年内日期序数 - 29.5n
     * （注:式中Q、R、n均为自然数，R<4）
     * 例：1994年5月7日的阴历日期为：
     * 1994 － 1977 ＝ 17 ＝ 4×4＋1
     * 故：Q ＝ 4，R ＝ 1 则：5月7日的阴历日期为：
     * 14 × 4 + 10.6(1 + 1) + (31 + 28 + 31 + 30 + 7) - 29.5n
     * = 204.2- 29.5n
     * 然后用 204.2 去除 29.5 得商数 6 余 27.2，6 即是 n 值，余数 27 即是阴历二十七日
     * ========================================================================
     * @param date
     * @returns {number}
     */
    const toLunarDate = (date) => {
      const ONE_DAY_TO_SECONDS = 24 * 60 * 60 * 1000
      let time = new Date(date)
      let year = time.getFullYear()
      let Q = Math.floor((year - 1977) / 4)
      let R = (year - 1977) % 4
      let days = (14 * Q) + (10.6 * (R + 1)) + getDuringDays(date)
      let lunarDate = Math.floor(days % 29.5)

      if (lunarDate === 0) {
        let dateBefore = new Date(date).getTime() - ONE_DAY_TO_SECONDS

        // 农历只有 29 和 30 两种月份最大值
        switch (toLunarDate(dateBefore)) {
          case 28:
            lunarDate = 29

            break
          case 29:
            lunarDate = 30

            break
        }
      }

      return lunarDate
    }
    const Astronomical = Calendar.Astronomical
    let date = toLunarDate(time)
    let lunarYear = Astronomical.getLunarYear(time)
    let lunarZodiac = Astronomical.getLunarZodiac(time)
    let lunarMonth = Astronomical.getLunarMonth(time)
    let lunarDate = ''
    let text = ''

    switch (date) {
      case 10:
        lunarDate = text = '初十'

        break
      case 20:
        lunarDate = text = '二十'

        break
      case 30:
        lunarDate = text = '三十'

        break
      default:
        lunarDate = text = DATES.PREFIX[Math.floor(date / 10)] + DATES.NUMBERS[(date - 1) % 10] || date

        if (Math.floor(date / 10) === 0 && ((date - 1) % 10) === 0) {
          text = lunarMonth
        }

        break
    }

    return {
      year: lunarYear,
      month: lunarMonth,
      date: lunarDate,
      zodiac: lunarZodiac,
      text: text
    }
  },

  /**
   * 获取某年的第几个农历节气信息
   * ========================================================================
   * 这种推算的方法是建立在地球回归年的长度是固定365.2422天、节气的间隔是绝对固定的、
   * 朔望月长度是平均的29.5305天等假设之上的，由于天体运动的互相影响，这种假设不是绝对
   * 成立的，因此这种推算方法的误差较大。但我采用的是2001年的小寒数据，所以对最近几十年
   * 的节气计算还是比较准的，误差应该在2小时之内。
   * ========================================================================
   * @param {Number} year - 年份信息
   * @param {Number} i - 第几个节气（0 ~ 23）
   * @returns {{value: string, text: *}}
   */
  getLunarSolarTerm: (year, i) => {
    // 二十四个节气就是黄道上的24各点，由于地球运动受其它天体的影响，
    // 导致这些节气在每年的时间是不固定的，但是这些节气之间的间隔时间
    // 基本上可以看作是固定的，下表就是二十四节气的时间间隔表
    const TERMS = [
      {
        text: '小寒',
        diff: 0
      },
      {
        text: '大寒',
        diff: 1272494.40
      },
      {
        text: '立春',
        diff: 2548020.60
      },
      {
        text: '雨水',
        diff: 3830143.80
      },
      {
        text: '惊蛰',
        diff: 5120226.60
      },
      {
        text: '春分',
        diff: 6420865.80
      },
      {
        text: '清明',
        diff: 7732018.80
      },
      {
        text: '谷雨',
        diff: 9055272.60
      },
      {
        text: '立夏',
        diff: 10388958.00
      },
      {
        text: '小满',
        diff: 11733065.40
      },
      {
        text: '芒种',
        diff: 13084292.40
      },
      {
        text: '夏至',
        diff: 14441592.00
      },
      {
        text: '小暑',
        diff: 15800560.80
      },
      {
        text: '大暑',
        diff: 17159347.20
      },
      {
        text: '立秋',
        diff: 18513766.20
      },
      {
        text: '处暑',
        diff: 19862002.20
      },
      {
        text: '白露',
        diff: 21201005.40
      },
      {
        text: '秋分',
        diff: 22529659.80
      },
      {
        text: '寒露',
        diff: 23846845.20
      },
      {
        text: '霜降',
        diff: 25152606.00
      },
      {
        text: '立冬',
        diff: 26447687.40
      },
      {
        text: '小雪',
        diff: 27733451.40
      },
      {
        text: '大雪',
        diff: 29011921.20
      },
      {
        text: '冬至',
        diff: 30285477.60
      }
    ]
    const Astronomical = Calendar.Astronomical
    // BASE 是 2001年 小寒时刻：1月5日 14:38:00，儒略日数：2451914.5
    // 该数据是南京紫金山天文台提供的数据
    const BASE = 2451914.5
    let JD = (365.24219878 * (year - 2001) + TERMS[i].diff / 86400.0) + BASE
    let date = Astronomical.convertJD2CE(JD)

    return {
      value: date.value,
      text: TERMS[i].text
    }
  }
}

/**
 * 常用的工具方法
 * ========================================================================
 */
Calendar.Utils = {
  uuid: 0,
  isString: (o) => {
    return typeof o === 'string'
  },
  isNumber: (o) => {
    return typeof o === 'number'
  },
  isArray: (o) => {
    if (Array.isArray) {
      return Array.isArray(o)
    } else {
      return Object.prototype.toString.apply(o) === '[object Array]'
    }
  },
  isFunction: (o) => {
    return (typeof o === 'function') || Object.prototype.toString.apply(o) === '[object Function]'
  },
  isElement: (o) => {
    return o && o.nodeName && o.tagName && o.nodeType === 1
  },
  isEmpty: (str) => {
    return Calendar.Utils.isString(str) && str === ''
  },
  guid: (prefix) => {
    let Utils = Calendar.Utils

    Utils.uuid += 1

    return prefix ? prefix + '-' + Utils.uuid : 'guid-' + Utils.uuid
  },
  trim: (str) => {
    return str.replace(/^\s+/g, '').replace(/\s+$/g, '')
  },
  stripTags: (str) => {
    return str.replace(/<\/?[^>]+(>|$)/g, '')
  }
}

/**
 * DOM 操作相关的工具方法
 * ========================================================================
 */
Calendar.DOM = {
  /**
   * 创建 DOM 节点，并添加属性和子节点
   * ========================================================================
   * @param {String} tagName - 标签名称
   * @param {Object} attributes - 属性对象
   * @param {Array} children - 子节点数组
   * @returns {HTMLElement}
   */
  createElement: (tagName, attributes, children) => {
    const Utils = Calendar.Utils
    let element = document.createElement(tagName)

    for (let attr in attributes) {
      if (attributes.hasOwnProperty(attr)) {
        Calendar.DOM.setAttribute(element, attr, attributes[attr])
      }
    }

    if (Utils.isArray(children)) {
      children.forEach((child) => {
        let childNode

        if (Utils.isElement(child)) {
          childNode = child
        } else {
          if (Utils.isString(child) || Utils.isNumber(child)) {
            let text = Utils.isString(child) ? Utils.trim(Utils.stripTags(child)) : child.toString()

            childNode = document.createTextNode(text)
          }
        }

        element.appendChild(childNode)
      })
    }

    return element
  },
  /**
   * 给 DOM 节点设置属性/值
   * ========================================================================
   * @param {HTMLElement} el - DOM 节点
   * @param {String} attr - 属性名称
   * @param {String|Number|Boolean} value - 属性值
   */
  setAttribute: (el, attr, value) => {
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
  },
  /**
   * 检测 DOM 节点是否包含名为 className 的样式
   * ========================================================================
   * @param {HTMLElement} el - DOM 节点
   * @param {String} className - 样式名称
   * @returns {*}
   */
  hasClass (el, className) {
    let allClass = el.className

    if (!allClass) {
      return false
    }

    return allClass.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
  },
  /**
   * 给 DOM 节点添加名为 className 的样式
   * ========================================================================
   * @param {HTMLElement} el - DOM 节点
   * @param {String} className - 样式名称
   * @returns {Boolean}
   */
  addClass (el, className) {
    let allClass = el.className

    if (Calendar.DOM.hasClass(el, className)) {
      return false
    }

    allClass += allClass.length > 0 ? ' ' + className : className

    el.className = allClass
  },
  /**
   * 移除 DOM 节点的 className 样式
   * ========================================================================
   * @param {HTMLElement} el - DOM 节点
   * @param {String} className - 样式名称
   * @returns {Boolean}
   */
  removeClass (el, className) {
    let allClass = el.className

    if (!allClass || !Calendar.DOM.hasClass(el, className)) {
      return false
    }

    allClass = Calendar.Utils.trim(allClass.replace(className, ''))

    el.className = allClass
  }
}

/**
 * 代理事件
 * ========================================================
 * 说明：代码修改至 Nicolas Gallagher 的 delegate.js
 * 项目 GitHub 地址：https://github.com/necolas/delegate.js
 * ========================================================
 */
Calendar.Delegate = {
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
   */
  on (el, selector, type, callback, context, capture, /* private */ once) {
    const Delegate = Calendar.Delegate
    const wrapper = function (e) {
      let delegateTarget = Delegate.getDelegateTarget(el, e.target, selector)

      e.delegateTarget = delegateTarget

      if (delegateTarget) {
        if (once === true) {
          Delegate.off(el, type, wrapper)
        }
        callback.call(context || el, e)
      }
    }

    if (type === 'mouseenter' || type === 'mouseleave') {
      capture = true
    }

    callback._delegateWrapper = callback
    el.addEventListener(type, wrapper, capture || false)

    return callback
  },
  /**
   * 绑定只触发一次的事件
   * ========================================================================
   * @param {HTMLElement} el - 绑定代理事件的 DOM 节点
   * @param {String} selector - 触发 el 代理事件的 DOM 节点的选择器
   * @param {String} type - 事件类型
   * @param {Function} callback - 绑定事件的回调函数
   * @param {Object} [context] - callback 回调函数的 this 上下文（默认值：el）
   * @param {Boolean} [capture] - 是否采用事件捕获（默认值：false - 事件冒泡）
   */
  once (el, type, selector, callback, context, capture) {
    Calendar.Delegate.on(el, type, selector, callback, context, capture, true)
  },
  /**
   * 取消事件绑定
   * ========================================================================
   * @param {HTMLElement} el - 取消绑定（代理）事件的 DOM 节点
   * @param {String} type - 事件类型
   * @param {Function} callback - 绑定事件的回调函数
   * @param {Boolean} [capture] - 是否采用事件捕获（默认值：false - 事件冒泡）
   */
  off (el, type, callback, capture) {
    if (callback._delegateWrapper) {
      callback = callback._delegateWrapper
      delete callback._delegateWrapper
    }

    if (type === 'mouseenter' || type === 'mouseleave') {
      capture = true
    }

    el.removeEventListener(type, callback, capture || false)
  },
  /**
   * 停止事件（阻止默认行为和阻止事件的捕获或冒泡）
   * ========================================================================
   * @param {Event} evt - 事件对象
   */
  stop (evt) {
    const Delegate = Calendar.Delegate

    Delegate.stopPropagation(evt)
    Delegate.preventDefault(evt)
  },
  /**
   * 终止事件在传播过程的捕获或冒泡
   * ========================================================================
   * @param {Event} evt - 事件对象
   */
  stopPropagation (evt) {
    let event = window.event

    if (evt.stopPropagation) {
      evt.stopPropagation()
    } else {
      event.cancelBubble = true
    }
  },
  /**
   * 阻止事件的默认行为
   * ========================================================================
   * @param {Event} evt - 事件对象
   */
  preventDefault (evt) {
    let event = window.event

    if (evt.preventDefault) {
      evt.preventDefault()
    } else {
      event.returnValue = false
    }
  },
  /**
   * 通过 className 获得事件代理节点的事件代理目标节点
   * ========================================================================
   * @param {HTMLElement} el - 绑定事件代理的节点
   * @param target - （触发事件后）事件的目标对象
   * @param selector - 目标节点的类选择器
   * @returns {HTMLElement|Null}
   */
  getDelegateTarget (el, target, selector) {
    while (target && target !== el) {
      if (Calendar.DOM.hasClass(target, selector.replace('.', ''))) {
        return target
      }

      target = target.parentElement
    }

    return null
  }
}
