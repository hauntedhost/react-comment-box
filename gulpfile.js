var gulp = require('gulp')
var concat = require('gulp-concat');
var react = require('gulp-react');

gulp.task('templates', function () {
  gulp.src('./src/*.jsx')
      .pipe(react())
      .pipe(gulp.dest('./build'))
});

gulp.task('watch', function () {
  gulp.watch('./src/*.jsx', ['templates']);
});

gulp.task('default', ['templates', 'watch']);
