/**
 * Git tasks
 *
 * @author Lukas Heise
 */

 var config = require('../main.conf'),
    npmpack = require('../../package.json'),
    gulp = require('gulp'),
    git = require('gulp-git');

gulp.task('git:tag', function() {
    git.tag('v' + npmpack.version, 'Taged with version: v' + npmpack.version, function (err) {
        if (err) throw err;
    });
});