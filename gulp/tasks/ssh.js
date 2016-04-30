/**
 * Send files to remote computer using SSH.
 *
 * @author Lukas Heise
 */

var config = require('../main.conf'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    ssh = require('gulp-ssh'),
    zip = require('gulp-zip'),
    plumber = require('gulp-ssh'),
    clean = require('gulp-clean');



gulp.task('ssh:create', function() {
    return gulp.src(config.destination.files)
        .pipe(plumber())
        .pipe(zip('build.zip'))
        .pipe(gulp.dest(config.destination.temp_folder));
});

gulp.task('ssh:send', function() {
    // TODO
    // gutil.env.type
    /*return gulp.src(config.destination.temp_folder + 'build.zip')
        .p*/
});

gulp.task('ssh:clean', function() {
    return gulp.src(config.destination.temp_folder + 'build.zip', {read: false})
        .pipe(plumber())
        .pipe(clean());
});

gulp.task('ssh', function(done) {
  runSequence('ssh:create', 'ssh:send', 'ssh:clean', 'stats', done);
});