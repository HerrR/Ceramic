/**
 * Watch files for changes and run the corresponding task.
 *
 * @author Lukas Heise
 */

var config = require('../main.conf'),
  gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  runSequence = require('run-sequence'),
  livereload = require('gulp-livereload');

/*gulp.task('livereload:js', function() {
  return gulp.src(config.generated.scripts)
    .pipe(plumber())
    .pipe(livereload());
});

gulp.task('livereload:dependency', function() {
  return gulp.src(config..generated.dependency)
    .pipe(plumber())
    .pipe(livereload());
});

gulp.task('livereload:css', function() {
  return gulp.src(config..generated.styles)
    .pipe(plumber())
    .pipe(livereload());
});

gulp.task('livereload:html', function() {
  return gulp.src(config.html.all)
    .pipe(plumber())
    .pipe(livereload());
});

gulp.task('watch:js', function(done) {
  runSequence('chain:devapp', 'livereload:js', done);
});

gulp.task('watch:dependency', function(done) {
  runSequence('chain:devdependency', 'livereload:dependency', done);
});

gulp.task('watch:css', function(done) {
  runSequence('clean:styles', 'lint:styles', 'styles', 'index:dev', 'livereload:styles', done);
});

gulp.task('watch:html', function(done) {
  runSequence('lint:html', 'clean:scripts', 'html2js', 'scripts', 'index:dev', 'livereload:html', done);
});

gulp.task('watch', function() {
  livereload.listen();

  gulp.watch(config.js.application.source, ['watch:js']);
  gulp.watch(config.paths.test.e2e, ['lint:tests']);
  gulp.watch(config.paths.test.unit, ['lint:tests', 'test']);
  gulp.watch([config.js.dependency.source, config.js.development.source], ['watch:dependency']);
  gulp.watch(config.css.all, ['watch:styles']);
  gulp.watch(config.html.all, ['watch:html']);
  gulp.watch(config.config.all, ['lint:config']);
});*/
