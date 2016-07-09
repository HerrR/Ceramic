/**
 * Send files to remote computer using SSH.
 *
 * @author Lukas Heise
 */

var config = require('../main.conf'),
    fs = require('fs'),
    npmpack = require('../../package.json'),
    gulp = require('gulp'),
    ssh = require('gulp-ssh'),
    zip = require('gulp-zip'),
    plumber = require('gulp-plumber'),
    runSequence = require('run-sequence'),
    clean = require('gulp-clean');

var gulpSSH = new ssh({
  ignoreErrors: false,
  sshConfig: {
    host: process.env.PUBLISH_URL,
    port: 22,
    privateKey: fs.readFileSync(process.env.PUBLISH_IDRSA_PATH),
    username: process.env.PUBLISH_USER,
    passwod: process.env.PUBLISH_PASSWORD
  }
});

gulp.task('ssh:create', function() {
    return gulp.src(config.destination.files)
        .pipe(plumber())
        .pipe(zip('build_v' + npmpack.version + '.zip'))
        .pipe(gulp.dest('./'));
});

gulp.task('ssh:send', function() {
    return gulp.src('./build_v' + npmpack.version + '.zip')
        .pipe(gulpSSH.dest(config.publish.path));
});

gulp.task('ssh:clean', function() {
    return gulp.src('./build_v' + npmpack.version + '.zip', {read: false})
        .pipe(plumber())
        .pipe(clean());
});

gulp.task('publish', function(done) {
  runSequence('ssh:create', 'ssh:send', 'ssh:clean', 'stats', done);
});