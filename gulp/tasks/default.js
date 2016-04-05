/**
 * Default Gulp task.
 *
 * @author Lukas Heise
 */

var gulp = require('gulp');

gulp.task('default', ['clean', 'lint', 'css', 'scripts', 'dependency', 'index', 'test', 'e2e']);