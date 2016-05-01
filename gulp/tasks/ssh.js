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

var gulpSSH = new ssh({
  ignoreErrors: false,
  sshConfig: {
    host: config.publish.url,
    port: 22,
    username: gutil.env.PUBLISH_USER || 'root',
    passwod: gutil.env.PUBLISH_PASSWORD
    privateKey: undefined //fs.readFileSync('/Users/zensh/.ssh/id_rsa')
  }
});

var config = 

gulp.task('ssh:create', function() {
    return gulp.src(config.destination.files)
        .pipe(plumber())
        .pipe(zip('build.zip'))
        .pipe(gulp.dest(config.destination.temp_folder));
});

gulp.task('ssh:send', function() {
    return gulp.src(config.destination.temp_folder + 'build.zip')
        .pipe(gulpSSH.dest(config.publish.path));
});

gulp.task('ssh:clean', function() {
    return gulp.src(config.destination.temp_folder + 'build.zip', {read: false})
        .pipe(plumber())
        .pipe(clean());
});

gulp.task('publish', function(done) {
  runSequence('ssh:create', 'ssh:send', 'ssh:clean', 'stats', done);
});