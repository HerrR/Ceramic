/**
 * Gulp chained tasks, for convenience.
 *
 * @author Lukas Heise
 */

var gulp = require('gulp'),
  stats = require('gulp-stats'),
  runSequence = require('run-sequence');

stats(gulp);

// Recreate client scripts
gulp.task('chain:client:scripts', function(done) {
  runSequence('lint', 'clean:client:js', 'html2js', 'scripts', 'index', done);
});

// Recreate server scripts
gulp.task('chain:server:scripts', function(done) {
  runSequence('lint', 'clean:server:js', 'serve:copy', done);
});

// Recreate dependencies
gulp.task('chain:dependency', function(done) {
  runSequence('clean:client:dependency', 'dependency', 'index', done);
});

// Recreate styles
gulp.task('chain:css', function(done) {
  runSequence('clean:css', 'lint:css', 'css', done);
});

// Runs all tests, unit and e2e
gulp.task('chain:test', function(done) {
  runSequence('lint', 'test', 'e2e', done);
});

// Full build process, production
gulp.task('build', function(done) {
  runSequence('clean', 'lint', 'html2js', 'css', 'scripts', 'dependency', 'resources', 'index:dist', 'serve:copy', 'pack', 'bump:patch', 'stats', done);
});

// Full build process, development
gulp.task('developer', function(done) {
  runSequence('clean', 'lint', 'html2js', 'css', 'scripts', 'dependency', 'resources', 'index:dev', 'serve:copy', done);
});
