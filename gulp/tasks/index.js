/**
 * Generate the main index.html file.
 *
 * @author Lukas Heise
 */

var config = require('../main.conf'),
  gulp = require('gulp'),
  inject = require('gulp-inject'),
  htmlmin = require('gulp-htmlmin'),
  injectString = require('gulp-inject-string');

gulp.task('index:dist', function() {
  return gulp.src(config.html.main)
    .pipe(gulp.dest(config.destination.client.base_dir))
    .pipe(inject(gulp.src(config.html.inject, {
      read: false
    }), {
      relative: true
    }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest(config.destination.client.base_dir));
});

gulp.task('index:dev', function() {
  return gulp.src(config.html.main)
    .pipe(gulp.dest(config.destination.client.base_dir))
    .pipe(inject(gulp.src(config.html.inject, {
      read: false
    }), {
      relative: true
    }))
    .pipe(injectString.after('<!-- inject:text -->', '\n\t<script src="//localhost:35729/livereload.js"></script>'))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest(config.destination.client.base_dir));
});

gulp.task('index', ['index:dist']);