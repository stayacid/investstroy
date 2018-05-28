'use strict';

// Подключение плагинов через переменные (connection of plugins through variables):
var gulp = require('gulp'), // Gulp
    debug = require('gulp-debug'), // Отслеживание работы тасков в терминале (operation tracking of tasks in terminal)
    autoprefixer = require('gulp-autoprefixer'), // Добавление вендорных префиксов (adding of vendor prefixers)
    concat = require('gulp-concat'), // Объединение файлов (files merger)
    csso = require('gulp-csso'), // Минификация CSS-файлов (minification of CSS files)
    del = require('del'), // Удаление папок и файлов (delete of folders and files)
    imagemin = require('gulp-imagemin'), // Оптимизация изображений (images optimization)
    plumber = require('gulp-plumber'), // Обработка ошибок (error handling)
    pngquant = require('imagemin-pngquant'), // Оптимизация PNG-изображений (PNG images optimization)
    rename = require('gulp-rename'), // Переименование файлов (files rename)
    sass = require('gulp-sass'), // sass
    uglify = require('gulp-uglify'), // Минификация JS-файлов (minification of JS files)
    sftp = require('gulp-sftp'),
    ftp = require('vinyl-ftp'),
    gutil = require('gulp-util'); 

// Задание путей к используемым файлам и папкам (paths to folders and files):
var paths = {
  dir: {
    app: './app',
    dist: './dist'
  },
  watch: {
    html: './app//*.html',// Путь для вотчера html-файлов (path for watcher to html files)
    sass: './app/sass/**/*.sass',// Путь для вотчера Sass-файлов (path for watcher to Sass files)
    js: './app/js/*.js'
  },
  app: {
    html: {
      src: './app/index.html',
      dest: './app'
    },
    common: {
      css: {
        src: './app/sass/main.sass',
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
          /*'./app/libs/fontawesome/font-awesome.min.css',
          './app/libs/mmenu/css/jquery.mmenu.all.css',
          './app/libs/css-hamburgers/hamburgers.css',
          './app/libs/owl.carousel/dist/assets/owl.carousel.min.css',
          './app/libs/fotorama/fotorama.css',
          './app/libs/selectize/css/selectize.css'*/
        ],
        dest: './app/css'
      },
      js: {
        src: [
          './app/libs/jquery/jquery-3.3.1.slim.min.js'
          /*'./app/libs/mmenu/js/jquery.mmenu.all.min.js',
          './app/libs/owl.carousel/dist/owl.carousel.min.js',
          './app/libs/equalHeights/equalheights.js',
          './app/libs/fotorama/fotorama.js',
          './app/libs/selectize/js/standalone/selectize.min.js'*/
        ],
        dest: './app/js/min'
      },
      fonts: {
        src: [
          './app/fonts/*.*'
        ],
        dest: './app/fonts'
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
      src: './app/js/min/*.min.js',
      dest: './dist/js'
    },
    fonts: {
      src: './app/fonts/**/*.*',
      dest: './dist/fonts'
    }
  }
}

// Подключение Browsersync (connection of Browsersync):
var browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

// Таск для работы Browsersync, автообновление браузера (Browsersync task, autoreload of browser):
gulp.task('serve', function() {
/*   browserSync.init({
    server: './app'
  }); */
  browserSync.init({
    server: { // Настройки сервера (server settings)
      baseDir: paths.dir.app, // Базовая директория (basic directory)
      index: 'index.html' // Индексный файл (index file)
    }
  });
/*   gulp.watch(paths.watch.pug, gulp.series('html'));
  gulp.watch(paths.watch.sass, gulp.series('cssCommon'));
  gulp.watch(paths.watch.js, gulp.series('jsCommon')); */
  gulp.watch([paths.watch.html, paths.watch.sass, paths.watch.js], gulp.series('build')); // Отслеживание изменений Pug и Sass-файлов (change tracking of Pug and Sass files)
  gulp.watch('*.html').on('change', reload);
});

// Таск для работы Pug, преобразование Pug в HTML (Pug to HTML conversion task):
/*gulp.task('html', function() {
  return gulp.src(paths.app.html.src) // Исходник таска html (source of html task)
    .pipe(plumber()) // Обработка ошибок таска html (error handling of html task) 
    .pipe(debug({title: 'Pug source'})) // Отслеживание исходника таска html (source tracking of html task)
    .pipe(pug({
      pretty: true, // Форматирование разметки в HTML-файле (code formatting in HTML file)
      doctype: 'HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"' // Установка doctype (setting of doctype)
    }))
    .pipe(debug({title: 'Pug'})) // Отслеживание работы плагина Pug (operation tracking of Pug plugin)
    .pipe(gulp.dest(paths.app.html.dest)) // Сохранение HTML-шаблона письма в папке app (save of HTML template in folder app)
    .pipe(debug({title: 'Pug dest'})) // Отслеживание сохранения HTML-шаблона (saving tracking of HTML template)
    .pipe(browserSync.stream()); // Browsersync
});*/

// Таск для преобразования sass-файлов в CSS (sass to CSS conversion):
gulp.task('cssCommon', function() {
  return gulp.src(paths.app.common.css.src) // Исходник таска css (css task source)
    .pipe(plumber()) // Обработка ошибок таска css (error handling of css task)
    .pipe(debug({title: 'Sass source'})) // Отслеживание исходника таска css (source tracking of css task)
    .pipe(concat('main.sass'))
    .pipe(sass().on('error', sass.logError)) // Преобразование Sass в CSS (Sass to CSS conversion)
    .pipe(debug({title: 'Sass'})) // Отслеживание работы плагина Sass (operation tracking of Sass plugin)
    .pipe(autoprefixer(['last 15 versions', '> 1%'], { cascade: true}))
    .pipe(gulp.dest(paths.app.common.css.dest)) // Сохранение CSS-файлов в папке app/css (saving of CSS files in folder app/css)
    .pipe(rename({suffix: '.min'}))
    .pipe(csso())
    .pipe(gulp.dest(paths.app.common.css.dest)) // Сохранение CSS-файлов в папке app/css (saving of CSS files in folder app/css)
    .pipe(debug({title: 'Sass dest'})) // Отслеживание сохранения (saving tracking)
    .pipe(browserSync.reload({stream: true})) // Browsersync
});

// Таск для объединения и минификации пользовательских JS-файлов (task for merger and minification custom JS files)
gulp.task('jsCommon', function() {
  return gulp.src(paths.app.common.js.src)
    .pipe(plumber())
    .pipe(concat('common.js'))
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
gulp.task('fontsVendor', function () {
  return gulp.src(paths.app.vendor.fonts.src)
    .pipe(gulp.dest(paths.app.vendor.fonts.dest));
});

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

gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      's29.webhost1.ru',
		user:      'login',
		password:  'pass',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
	'dist/**'
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/ivanzagainov/subs/smitler'));

});

// Таск для сборки (build task):
gulp.task('build', gulp.parallel('cssCommon', 'jsCommon', 'cssVendor', 'jsVendor', 'fontsVendor'));

// Таск для разработки (development task):
gulp.task('default', gulp.series('build', 'serve'));

// Таск для production (production task):
gulp.task('public', gulp.series('clean', 'img', 'dist'));