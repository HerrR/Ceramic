/**
 * Delete all generated files.
 *
 * @author Lukas Heise
 */

/*var config = require('../main.conf'),
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    clean = require('gulp-clean');

gulp.task('clean:scripts', function() {
    return gulp.src(config.paths.main.generated.scripts, {read: false})
        .pipe(plumber())
        .pipe(clean());
});

gulp.task('clean:dependency', function() {
    return gulp.src(config.paths.main.generated.dependency, {read: false})
        .pipe(plumber())
        .pipe(clean());
});

gulp.task('clean:styles', function() {
    return gulp.src(config.paths.main.generated.styles, {read: false})
        .pipe(plumber())
        .pipe(clean());
});

gulp.task('clean', ['clean:styles', 'clean:dependency', 'clean:scripts']);*/