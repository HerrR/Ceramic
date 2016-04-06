/**
 * Compile all dependencies into a single minified file.
 *
 * @author Lukas Heise
 */

var config = require('../main.conf'),
  gulp = require('gulp'),
  rev = require('gulp-rev'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  browserify = require('gulp-browserify'),
  sourcemaps = require('gulp-sourcemaps');

gulp.task('dependency', function() {
  return gulp.src(config.js.client.dependency.source)
    .pipe(concat(config.js.client.dependency.destination))
    .pipe(browserify({
      insertGlobals: true,
      debug: !gulp.env.production
    }))
    .pipe(rev())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.destination.client.base_dir));
});