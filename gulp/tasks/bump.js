/**
 * Bump build version.
 *
 * @author Lukas Heise
 */

 var config = require('../main.conf'),
    npmpack = require('../../package.json'),
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    bump = require('gulp-bump');

gulp.task('bump:patch', function() {
    return gulp.src('../../package.json')
        .pipe(plumber())
        .pipe(bump())
        .pipe(gulp.dest('./'));
});