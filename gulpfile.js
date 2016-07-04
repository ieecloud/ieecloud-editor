var gulp = require('gulp');

var templateCache = require('gulp-angular-templatecache');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var minifyCss = require('gulp-minify-css');
var bowerFiles = require('main-bower-files');
var angularFilesort = require('gulp-angular-filesort');
var inject = require('gulp-inject');
var series = require('stream-series');
var path = require('path');


// Vars
var src = 'src/';
var vendor = 'bower_components/';
var dst = 'dist/';
var build = 'build/';
var tplPath = 'src/**/*.tpl.html';
var jsFile = 'ieecloud-editor.min.js';
var buildTemplatesFile = 'app-templates.js';
var cssFile = 'ieecloud-editor.min.css';


gulp.task('cache-templates', function () {
    return gulp.src(tplPath)
        .pipe(templateCache(buildTemplatesFile, {
            module: 'ieecloud-editor'
        }))
        .pipe(gulp.dest(build));
});


gulp.task('concat-uglify-js', ['cache-templates'], function() {
    return gulp.src([
            src + 'app.js',
            src + '/**/*.js',
            dst + '/' + jsFile
        ])
        .pipe(concat(jsFile))
        .pipe(uglify())
        .pipe(gulp.dest(dst));
});


gulp.task('copy-app-js-to-build', function() {
    return gulp.src([
            src + 'app.js',
            src + '/**/*.js',
            '!src/**/*_test.js',
            src + '/**/*.css'

        ])
        .pipe(gulp.dest(build + src));
});

gulp.task('copy-vendor-js-to-build', function() {
    return  gulp.src(bowerFiles())
        .pipe(gulp.dest(build + vendor));
});



gulp.task('minify-css', function() {
    return gulp.src(src + '*.css')
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(concat(cssFile))
        .pipe(gulp.dest(dst));
});


gulp.task('index', function () {
    var target = gulp.src(src + 'index.html');

    var vendorJsFiles = gulp.src(bowerFiles(), {read: false});
    var appCssFiles = gulp.src([src + 'app.css']);
    var appJsFiles = gulp.src([src + '/**/*.js', '!src/**/*_test.js', '!src/app.js']).pipe(angularFilesort());
    var appTemplates = gulp.src([build + '/' + buildTemplatesFile]);
    var app = gulp.src([src + 'app.js'], {read: false});

    return target
        .pipe(inject(series(vendorJsFiles, appCssFiles ,appJsFiles, app, appTemplates)))
        .pipe(gulp.dest(build));

});




gulp.task('lint', function () {
    return gulp.src([src + 'app.js', src + '/**/*.js'])
        .pipe(eslint({
            'rules': {
                //'quotes': [2, 'single'],
                'semi': [2, 'always']
            },
            'env': {
                'browser': true
            },
            'globals': {
                'angular': true,
                'jQuery': true,
                 '$': true,
                 '_': true,
                 'describe': true,
                 'beforeEach': true,
                 'module': true,
                 'it': true,
                 'inject': true,
                 'expect': true
            },
            'extends': 'eslint:recommended'
        }))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('compile', ['concat-uglify-js', 'minify-css', 'index']);
gulp.task('build', ['lint', 'copy-app-js-to-build', 'copy-vendor-js-to-build', 'cache-templates', 'index']);

gulp.task('watch', function() {
    gulp.watch([
        src + 'app.js',
        src + '/**/*.js',
        src + '/**/*.css',
        src + 'index.html'

    ], ['build']);
});