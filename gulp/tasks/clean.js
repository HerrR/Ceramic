/**
 * Delete all generated files.
 *
 * @author Lukas Heise
 */

var config = require('../main.conf'),
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    clean = require('gulp-clean');

gulp.task('clean:client:js', function() {
    return gulp.src(config.destination.client.js, {read: false})
        .pipe(plumber())
        .pipe(clean());
});

gulp.task('clean:css', function() {
    return gulp.src(config.destination.client.css, {read: false})
        .pipe(plumber())
        .pipe(clean());
});

gulp.task('clean:server:js', function() {
    return gulp.src(config.destination.server.js, {read: false})
        .pipe(plumber())
        .pipe(clean());
});

gulp.task('clean', ['clean:client:js', 'clean:css', 'clean:server:js']);