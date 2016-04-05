/**
 * A Gulp task which generates AngularJS modules, which pre-load your HTML code into the $templateCache.
 * This way AngularJS doesn't need to request the actual HTML files anymore.
 *
 * @author Lukas Heise
 */

var config = require('../main.conf'),
  gulp = require('gulp'),
  htmlmin = require('gulp-htmlmin'),
  ngHtml2Js = require("gulp-ng-html2js");

gulp.task('html2js', function() {
  return gulp.src(config.html.angular.source)
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(ngHtml2Js({
      moduleName: config.html.angular.module_name,
      prefix: config.html.angular.prefix
    }))
    .pipe(gulp.dest(config.html.angular.destination_dir));
});
