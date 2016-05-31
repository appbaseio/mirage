var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var sass = require('gulp-sass');
var rename = require("gulp-rename");
var watch = require('gulp-watch');

var files = {
    css: {
        vandor: [
            'bower_components/font-awesome/css/font-awesome.min.css',
            'bower_components/bootstrap/dist/css/bootstrap.min.css',
            'bower_components/select2/dist/css/select2.min.css',
            'bower_components/codemirror/lib/codemirror.css',
            'bower_components/codemirror/addon/fold/foldgutter.css',
            'bower_components/codemirror/addon/dialog/dialog.css',
            'bower_components/codemirror/theme/monokai.css'
        ],
        custom: ['assets/css/*.css'],
        sassFile: ['assets/styles/*.scss']
    },
    js: {
        vendor: [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/bootstrap/dist/js/bootstrap.min.js',
            'bower_components/select2/dist/js/select2.min.js',
            'bower_components/codemirror/lib/codemirror.js',
            'bower_components/codemirror/addon/search/searchcursor.js',
            'bower_components/codemirror/addon/search/search.js',
            'bower_components/codemirror/addon/dialog/dialog.js',
            'bower_components/codemirror/addon/edit/matchbrackets.js',
            'bower_components/codemirror/addon/edit/closebrackets.js',
            'bower_components/codemirror/addon/comment/comment.js',
            'bower_components/codemirror/addon/comment/comment.js',
            'bower_components/codemirror/addon/fold/foldcode.js',
            'bower_components/codemirror/addon/fold/foldgutter.js',
            'bower_components/codemirror/addon/fold/brace-fold.js',
            'bower_components/codemirror/addon/fold/xml-fold.js',
            'bower_components/codemirror/addon/fold/markdown-fold.js',
            'bower_components/codemirror/addon/fold/comment-fold.js',
            'bower_components/codemirror/mode/javascript/javascript.js',
            'bower_components/codemirror/keymap/sublime.js',
            'node_modules/core-js/client/shim.min.js',
            'node_modules/zone.js/dist/zone.js',
            'node_modules/reflect-metadata/Reflect.js',
            'node_modules/systemjs/dist/system.src.js',
            'systemjs.config.js'
        ],
        custom: [
        ]
    }
};


gulp.task('vendorcss', function() {
    return gulp.src(files.css.vandor)
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('customcss',['sass'], function() {
    return gulp.src(files.css.custom)
        .pipe(minifyCSS())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('vendorjs', function() {
    return gulp.src(files.js.vendor)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('movefonts', function() {
    return gulp.src(['bower_components/font-awesome/fonts/*'])
        .pipe(gulp.dest('dist/fonts'));
});


gulp.task('sass', function () {
  return gulp.src(files.css.sassFile)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('assets/css'));
});

gulp.task('compact', ['customcss', 'vendorcss', 'vendorjs', 'movefonts']);

gulp.task('watchfiles', function() {
    gulp.watch(files.css.custom, ['customcss']);
});

gulp.task('default', ['compact']);

gulp.task('watch', ['compact', 'watchfiles']);