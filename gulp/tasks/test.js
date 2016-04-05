/**
 * Run unit tests.
 *
 * @author Lukas Heise
 */

var config = require('../main.conf'),
  gulp = require('gulp'),
  karma = require('karma').server;

gulp.task('test', function(done) {
  karma.start({
    configFile: config.test.unit.karma,
    singleRun: true
  }, done);
});