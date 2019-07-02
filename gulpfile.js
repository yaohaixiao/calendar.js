const gulp = require('gulp')

const autoprefixer = require('gulp-autoprefixer')
const babel = require('gulp-babel')
const clean = require('gulp-clean')
const connect = require('gulp-connect')
const eslint = require('gulp-eslint')
const htmlBeautify = require('gulp-html-beautify')
const puglint = require('gulp-pug-lint')
const pump = require('pump')
const pug = require('gulp-pug')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const sasslint = require('gulp-sass-lint')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')
const umd = require('gulp-umd')

// 创建 API 文档 HTTP 服务
gulp.task('connect', () => {
  return connect.server({
    root: 'docs',
    livereload: true
  })
})

// 清空字体
gulp.task('clean:fonts', (cb) => {
  pump(
    [
      gulp.src('docs/css/fonts/*.*'),
      gulp.src('dist/fonts/*.*'),
      clean({force: true})
    ],
    cb
  )
})

// 清空样式
gulp.task('clean:styles', (cb) => {
  pump(
    [
      gulp.src('docs/css/*.css'),
      gulp.src('dist/*.css'),
      gulp.src('dist/*.css.map'),
      clean({force: true})
    ],
    cb
  )
})

// 清空样式
gulp.task('clean:scripts', (cb) => {
  pump(
    [
      gulp.src('docs/js/*.js'),
      gulp.src('dist/*.js'),
      gulp.src('dist/*.js.map'),
      clean({force: true})
    ],
    cb
  )
})

// 清空HTML
gulp.task('clean:html', (cb) => {
  pump(
    [
      gulp.src('docs/*.html'),
      clean({force: true})
    ],
    cb
  )
})

// 清空
gulp.task('clean', gulp.parallel(
  'clean:fonts',
  'clean:styles',
  'clean:scripts',
  'clean:html'
))

// 复制字体
gulp.task('copy:fonts', (cb) => {
  pump(
    [
      gulp.src('src/styles/icons/fonts/*.*'),
      gulp.dest('docs/css/fonts'),
      gulp.dest('dist/fonts')
    ],
    cb
  )
})

gulp.task('copy', gulp.parallel(
  'copy:fonts'
))

// 校验 .pug 文件语法规范
gulp.task('lint:html', (cb) => {
  pump(
    [
      gulp.src('src/pug/**/*.pug'),
      puglint()
    ],
    cb
  )
})

// 校验 .scss 文件语法规范
gulp.task('lint:styles', (cb) => {
  pump(
    [
      gulp.src('src/styles/**/*.s+(a|c)ss'),
      sasslint(),
      sasslint.format(),
      sasslint.failOnError()
    ],
    cb
  )
})

// 校验 .js 文件ES6语法规范
gulp.task('lint:scripts', (cb) => {
  pump(
    [
      gulp.src('src/scripts/calendar.js'),
      eslint(),
      // eslint.format() outputs the lint results to the console.
      // Alternatively use eslint.formatEach() (see Docs).
      eslint.format(),
      // To have the process exit with an error code (1) on
      // lint error, return the stream and pipe to failAfterError last.
      eslint.failOnError()
    ],
    cb
  )
})

// 语法校验
gulp.task('lint', gulp.parallel(
  'lint:html',
  'lint:styles',
  'lint:scripts'
))

// 编译HTML文件
gulp.task('compile:html', (cb) => {
  pump(
    [
      gulp.src('src/pug/index.pug'),
      pug({
        verbose: true
      }),
      htmlBeautify({
        indent_size: 2,
        indent_char: ' ',
        // 这里是关键，可以让一个标签独占一行
        unformatted: true,
        // 默认情况下，body | head 标签前会有一行空格
        extra_liners: []
      }),
      gulp.dest('docs')
    ],
    cb
  )
})

// 编译样式文件
gulp.task('compile:styles', (cb) => {
  sass.compiler = require('node-sass')

  pump(
    [
      // 输出未压缩版本的 .css 文件
      gulp.src('src/styles/calendar.scss'),
      sass().on('error', sass.logError),
      autoprefixer(),
      gulp.dest('docs/css'),
      gulp.dest('dist'),
      // 输出压缩版本的 .css 文件
      gulp.src('src/styles/calendar.scss'),
      sass({
        outputStyle: 'compressed'
      }).on('error', sass.logError),
      sourcemaps.init({
        loadMaps: true
      }),
      rename({
        suffix: '.min'
      }),
      autoprefixer(),
      sourcemaps.write('./'),
      gulp.dest('dist')
    ],
    cb
  )
})

// 编辑脚本文件
gulp.task('compile:scripts', (cb) => {
  pump(
    [
      // 输出未压缩版本的 .js 文件
      gulp.src('src/scripts/calendar.js'),
      babel(),
      // gives streaming vinyl file object
      umd({
        exports: function () {
          return 'Calendar'
        },
        namespace: function () {
          return 'Calendar'
        }
      }),
      gulp.dest('docs/js'),
      gulp.dest('dist'),
      // 输出压缩版本的 .js 文件
      gulp.src('src/scripts/calendar.js'),
      sourcemaps.init({
        loadMaps: true
      }),
      babel(),
      // gives streaming vinyl file object
      umd({
        exports: function () {
          return 'Calendar'
        },
        namespace: function () {
          return 'Calendar'
        }
      }),
      uglify(),
      rename({suffix: '.min'}),
      sourcemaps.write('./'),
      gulp.dest('dist')
    ],
    cb
  )
})

// 编译所有源文件
gulp.task('compile', gulp.parallel(
  'copy',
  'compile:html',
  'compile:styles',
  'compile:scripts'
))

// 监视 src/styles/icons 目录下图标相关文件变化
gulp.task('watch:fonts', () => {
  gulp.watch([
    'src/styles/icons/**/*.*'
  ], gulp.series('copy:fonts', 'compile:styles'))
})

// 监视 src/pug 目录下 .pug 文件变化
gulp.task('watch:html', () => {
  gulp.watch([
    'src/pug/**/*.pug'
  ], gulp.series('compile:html'))
})

// 监视 src/styles 目录下 .scss 文件变化
gulp.task('watch:styles', () => {
  gulp.watch([
    'src/styles/**/*.scss'
  ], gulp.series('compile:styles'))
})

// 监视 src/scripts 目录下 .js 文件变化
gulp.task('watch:scripts', () => {
  gulp.watch([
    'src/scripts/**/*.js'
  ], gulp.series('compile:scripts'))
})

// 监视所有源文件的变化
gulp.task('watch', gulp.parallel(
  'watch:fonts',
  'watch:html',
  'watch:styles',
  'watch:scripts'
))

gulp.task('dev', gulp.parallel(
  'clean',
  'copy',
  'lint',
  'compile',
  'watch',
  'connect'
))

gulp.task('start', gulp.series(
  'dev'
))

gulp.task('build', gulp.series(
  'clean',
  'copy',
  'lint',
  'compile'
))