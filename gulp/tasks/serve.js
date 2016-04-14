/**
 * Tasks to run Node application.
 *
 * @author Lukas Heise
 */

var config = require('../main.conf'),
  gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  nodemon  = require('gulp-nodemon');

gulp.task('serve:copy', function () {
    return gulp.src(config.node.source).pipe(gulp.dest(config.destination.server.base_dir));
});

gulp.task('serve', function () {
  nodemon({ script: config.destination.server.base_dir + config.node.main,
    ext: 'html js',
    watch: config.node.source,
    ignore: [],
    tasks: ['chain:server:scripts']
  })
  .on('restart', function () {
    console.log('Restarted NodeJS');
  });
});