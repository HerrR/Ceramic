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
  sass = require('gulp-sass');

gulp.task('sass:screen', function() {
  return gulp.src(config.sass.screen.source)
    .pipe(plumber())
    .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(concat(config.sass.screen.destination_name))
    .pipe(rev())
    .pipe(gulp.dest(config.destination.client.base_dir));
});

gulp.task('sass', ['sass:screen']);