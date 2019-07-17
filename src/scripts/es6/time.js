'use strict'

import {
  isNumber,
  isString
} from './utils'

/**
 * 获得年份信息
 * ========================================================================
 * @param {String|Number} [val] - 表示年份的字符串或者数字（默认值：今年）
 * @returns {{value: (Number|{value, text, fullText}), text: string, fullText: string}}
 */
export const getYear = (val) => {
  let time = !val ? new Date() : new Date(toAllSupported(val))
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
export const getMonth = (val) => {
  let time = !val ? new Date() : new Date(toAllSupported(val))
  let year = getYear(val)
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
export const getDate = (val) => {
  let time = !val ? new Date() : new Date(toAllSupported(val))
  let year = getYear(val)
  let month = getMonth(val)
  let date = time.getDate()
  let day = getDay(val)
  let fullDate = year.value + '-' + month.value + '-' + date
  let text = month.fullText + date + '日'

  return {
    year: year.value,
    month: month.value,
    date: date,
    day: day.value,
    text: fullDate,
    fullText: text + ' ' + day.fullText
  }
}

/**
 * 获取星期信息
 * ========================================================================
 * @param {String|Number} [val] - 表示日期的字符串或者数字（默认值：今天）
 * @returns {{value: number, text: string, fullText: string}}
 */
export const getDay = (val) => {
  const DAYS = [
    '日',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六'
  ]
  let time = !val ? new Date() : new Date(toAllSupported(val))
  let day = time.getDay()
  let text = DAYS[day]

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
export const getToday = () => {
  return getDate()
}

/**
 * 获取年代信息
 * ========================================================================
 * @param {String|Number} [val] - 表示年份的字符串或者数字（默认值：今年）
 * @returns {{start: (number|Number|{value, text}), end: (*|number)}}
 */
export const getYears = (val) => {
  let year = getYear(val).value
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
export const getWeekRanges = (time) => {
  const DATES = [
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
  ]
  let day = getDay(time).value
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

  return getRanges((startYear + '-' + startMonth + '-' + startDate), (endYear + '-' + endMonth + '-' + endDate))
}

/**
 * 获取两个日期之间的所有日期信息
 * ========================================================================
 * @param {String} begin - 表示日期的字符串
 * @param {String} end - 表示日期的字符串
 * @returns {Array}
 */
export const getRanges = (begin, end) => {
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
    ranges.push(getDate(timeNumber).text)
  }

  return ranges
}

/**
 * 获取当前时间，格式：2019-07-18 09:12:22
 * ========================================================================
 * @returns {string}
 */
export const getMoments = () => {
  let time = new Date()
  let year = time.getFullYear()
  let month = time.getMonth() + 1
  let date = time.getDate()
  let hours = time.getHours()
  let minutes = time.getMinutes()
  let seconds = time.getSeconds()

  if (month < 10) {
    month = '0' + month
  }

  if (date < 10) {
    date = '0' + date
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

  return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds
}

/**
 * 判断是否为闰年
 * ========================================================================
 * @param {Number} year - 年份数值
 * @returns {Boolean}
 */
export const isLeapYear = (year) => {
  return ((year % 4 === 0) || (year % 400 === 0)) && (year % 100 !== 0)
}

/**
 * 判断是否为今天
 * ========================================================================
 * @param {String|Number} time - 表示日期的字符串或者数字
 * @returns {Boolean}
 */
export const isToday = (time) => {
  return isDatesEqual(time)
}

/**
 * 判断两个日期是否相等
 * ========================================================================
 * @param {String|Number} dateOne - 表示日期的字符串或者数字
 * @param {String|Number} [dateTwo] - 表示日期的字符串或者数字（默认值：今天）
 * @returns {boolean}
 */
export const isDatesEqual = (dateOne, dateTwo) => {
  return isEqual(getDate(dateOne).text, getDate(dateTwo).text)
}

/**
 * 判断两个时间是否相等
 * ========================================================================
 * @param {String|Number} timeOne - 表示日期的字符串或者数字
 * @param {String|Number} timeTwo - 表示日期的字符串或者数字
 * @returns {boolean}
 */
export const isEqual = (timeOne, timeTwo) => {
  return new Date(toAllSupported(timeOne)).getTime() === new Date(toAllSupported(timeTwo)).getTime()
}

/**
 *
 */
export const toAllSupported = (time) => {
  let date = []

  if(isNumber(time)){
    return time
  } else {
    if(isString(time)) {
      if (time.indexOf('-')) {
        date = time.split('-')
      } else {
        if (time.indexOf('/')) {
          date = time.split('/')
        }
      }

      if (date.length === 1) {
        date.push('1')
        date.push('1')
      } else{
        if (date.length === 2) {
          // 例如：'2019-1'
          if (date[0].length === 4) {
            date.push('1')
          } else {
            // 例如：'1-2019'
            if (data[1].length === 4) {
              date.unshift('1')
            }
          }
        }
      }

      return date.join('/')
    }
  }
}

const Time = {
  getYear,
  getMonth,
  getDate,
  getDay,
  getToday,
  getYears,
  getRanges,
  isLeapYear,
  isToday,
  isDatesEqual,
  isEqual,
  toAllSupported
}

export default Time
