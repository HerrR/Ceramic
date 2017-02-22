/**
 * Lint JS, CSS, HTML and JSON files
 *
 * @author Lukas Heise
 */

 var config = require('../main.conf'),
  gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  csslint = require('gulp-csslint'),
  sassLint = require('gulp-sass-lint'),
  htmlhint = require("gulp-htmlhint"),
  gulpIgnore = require('gulp-ignore'),
  jsonlint = require("gulp-jsonlint");

gulp.task('lint:js', function() {
  return gulp.src(config.js.source)
    .pipe(gulpIgnore.exclude(config.js.lint_exclude))
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('lint:gulp', function() {
  return gulp.src(config.gulp.source)
    .pipe(gulpIgnore.exclude(config.gulp.lint_exclude))
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('lint:node', function() {
  return gulp.src(config.node.source)
    .pipe(gulpIgnore.exclude(config.node.lint_exclude))
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('lint:unit', function() {
  return gulp.src(config.test.unit.source)
    .pipe(gulpIgnore.exclude(config.test.unit.lint_exclude))
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('lint:e2e', function() {
  return gulp.src(config.test.e2e.source)
    .pipe(gulpIgnore.exclude(config.test.e2e.lint_exclude))
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('lint:config', function() {
  return gulp.src(config.conf.source)
    .pipe(gulpIgnore.exclude(config.conf.lint_exclude))
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('lint:css', function() {
  return gulp.src(config.css.source)
    .pipe(gulpIgnore.exclude(config.css.lint_exclude))
    .pipe(csslint())
    .pipe(csslint.reporter());
});

gulp.task('lint:sass', function() {
  return gulp.src(config.sass.source)
    .pipe(gulpIgnore.exclude(config.sass.lint_exclude))
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('lint:html', function() {
  return gulp.src(config.html.source)
    .pipe(gulpIgnore.exclude(config.html.lint_exclude))
    .pipe(htmlhint({
      'doctype-first': false
    }))
    .pipe(htmlhint.reporter());
});

gulp.task('lint:json', function() {
  return gulp.src(config.json.source)
    .pipe(gulpIgnore.exclude(config.json.lint_exclude))
    .pipe(jsonlint())
    .pipe(jsonlint.reporter());
});

gulp.task('lint:tests', ['lint:unit', 'lint:e2e']);
gulp.task('lint', ['lint:json', 'lint:js', 'lint:node', 'lint:tests', 'lint:config', 'lint:gulp', 'lint:css', 'lint:sass', 'lint:html']);