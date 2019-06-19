# calendar.js

[![GitHub release](https://img.shields.io/github/release/yaohaixiao/calendar.js.svg)](https://github.com/yaohaixiao/calendar.js/releases)
[![Github file size](https://img.shields.io/github/size/yaohaixiao/calendar.js/dist/calendar.min.js.svg)](https://github.com/yaohaixiao/calendar.js/blob/master/dist/calendar.min.js)
[![David](https://img.shields.io/david/yaohaixiao/calendar.js.svg)](https://david-dm.org/yaohaixiao/calendar.js)
[![David](https://img.shields.io/david/dev/yaohaixiao/calendar.js.svg)](https://david-dm.org/yaohaixiao/calendar.js?type=dev)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/yaohaixiao/calendar.js/master/LICENSE)

一个简单实用的 JavaScript 日历控件！原生 JavaScript 编写，不依赖任何第三方库。支持日期、月份和年份试图切换；支持单选、多选、范围和星期选择模式；界面简介、配置简单、使用方便！

## Features

- 原生 JavaScript 代码，无任何第三方库的依赖；
- 支持单选、多选、范围和星期选择 4 种选择方式；
- 支持年代、月份、日期 3 中不同视图的切换；
- 支持显示农历日期；
- 弹性布局，适应各种不同尺寸大小；
- 简洁大方的 UI 界面，清爽耐看；
- 配置灵活方便，简单易用；
- 代码遵循 UML 规范；

## Example

演示地址：[https://yaohaixiao.github.io/calendar.js/](https://yaohaixiao.github.io/calendar.js/)

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](https://yaohaixiao.github.io/calendar.js/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](https://yaohaixiao.github.io/calendar.js/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](https://yaohaixiao.github.io/calendar.js/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](https://yaohaixiao.github.io/calendar.js/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](https://yaohaixiao.github.io/calendar.js/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- |
| IE9, IE10, IE11, Edge| last 10 versions| last 10 versions| last 10 versions| last 10 versions

## Usage

### 日期视图模式

```js
new Calendar({
  // 设置显示位置
  parent: 'dates-view',
  // 初始化显示时间
  time: '2019-6-11',
  // viewMode：
  // 0 - 日期模式（默认值）
  viewMode: 0,
  // 配置日期选择的事件处理器 onDatePick，参数如下：
  // time - 选中的日期时间
  // $el - 点击的 DOM 节点
  // calendar - 日历控件的实例
  onDatePick: function (time, $el, calendar) {
    console.log('选择时间：', time)
    console.log('选择DOM：', $el)
    console.log('日历实例：', calendar)
  }
})
```

### 月份视图模式

```js
new Calendar({
  parent: 'months-view',
  // 设置月份
  time: '2019-7',
  // viewMode：
  // 1 - 月份模式
  viewMode: 1,
  // 配置月份选择的事件处理器 onMonthPick，参数如下：
  // time - 选中的日期时间
  // $el - 点击的 DOM 节点
  // calendar - 日历控件的实例
  onMonthPick: function (time, $el, calendar) {
    console.log('选择时间：', time)
    console.log('选择DOM：', $el)
    console.log('日历实例：', calendar)
  }
})
```

### 年代视图模式

```js
new Calendar({
  parent: 'years-view',
  // 设置年份
  time: '2021',
  // viewMode：
  // 1 - 年代模式
  viewMode: 2,
  // 配置月份选择的事件处理器 onYearPick，参数如下：
  // time - 选中的日期时间
  // $el - 点击的 DOM 节点
  // calendar - 日历控件的实例
  onYearPick: function (time, $el, calendar) {
    console.log('选择时间：', time)
    console.log('选择DOM：', $el)
    console.log('日历实例：', calendar)
  }
})
```

### 单选模式

```js
new Calendar({
  // 设置显示位置
  parent: 'single-pick',
  // 初始化显示时间（默认选中时间）
  time: '2019-6-18',
  // viewMode：
  // 0 - 日期模式（默认值）
  viewMode: 0,
  // pickMode：
  // single - 单选模式
  pickMode: 'single',
  // 配置日期选择的事件处理器 onDatePick，参数如下：
  // time - 选中的日期时间
  // $el - 点击的 DOM 节点
  // calendar - 日历控件的实例
  onDatePick: function (time, $el, calendar) {
    console.log('选择时间：', time)
    console.log('选择的 DOM 节点：', $el)
    console.log('日历实例：', calendar)
  },
  // 配置今天选择的事件处理器 onTodayPick，参数如下：
  // 1. 先切换到日期试图模式；
  // 2. 触发日期选择的业务逻辑；
  onTodayPick: function (time, $el, calendar) {
    console.log('选择时间：', time)
    console.log('选择的 DOM 节点：', $el)
    console.log('日历实例：', calendar)
  }
})
```

### 多选模式

```js
new Calendar({
  // 设置显示位置
  parent: 'multiple-pick',
  // 初始化显示时间（默认选中时间）
  time: '2019-6-19',
  // viewMode：
  // 0 - 日期模式（默认值）
  viewMode: 0,
  // pickMode：
  // multiple - 多选模式
  pickMode: 'multiple',
  // 配置日期选择的事件处理器 onDatePick，参数如下：
  // time - 选中的多个日期（已排序）时间
  // $el - 点击的 DOM 节点
  // calendar - 日历控件的实例
  onDatePick: function (time, $el, calendar) {
    console.log('选择时间：' + time)
    console.log('选择的 DOM 节点：' + $el)
    console.log('日历实例：' + calendar)
  },
  // 配置今天选择的事件处理器 onTodayPick，参数如下：
  // 1. 先切换到日期试图模式；
  // 2. 触发日期选择的业务逻辑；
  onTodayPick: function (time, $el, calendar) {
    console.log('选择时间：', time)
    console.log('选择的 DOM 节点：', $el)
    console.log('日历实例：', calendar)
  }
})
```

### 范围选择模式

```js
new Calendar({
  // 设置显示位置
  parent: 'range-pick',
  // 初始化显示时间（默认选中时间）
  time: '2019-6-20',
  // viewMode：
  // 0 - 日期模式（默认值）
  viewMode: 0,
  // pickMode：
  // range - 多选模式
  pickMode: 'range',
  // 配置日期选择的事件处理器 onDatePick，参数如下：
  // time - 选中的日期时间范围
  // $el - 点击的 DOM 节点
  // calendar - 日历控件的实例
  onDatePick: function (time, $el, calendar) {
    console.log('选择时间：' + time)
    console.log('选择的 DOM 节点：' + $el)
    console.log('日历实例：' + calendar)
  },
  // 配置今天选择的事件处理器 onTodayPick，参数如下：
  // 1. 先切换到日期试图模式；
  // 2. 触发日期选择的业务逻辑；
  onTodayPick: function (time, $el, calendar) {
    console.log('选择时间：', time)
    console.log('选择的 DOM 节点：', $el)
    console.log('日历实例：', calendar)
  }
})
```

### 星期选择模式

```js
new Calendar({
  // 设置显示位置
  parent: 'week-pick',
  // 初始化显示时间（默认选中时间）
  time: '2019-6-21',
  // viewMode：
  // 0 - 日期模式（默认值）
  viewMode: 0,
  // pickMode：
  // week - 多选模式
  pickMode: 'week',
  // 配置日期选择的事件处理器 onDatePick，参数如下：
  // time - 选中的日期时间范围
  // $el - 点击的 DOM 节点
  // calendar - 日历控件的实例
  onDatePick: function (time, $el, calendar) {
    console.log('选择时间：' + time)
    console.log('选择的 DOM 节点：' + $el)
    console.log('日历实例：' + calendar)
  },
  // 配置今天选择的事件处理器 onTodayPick，参数如下：
  // 1. 先切换到日期试图模式；
  // 2. 触发日期选择的业务逻辑；
  onTodayPick: function (time, $el, calendar) {
    console.log('选择时间：', time)
    console.log('选择的 DOM 节点：', $el)
    console.log('日历实例：', calendar)
  }
})
```

### 显示农历日期

```js
new Calendar({
    // 设置显示位置
    parent: 'lunar-calendar',
    // 初始化显示时间（默认选中时间）
    time: '2019-6-22',
    // viewMode：
    // 0 - 日期模式（默认值）
    viewMode: 0,
    // pickMode：
    // single - 单选模式
    pickMode: 'single',
    // 是否显示农历日期
    // true - 显示
    // false - 不现实
    isLunarCalendar: true,
    // 配置日期选择的事件处理器 onDatePick，参数如下：
    // time - 选中的日期时间
    // $el - 点击的 DOM 节点
    // calendar - 日历控件的实例
    onDatePick: function (time, $el, calendar) {
      console.log('选择时间：', time)
      console.log('选择的 DOM 节点：', $el)
      console.log('日历实例：', calendar)
    },
    // 配置今天选择的事件处理器 onTodayPick，参数如下：
    // 1. 先切换到日期试图模式；
    // 2. 触发日期选择的业务逻辑；
    onTodayPick: function (time, $el, calendar) {
      console.log('选择时间：', time)
      console.log('选择的 DOM 节点：', $el)
      console.log('日历实例：', calendar)
    }
})
```

## API 

### Options

#### parent
Type: `String`

Default: `calendar`

可选，用来指定显示日历控件的 DOM 节点的 ID。

#### time
Type: `String|Number`

Default: `今天`

可选，用来指定日历控件初始化显示的时间字符串或者表示时间的数字。

#### viewMode
Type: `Number`

Default: `0`

可选，用来指定日历控件初始化显示的显示模式：
* 0 - 日期显示模式；
* 1 - 月份显示模式；
* 2 - 年代显示模式； 

#### pickMode
Type: `String`

Default: `single`

可选，用来指定日历控件的选择模式：
* 'single' - 单选模式（默认值）；
* 'multiple' - 多选模式；
* 'range' - 范围选择模式；
* 'week' - 星期模式； 

#### isLunarCalendar
Type: `Boolean`

Default: `false`

可选，用来指定日历控件是否显示农历日期：
* false - 不显示；
* true - 显示；

#### onDatePick
Type: `Function`

Default: `Empty Function`

可选，选择日期后的事件处理器。参数如下：

* time - 选中的日期字符串信息（例如：'2019-06-18'），多选（多选、范围、星期）模式下则为选中的日期范围的数组（例如：'[2019-6-18, 2019-6-22]'）； 
* $el - 选中的 DOM 节点；
* calendar - 日历控件实例；

（说明：将日历控件作为日期选择器的时候需要配置此信息）

#### onMonthPick
Type: `Function`

Default: `Empty Function`

可选，选择月份后的事件处理器。参数如下：

* time - 选中的月份字符串信息（例如：'2019-06'）； 
* $el - 选中的 DOM 节点；
* calendar - 日历控件实例；

#### onYearPick
Type: `Function`

可选，选择年份后的事件处理器。参数如下：

* time - 选中的年份字符串信息（例如：'2019'）； 
* $el - 选中的 DOM 节点；
* calendar - 日历控件实例；

Default: `Empty Function`

#### onTodayPick
Type: `Function`

Default: `Empty Function`

可选，选择今天后的事件处理器。参数如下：

* time - 今天的字符串信息（例如：'2019-06-18'）； 
* $el - 选中的 DOM 节点；
* calendar - 日历控件实例；

#### DAYS
Type: `Array`

Default: `['日','一','二','三','四','五','六']`

常量，星期栏的显示信息（如果想显示英文信息，可以调整这里的文本）。

#### STYLES
Type: `Object`

常量，日历控件各个 DOM 节点的样式（如果希望自定义皮肤，可以针对性的调整配置）。

### Methods

- initialize
- render
- addEventListeners
- removeEventListeners
- reload
- destroy
- remove
- reset
- get
- set
- getEls
- getYear
- setYear
- getMonth
- setMonth
- getDate
- setDate
- getYears
- getPicked
- update
- updateViewMode
- updateView
- prev
- next
- pickDate
- pickMonth
- pickYear
- pickToday
- hide
- show
- toggle


## License

JavaScript Code Licensed under [MIT License](http://opensource.org/licenses/mit-license.html).

API Documentation Licensed under [CC BY 3.0](http://creativecommons.org/licenses/by/3.0/)
