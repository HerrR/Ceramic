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

gulp.task('index', function() {
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
