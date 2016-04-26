/**
 * Bump build version.
 *
 * @author Lukas Heise
 */

 var config = require('../main.conf'),
    gulp = require('gulp'),
    bump = require('gulp-bump');

gulp.task('bump:patch', function() {
    return gulp.src('package.json')
        .pipe(bump({key: 'version'}))
        .pipe(gulp.dest('./'));
});

gulp.task('bump:minor', function() {
    return gulp.src('package.json')
        .pipe(bump({type:'minor', key: 'version'}))
        .pipe(gulp.dest('./'));
});

gulp.task('bump:major', function() {
    return gulp.src('package.json')
        .pipe(bump({type:'major', key: 'version'}))
        .pipe(gulp.dest('./'));
});