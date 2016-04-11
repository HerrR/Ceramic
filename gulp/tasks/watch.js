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

gulp.task('livereload:js', function() {
  return gulp.src(config.js.client.generated.js)
    .pipe(plumber())
    .pipe(livereload());
});

gulp.task('livereload:dependency', function() {
  return gulp.src(config.js.client.generated.dependency)
    .pipe(plumber())
    .pipe(livereload());
});

gulp.task('livereload:css', function() {
  return gulp.src(config.css.generated)
    .pipe(plumber())
    .pipe(livereload());
});

gulp.task('livereload:html', function() {
  return gulp.src(config.html.source)
    .pipe(plumber())
    .pipe(livereload());
});

gulp.task('livereload:resources', function() {
  return gulp.src(config.resources.client.source)
    .pipe(plumber())
    .pipe(livereload());
});

/*gulp.task('watch:node', function(done) {
  runSequence('chain:server:scripts', done);
});*/

gulp.task('watch:js', function(done) {
  runSequence('lint:js', 'lint:html', 'clean:client:scripts', 'html2js', 'scripts', 'index:dev', 'livereload:js', done);
});

gulp.task('watch:dependency', function(done) {
  runSequence('lint:js','clean:client:dependency', 'dependency', 'index:dev', 'livereload:dependency', done);
});

gulp.task('watch:css', function(done) {
  runSequence('lint:css', 'clean:css', 'css', 'index:dev', 'livereload:css', done);
});

gulp.task('watch:html', function(done) {
  runSequence('lint:html', 'clean:client:scripts', 'html2js', 'scripts', 'index:dev', 'livereload:html', done);
});

gulp.task('watch:resources', function(done) {
  runSequence('resources:client', done);
});

gulp.task('watch', function() {
  livereload.listen();

  //gulp.watch(config.js.server.source, ['watch:node']);
  //gulp.watch(config.resources.client.source, ['watch:resources']);
  gulp.watch(config.js.client.source, ['watch:js']);
  gulp.watch(config.test.e2e.source, ['lint:e2e']);
  gulp.watch(config.test.unit.source, ['lint:unit', 'test']);
  gulp.watch(config.js.client.dependency.source, ['watch:dependency']);
  gulp.watch(config.css.source, ['watch:css']);
  gulp.watch(config.html.source, ['watch:html']);
  gulp.watch(config.gulp.source, ['lint:config']);

  //runSequence('developer');
  //runSequence('serve');
});
