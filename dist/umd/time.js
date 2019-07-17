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
    global.time = mod.exports;
  }
})(this, function (_exports, _utils) {
  'use strict';

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = _exports.toAllSupported = _exports.isEqual = _exports.isDatesEqual = _exports.isToday = _exports.isLeapYear = _exports.getMoments = _exports.getRanges = _exports.getWeekRanges = _exports.getYears = _exports.getToday = _exports.getDay = _exports.getDate = _exports.getMonth = _exports.getYear = void 0;

  /**
   * 获得年份信息
   * ========================================================================
   * @param {String|Number} [val] - 表示年份的字符串或者数字（默认值：今年）
   * @returns {{value: (Number|{value, text, fullText}), text: string, fullText: string}}
   */
  var getYear = function getYear(val) {
    var time = !val ? new Date() : new Date(toAllSupported(val));
    var year = time.getFullYear();
    return {
      value: year,
      text: year.toString(),
      fullText: year + '年'
    };
  };
  /**
   * 获取月份信息
   * ========================================================================
   * @param {String|Number} [val] - 表示月份的字符串或者数字（默认值：本月）
   * @returns {{value: number, text: string, fullText: string}}
   */


  _exports.getYear = getYear;

  var getMonth = function getMonth(val) {
    var time = !val ? new Date() : new Date(toAllSupported(val));
    var year = getYear(val);
    var month = time.getMonth();
    month += 1;
    return {
      value: month,
      text: year.text + '-' + month,
      fullText: year.fullText + month + '月'
    };
  };
  /**
   * 获取日期信息
   * ========================================================================
   * @param {String|Number} [val] - 表示日期的字符串或者数字（默认值：今天）
   * @returns {{year: (Number|{value, text}), month: number, date: number, day: number, text: string, fullText: string}}
   */


  _exports.getMonth = getMonth;

  var getDate = function getDate(val) {
    var time = !val ? new Date() : new Date(toAllSupported(val));
    var year = getYear(val);
    var month = getMonth(val);
    var date = time.getDate();
    var day = getDay(val);
    var fullDate = year.value + '-' + month.value + '-' + date;
    var text = month.fullText + date + '日';
    return {
      year: year.value,
      month: month.value,
      date: date,
      day: day.value,
      text: fullDate,
      fullText: text + ' ' + day.fullText
    };
  };
  /**
   * 获取星期信息
   * ========================================================================
   * @param {String|Number} [val] - 表示日期的字符串或者数字（默认值：今天）
   * @returns {{value: number, text: string, fullText: string}}
   */


  _exports.getDate = getDate;

  var getDay = function getDay(val) {
    var DAYS = ['日', '一', '二', '三', '四', '五', '六'];
    var time = !val ? new Date() : new Date(toAllSupported(val));
    var day = time.getDay();
    var text = DAYS[day];
    return {
      value: day,
      text: text,
      fullText: '星期' + text
    };
  };
  /**
   * 获取今天的日期信息
   * ========================================================================
   * @returns {{year: (Number|{value, text}), month: number, date: number, day: number, text: string, fullText: string}}
   */


  _exports.getDay = getDay;

  var getToday = function getToday() {
    return getDate();
  };
  /**
   * 获取年代信息
   * ========================================================================
   * @param {String|Number} [val] - 表示年份的字符串或者数字（默认值：今年）
   * @returns {{start: (number|Number|{value, text}), end: (*|number)}}
   */


  _exports.getToday = getToday;

  var getYears = function getYears(val) {
    var year = getYear(val).value;
    var numbers = year.toString().split('');
    var lastNumber = parseInt(numbers[numbers.length - 1], 10);
    var yearsStart = 0;
    var yearsEnd = 0;

    if (lastNumber === 0) {
      yearsStart = year;
      yearsEnd = year + 9;
    } else {
      if (lastNumber === 9) {
        yearsStart = year - 9;
        yearsEnd = year;
      } else {
        yearsStart = year - lastNumber;
        yearsEnd = year + (9 - lastNumber);
      }
    }

    return {
      start: yearsStart,
      end: yearsEnd
    };
  };
  /**
   * 获取日期所属的整个星期的日期区间信息
   * ========================================================================
   * @param {String} time - 表示日期的字符串
   * @returns {Array}
   */


  _exports.getYears = getYears;

  var getWeekRanges = function getWeekRanges(time) {
    var DATES = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var day = getDay(time).value;
    var begins = time.split('-');
    var year = parseInt(begins[0], 10);
    var month = parseInt(begins[1], 10);
    var date = parseInt(begins[2], 10);
    var days = DATES[month - 1];
    var startYear = year;
    var startMonth = month;
    var startDate = date - day;
    var endYear = year;
    var endMonth = month;
    var endDate = date + (6 - day);
    var prevMonth = 0; // 闰年2月为29天，默认值为28天，所以需要+1天

    if (isLeapYear(year) && month === 2) {
      days += 1;
    }

    if (startDate < 1) {
      // 上一个月
      prevMonth = month - 2;
      startMonth -= 1;

      if (prevMonth < 0) {
        startYear -= 1;
        startMonth = 12;
        startDate = DATES[11] + startDate;
      } else {
        // 开始日期
        startDate = DATES[prevMonth] + startDate;
      }
    }

    if (endDate > days) {
      endMonth += 1; // 结束日期

      endDate = endDate - days;

      if (prevMonth > 11) {
        endYear += 1;
        endMonth = 1;
      }
    }

    return getRanges(startYear + '-' + startMonth + '-' + startDate, endYear + '-' + endMonth + '-' + endDate);
  };
  /**
   * 获取两个日期之间的所有日期信息
   * ========================================================================
   * @param {String} begin - 表示日期的字符串
   * @param {String} end - 表示日期的字符串
   * @returns {Array}
   */


  _exports.getWeekRanges = getWeekRanges;

  var getRanges = function getRanges(begin, end) {
    var ONE_DAY_TO_SECONDS = 24 * 60 * 60 * 1000;
    var ranges = [];
    var begins = begin.split('-');
    var ends = end.split('-');
    var beginTime = new Date();
    var endTime = new Date();
    var beginNumber;
    var endNumber;
    var timeNumber;
    beginTime.setUTCFullYear(parseInt(begins[0], 10), parseInt(begins[1], 10) - 1, parseInt(begins[2], 10));
    endTime.setUTCFullYear(parseInt(ends[0], 10), parseInt(ends[1], 10) - 1, parseInt(ends[2], 10));
    beginNumber = beginTime.getTime();
    endNumber = endTime.getTime();
    timeNumber = beginNumber;

    for (; timeNumber <= endNumber; timeNumber += ONE_DAY_TO_SECONDS) {
      ranges.push(getDate(timeNumber).text);
    }

    return ranges;
  };
  /**
   * 获取当前时间，格式：2019-07-18 09:12:22
   * ========================================================================
   * @returns {string}
   */


  _exports.getRanges = getRanges;

  var getMoments = function getMoments() {
    var time = new Date();
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();

    if (month < 10) {
      month = '0' + month;
    }

    if (date < 10) {
      date = '0' + date;
    }

    if (hours < 10) {
      hours = '0' + hours;
    }

    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
  };
  /**
   * 判断是否为闰年
   * ========================================================================
   * @param {Number} year - 年份数值
   * @returns {Boolean}
   */


  _exports.getMoments = getMoments;

  var isLeapYear = function isLeapYear(year) {
    return (year % 4 === 0 || year % 400 === 0) && year % 100 !== 0;
  };
  /**
   * 判断是否为今天
   * ========================================================================
   * @param {String|Number} time - 表示日期的字符串或者数字
   * @returns {Boolean}
   */


  _exports.isLeapYear = isLeapYear;

  var isToday = function isToday(time) {
    return isDatesEqual(time);
  };
  /**
   * 判断两个日期是否相等
   * ========================================================================
   * @param {String|Number} dateOne - 表示日期的字符串或者数字
   * @param {String|Number} [dateTwo] - 表示日期的字符串或者数字（默认值：今天）
   * @returns {boolean}
   */


  _exports.isToday = isToday;

  var isDatesEqual = function isDatesEqual(dateOne, dateTwo) {
    return isEqual(getDate(dateOne).text, getDate(dateTwo).text);
  };
  /**
   * 判断两个时间是否相等
   * ========================================================================
   * @param {String|Number} timeOne - 表示日期的字符串或者数字
   * @param {String|Number} timeTwo - 表示日期的字符串或者数字
   * @returns {boolean}
   */


  _exports.isDatesEqual = isDatesEqual;

  var isEqual = function isEqual(timeOne, timeTwo) {
    return new Date(toAllSupported(timeOne)).getTime() === new Date(toAllSupported(timeTwo)).getTime();
  };
  /**
   *
   */


  _exports.isEqual = isEqual;

  var toAllSupported = function toAllSupported(time) {
    var date = [];

    if ((0, _utils.isNumber)(time)) {
      return time;
    } else {
      if ((0, _utils.isString)(time)) {
        if (time.indexOf('-')) {
          date = time.split('-');
        } else {
          if (time.indexOf('/')) {
            date = time.split('/');
          }
        }

        if (date.length === 1) {
          date.push('1');
          date.push('1');
        } else {
          if (date.length === 2) {
            // 例如：'2019-1'
            if (date[0].length === 4) {
              date.push('1');
            } else {
              // 例如：'1-2019'
              if (data[1].length === 4) {
                date.unshift('1');
              }
            }
          }
        }

        return date.join('/');
      }
    }
  };

  _exports.toAllSupported = toAllSupported;
  var Time = {
    getYear: getYear,
    getMonth: getMonth,
    getDate: getDate,
    getDay: getDay,
    getToday: getToday,
    getYears: getYears,
    getRanges: getRanges,
    isLeapYear: isLeapYear,
    isToday: isToday,
    isDatesEqual: isDatesEqual,
    isEqual: isEqual,
    toAllSupported: toAllSupported
  };
  var _default = Time;
  _exports["default"] = _default;
});