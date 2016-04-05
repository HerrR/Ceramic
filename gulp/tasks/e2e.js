/**
 * Execute E2E tests.
 *
 * @author Lukas Heise
 */

var config = require('../main.conf'),
  gulp = require('gulp'),
  protractor = require("gulp-protractor").protractor;

gulp.task('e2e', function(done) {
  gulp.src([])
    .pipe(protractor({
      configFile: config.test.e2e.protractor,
      args: ['--baseUrl', config.test.e2e.url]
    }))
    .on('end', function(e) {
      // close your server
      done();
    })
    .on('error', function(e) {
      done(e);
      // close your server
      //throw e;
    });
});