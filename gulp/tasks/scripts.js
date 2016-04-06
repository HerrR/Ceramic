/**
 * Fetch all production JavaScript files and create a single minified version of the files.
 *
 * @author Lukas Heise
 */

var config = require('../main.conf'),
  gulp = require('gulp'),
  rev = require('gulp-rev'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  gulpIgnore = require('gulp-ignore'),
  sourcemaps = require('gulp-sourcemaps');

gulp.task('scripts', function() {
  return gulp.src(config.js.client.source)
    .pipe(gulpIgnore.exclude(config.js.client.exclude))
    .pipe(concat(config.js.client.generated.destination))
    .pipe(rev())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.destination.client.base_dir));
});