
/**
 * Static code analysis
 *
 * @author Lukas Heise
 */

var config = require('../main.conf'),
  gulp = require('gulp'),
  plato = require('gulp-plato');

gulp.task('stats', function() {
    return gulp.src(config.stats)
        .pipe(plato('report', {
            jshint: {
                options: {
                    strict: true
                }
            },
            complexity: {
                trycatch: true
            }
        }));
});