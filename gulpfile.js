var gulp = require('gulp');
var babel = require('gulp-babel');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var del = require('del');

var paths = {
  scripts: ['src/**/*.coffee']
};

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del(['build']);
});

gulp.task('scripts', ['clean'], function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.scripts)
    .pipe(coffee())
    .pipe(uglify())
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('start', function () {
  nodemon({
    script: 'dist/app.min.js'
  , ext: 'coffee js html'
  , env: { 'NODE_ENV': 'development' }
  })
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
});
// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'watch', 'start']);
