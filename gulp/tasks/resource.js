/**
 * Copy resources from one folder to another.
 *
 * @author Lukas Heise
 */

var config = require('../main.conf'),
  gulp = require('gulp'),
  plumber = require('gulp-plumber');

gulp.task('resources:client', function () {
    return gulp.src(config.resources.client.source)
        .pipe(gulp.dest(config.destination.client.base_dir));
});

gulp.task('resources:server', function () {
    return gulp.src(config.resources.server.source)
        .pipe(gulp.dest(config.destination.server.base_dir));
});

gulp.task('resources', ['resources:client','resources:server']);