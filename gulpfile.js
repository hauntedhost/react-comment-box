var gulp = require('gulp');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var react = require('gulp-react');

gulp.task('templates', function () {
  gulp.src('./src/*.jsx')
      .pipe(react())
        .on('error', gutil.log)
        .on('error', gutil.beep)
        .on('error', notify.onError('ERROR: jsx templates error'))
      .pipe(gulp.dest('./build'))
      .pipe(notify('jsx templates rebuilt'));
});

gulp.task('watch', function () {
  gulp.watch('./src/*.jsx', ['templates']);
});

gulp.task('default', ['templates', 'watch']);
