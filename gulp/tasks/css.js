/**
 * Minify all CSS files.
 *
 * @author Lukas Heise
 */

var config = require('../main.conf'),
  gulp = require('gulp'),
  rev = require('gulp-rev'),
  plumber = require('gulp-plumber'),
  concat = require('gulp-concat'),
  minifyCss = require('gulp-minify-css');

gulp.task('css:screen', function() {
  return gulp.src(config.css.screen.source)
    .pipe(plumber())
    .pipe(concat(config.css.screen.destination_name))
    .pipe(rev())
    .pipe(minifyCss({
      compatibility: config.css.compatibility
    }))
    .pipe(gulp.dest(config.destination.client.base_dir));
});

gulp.task('css:print', function() {
  return gulp.src(config.css.print.source)
    .pipe(plumber())
    .pipe(concat(config.css.print.destination_name))
    .pipe(rev())
    .pipe(minifyCss({
      compatibility: config.css.compatibility
    }))
    .pipe(gulp.dest(config.destination.client.base_dir));
});

gulp.task('css', ['css:screen', 'css:print']);