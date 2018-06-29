var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();

// static css variables
var srcScss = 'scss/style.scss';
var distCss = 'web/css';
var minCss = 'style.css';

// static javascript variables
var srcMainJs = 'js/script.js';
var distMainJs = 'web/js';
var minMainJs = 'script.js';

// Styles
gulp.task('sass', function(){
    console.log('starting sass task');
    return gulp.src(srcScss)
        .pipe(plumber(function (err){
            console.log('Sass task error');
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sass({
            outputStyle: 'compressed'
        })) // Converts Sass to Css with gulp sass
        .pipe(concat(minCss))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(distCss))
        .pipe(browserSync.stream());
});
// /Styles

// Scripts
gulp.task('main-js', function(){
    return gulp.src(srcMainJs)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat(minMainJs))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(distMainJs))
        .pipe(browserSync.stream());
});
// /Scripts

// browserSync
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });

    gulp.watch("scss/**/*.scss", ['sass']);
    gulp.watch("js/**/*.js", ['main-js']);
});

gulp.task('default', ['browserSync'], function (){
    gulp.watch('./index.html', browserSync.reload);
});