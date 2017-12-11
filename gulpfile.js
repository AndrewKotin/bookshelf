var gulp        = require('gulp'),
    del         = require('del'),
    autoprefixer= require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    sass        = require('gulp-sass'),
    concat      = require("gulp-concat"),
    watch       = require('gulp-watch'),
    batch       = require('gulp-batch'),
    plumber     = require('gulp-plumber'),
    uglify      = require('gulp-uglifyes'),
    combineMq   = require('gulp-combine-mq');



gulp.task('html', function(){
  return gulp.src('./src/pages/*.html')
    .pipe(plumber())
    .pipe(gulp.dest('build'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('clean', function () {
  return del([
    'build/*',
    ]);
});

gulp.task('images', function() {
  gulp.src(['./src/images/*', './src/images/**/*'])
  .pipe(plumber())
  .pipe(gulp.dest('./build/img'))
  .pipe(browserSync.reload({stream:true}));
});


gulp.task('fonts', function () {
  gulp.src('./src/fonts/**/*')
  .pipe(plumber())
  .pipe(gulp.dest('./build/fonts'))
  .pipe(browserSync.reload({stream:true}));
});

gulp.task('scripts', function () {
  gulp.src(['./src/js/script.js'])
  .pipe(plumber())
  .pipe(uglify())
  .pipe(concat("script.min.js"))
  .pipe(gulp.dest('./build/js'))
  .pipe(browserSync.reload({stream:true}));
});



gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "build",
            index: "index.html"
        },
        reloadOnRestart: true,
        open: false
    });

    browserSync.watch('build', browserSync.reload);
});

gulp.task('styles', function () {
  gulp.src('./src/styles/style.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(combineMq({
    beautify: false
  }))
  .pipe(autoprefixer({
    browsers: ['last 20 versions']
  }))
  .pipe(gulp.dest('./build/css'))
  .pipe(browserSync.reload({stream:true}));
});

gulp.task('watch', function () {
    watch(['./src/styles/*.scss', './src/styles/**/*.scss', './src/styles/global/*.scss', './src/blocks/**/*.scss', './src/styles/plugins/*.scss'], batch(function (events, done) {
        gulp.start('styles', done);
    }));
    watch(['./src/images/*','./src/blocks/**/images/*'], batch(function (events, done) {
        gulp.start('images', done);
    }));
    watch('./src/fonts/*', batch(function (events, done) {
        gulp.start('fonts', done);
    }));
    watch('./src/pages/*', batch(function (events, done) {
    gulp.start('html', done);
    }));
    watch('./src/js/script.js', batch(function (events, done) {
        gulp.start('scripts', done);
    }));
});

gulp.task('dev', [
  'build',
  'server',
  'watch'
]);

gulp.task('default', function () {
  gulp.start('build');
});

gulp.task('build', [
  'fonts',
  'images',
  'html',
  'scripts',
  'styles'
]);