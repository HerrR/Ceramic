/**
 * Pack the destination build.
 *
 * @author Lukas Heise
 */

var config = require('../main.conf'),
    npmpack = require('../../package.json'),
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    zip = require('gulp-zip');

gulp.task('pack', function() {
    return gulp.src(config.destination.files)
        .pipe(plumber())
        .pipe(zip('build_v' + npmpack.version + '.zip'))
        .pipe(gulp.dest(config.destination.pack_destination));
});