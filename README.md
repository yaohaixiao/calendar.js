# calendar.js
一个简单实用的 JavaScript 日历控件！原生 JavaScript 编写，不依赖任何第三方库。支持日期、月份和年份试图切换；支持单选、多选、范围和星期选择模式；界面简介、配置简单、使用方便！

## Features

- 原生 JavaScript 代码，无任何第三方库的依赖；
- 支持单选、多选、范围和星期选择 4 种选择方式；
- 支持年代、月份、日期 3 中不同视图的切换；
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

### 日期试图模式

```js
new Calendar({
    // 设置显示位置
    parent: 'dates-view',
    // 初始化显示时间
    time: '2019-6-11',
    // viewMode：
    // 0 - 日期模式（默认值）
    viewMode: 0,
    // 设置日期选择的自定义的事件处理器
    // time - 选中的日期（范围）时间
    // $el - 点击的 DOM 节点
    // calendar - 日历控件的实例
    onDatePick: function (time, $el, calendar) {
      alert('选择时间：' + time)
      alert('选择的 DOM 节点：' + $el)
      alert('日历实例：' + calendar)
    }
})
```

### 月份试图模式

```js
new Calendar({
    parent: 'months-view',
    // 不设置 time 默认显示今天的日期
    // time: '2019-6-11',
    // viewMode：
    // 1 - 月份模式
    viewMode: 1,
    // 设置月份选择的自定义的事件处理器
    // time - 选中的月份时间
    // $el - 点击的 DOM 节点
    // calendar - 日历控件的实例
    onMonthPick: function (time, $el, calendar) {
      console.log('选择时间：' + time)
      console.log('选择的 DOM 节点：' + $el)
      console.log('日历实例：' + calendar)
    }
})
```

### 年代试图模式

```js
new Calendar({
    parent: 'years-view',
    time: '2019-6-17',
    // viewMode：
    // 1 - 年代模式
    viewMode: 2,
    // 设置年份份选择的自定义的事件处理器
    // time - 选中的年份时间
    // $el - 点击的 DOM 节点
    // calendar - 日历控件的实例
    onYearPick: function (time, $el, calendar) {
      console.log('选择时间：' + time)
      console.log('选择的 DOM 节点：' + $el)
      console.log('日历实例：' + calendar)
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
    // time - 选中的日期时间
    // $el - 点击的 DOM 节点
    // calendar - 日历控件的实例
    onDatePick: function (time, $el, calendar) {
      console.log('选择时间：' + time)
      console.log('选择的 DOM 节点：' + $el)
      console.log('日历实例：' + calendar)
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
    // time - 选中的多个日期（已排序）时间
    // $el - 点击的 DOM 节点
    // calendar - 日历控件的实例
    onDatePick: function (time, $el, calendar) {
      console.log('选择时间：' + time)
      console.log('选择的 DOM 节点：' + $el)
      console.log('日历实例：' + calendar)
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
    // time - 选中的日期时间范围
    // $el - 点击的 DOM 节点
    // calendar - 日历控件的实例
    onDatePick: function (time, $el, calendar) {
      console.log('选择时间：' + time)
      console.log('选择的 DOM 节点：' + $el)
      console.log('日历实例：' + calendar)
    },
    // 设置点击今天的事件处理器：
    // 1. 先切换到日期试图模式；
    // 2. 触发日期选择的业务逻辑；
    onTodayPick: function (time, $el, calendar) {
      console.log('选择时间：' + time)
      console.log('选择的 DOM 节点：' + $el)
      console.log('日历实例：' + calendar)
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
    // time - 选中的日期时间范围
    // $el - 点击的 DOM 节点
    // calendar - 日历控件的实例
    onDatePick: function(time, $el, calendar) {
        console.log('选择时间：' + time)
        console.log('选择的 DOM 节点：' + $el)
        console.log('日历实例：' + calendar)
    }
})
```

## License

JavaScript Code Licensed under [MIT License](http://opensource.org/licenses/mit-license.html).

API Documentation Licensed under [CC BY 3.0](http://creativecommons.org/licenses/by/3.0/)
