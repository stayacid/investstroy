'use strict';

// Подключение плагинов через переменные (connection of plugins through variables):
var gulp = require('gulp'), // Gulp
    autoprefixer = require('gulp-autoprefixer'), // Добавление вендорных префиксов (adding of vendor prefixers)
    concat = require('gulp-concat'), // Объединение файлов (files merger)
    csso = require('gulp-csso'), // Минификация CSS-файлов (minification of CSS files)
    del = require('del'), // Удаление папок и файлов (delete of folders and files)
    imagemin = require('gulp-imagemin'), // Оптимизация изображений (images optimization)
    plumber = require('gulp-plumber'), // Обработка ошибок (error handling)
    pngquant = require('imagemin-pngquant'), // Оптимизация PNG-изображений (PNG images optimization)
    rename = require('gulp-rename'), // Переименование файлов (files rename)
    sass = require('gulp-sass'), // sass
    uglify = require('gulp-uglify'); // Минификация JS-файлов (minification of JS files)

// Задание путей к используемым файлам и папкам (paths to folders and files):
var paths = {
  dir: {
    app: './app',
    dist: './dist'
  },
  watch: {
    pug: './app/*.html', //для browserSync
    sass: './app/sass/*.sass',
    js: './app/js/**/*.js'
  },
  app: {
    html: { 
      src: './app/pug/pages/*.pug', //для таска преобразования pug в html
      dest: './app'
    },
    common: { //для тасков минификации файлов
      css: {
        src: [
          './app/sass/**/*.sass'
        ],
        dest: './app/css'
      },
      js: {
        src: './app/js/*.js',
        dest: './app/js/min'
      }
    },
    vendor: {
      css: {
        src: [
          './app/libs/bootstrap-grid/bootstrap-grid.min.css'
        ],
        dest: './app/css'
      },
      js: {
        src: [
          './app/libs/jquery/jquery-3.3.1.slim.min.js'
        ],
        dest: './app/js/min'
      },
      fonts: {
        src: [
          './app/fonts/*.*'
        ],
        dest: './app/assets/fonts'
      }
    }
  },
  img: {
    src: './app/img/**/*.*',
    dest: './dist/img'
  },
  dist: {
    html: {
      src: './app/*.html',
      dest: './dist'
    },
    css: {
      src: './app/css/*.min.css',
      dest: './dist/css'
    },
    js: {
      src: './app/js/*.min.js',
      dest: './dist/js'
    },
    fonts: {
      src: './app/fonts/*.*',
      dest: './dist/fonts'
    }
  }
}

// Подключение Browsersync (connection of Browsersync):
var browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

// Таск для работы Browsersync, автообновление браузера (Browsersync task, autoreload of browser):
gulp.task('serve', function() {
  browserSync.init({
    server: './app'
  });
  /* gulp.watch(paths.watch.pug, gulp.series('html')); */
  gulp.watch('app/*.html', browserSync.reload); // Отслеживание изменений в html
  gulp.watch(paths.watch.sass, gulp.series('cssCommon'));
  gulp.watch(paths.watch.js, gulp.series('jsCommon'));
});

// Таск для работы Pug, преобразование Pug в HTML (Pug to HTML conversion task):
/* gulp.task('html', function () {
  return gulp.src(paths.app.html.src)
    .pipe(plumber())
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest(paths.app.html.dest))
    .pipe(browserSync.stream());
}); */

// Таск для преобразования sass-файлов в CSS (sass to CSS conversion):
gulp.task('cssCommon', function() {
  return gulp.src(paths.app.common.css.src) // Исходник таска css (css task source)
    .pipe(plumber()) // Обработка ошибок таска css (error handling of css task)
    .pipe(concat('main.sass'))
    .pipe(sass().on('error', sass.logError)) // Преобразование Sass в CSS (Sass to CSS conversion)
    .pipe(autoprefixer(['last 15 versions', '> 1%'], { cascade: true}))
    .pipe(gulp.dest(paths.app.common.css.dest)) // Сохранение CSS-файлов в папке app/css (saving of CSS files in folder app/css)
    .pipe(rename({suffix: '.min'}))
    .pipe(csso())
    .pipe(gulp.dest(paths.app.common.css.dest)) // Сохранение CSS-файлов в папке app/css (saving of CSS files in folder app/css)
    .pipe(browserSync.stream()); // Browsersync
});

// Таск для объединения и минификации пользовательских JS-файлов (task for merger and minification custom JS files)
gulp.task('jsCommon', function() {
  return gulp.src(paths.app.common.js.src)
    .pipe(plumber())
    .pipe(concat('common.js'))
    .pipe(gulp.dest(paths.app.common.js.dest))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(paths.app.common.js.dest))
    .pipe(browserSync.stream());
});

// Таск для объединения и минификации CSS-файлов внешних библиотек (task for merger and minification CSS files of libraries, plugins and frameworks)
gulp.task('cssVendor', function () {
  return gulp.src(paths.app.vendor.css.src)
    .pipe(concat('vendor.min.css'))
    .pipe(csso())
    .pipe(gulp.dest(paths.app.vendor.css.dest));
});

// Таск для объединения и минификации JS-файлов внешних библиотек (task for merger and minification JS files of libraries, plugins and frameworks)
gulp.task('jsVendor', function () {
  return gulp.src(paths.app.vendor.js.src)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.app.vendor.js.dest));
});

// Таск для объединения папок fonts внешних библиотек (task for merger fonts folders of libraries, plugins and frameworks)
/* gulp.task('fontsVendor', function () {
  return gulp.src(paths.app.vendor.fonts.src)
    .pipe(gulp.dest(paths.app.vendor.fonts.dest));
}); */

// Таск для предварительной очистки (удаления) production-папки (task for delete of production folder dist):
gulp.task('clean', function() {
  return del(paths.dir.dist);
});

// Таск для обработки изображений (images optimization task):
gulp.task('img', function() {
  return gulp.src(paths.img.src)
    .pipe(imagemin({use: [pngquant()]}))
    .pipe(gulp.dest(paths.img.dest));
});

// Таск для формирования production-папки (task for creating of production folder dist):
gulp.task('dist', function () {
  var htmlDist = gulp.src(paths.dist.html.src)
      .pipe(gulp.dest(paths.dist.html.dest));
  var cssDist = gulp.src(paths.dist.css.src)
      .pipe(gulp.dest(paths.dist.css.dest));
  var jsDist = gulp.src(paths.dist.js.src)
      .pipe(gulp.dest(paths.dist.js.dest));
  var fontsDist = gulp.src(paths.dist.fonts.src)
      .pipe(gulp.dest(paths.dist.fonts.dest));
  return htmlDist, cssDist, jsDist, fontsDist;
});

// Таск для сборки (build task):
gulp.task('build', gulp.parallel(/* 'html', */ 'cssCommon', 'jsCommon', 'cssVendor', 'jsVendor'/* , 'fontsVendor' */));

// Таск для разработки (development task):
gulp.task('default', gulp.series('build', 'serve'));

// Таск для production (production task):
gulp.task('public', gulp.series('clean', 'img', 'dist'));