const gulp = require('gulp')

const autoprefixer = require('gulp-autoprefixer')
const babel = require('gulp-babel')
const clean = require('gulp-clean')
const pump = require('pump')
const pug = require('gulp-pug')
const sass = require('gulp-sass')

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

// 编译HTML文件
gulp.task('compile:html', (cb) => {
  pump(
    [
      gulp.src('src/pug/index.pug'),
      pug({
        verbose: true
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
      gulp.src('src/styles/calendar.scss'),
      sass({
        outputStyle: 'compressed'
      }).on('error', sass.logError),
      autoprefixer(),
      gulp.dest('docs/css'),
      gulp.dest('dist')
    ],
    cb
  )
})

// 编辑脚本文件
gulp.task('compile:scripts', (cb) => {
  pump(
    [
      gulp.src('src/scripts/calendar.js'),
      babel({
        presets: ['@babel/env']
      }),
      gulp.dest('docs/js'),
      gulp.dest('dist')
    ],
    cb
  )
})

// 编译所有源文件
gulp.task('compile', gulp.parallel(
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