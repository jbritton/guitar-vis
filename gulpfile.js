var gulp = require('gulp');
var concat = require('gulp-concat');
var rimraf = require('gulp-rimraf');
var rename = require('gulp-rename');
var beautify = require('gulp-beautify');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var size = require('gulp-filesize');
var templateCache = require('gulp-angular-templatecache');

var namespace = 'guitarvis';

gulp.task('clean', function(){
    gulp.src('dist/**/*', { read: false })
        .pipe(rimraf());
});

gulp.task('buildjs', function(){
    var filename = namespace + '.js';

    return gulp.src(['src/app.js', 'src/*/**.js'])
        .pipe(concat(filename))
        .pipe(gulp.dest('dist'));
});

gulp.task('buildtemplate', function(){

    var templateOptions = {
        //base: ''              // override base path
        standalone: false,      // create a new module or use existing
        module: namespace,      // module name
        root: namespace         // template prefix
    };

    var minifyOptions = {
        empty: true,        // do not remove empty attributes
        cdata: true,        // do not strip CDATA
        comments: false,    // do not strip comments
        conditionals: true, // do not strip IE conditionals
        spare: true,        // do not remove redundant attributes
        quotes: true        // do not remove arbitrary quotes
    };

    return gulp.src('src/partial/**/*.html')
        .pipe(minifyHtml(minifyOptions))
        .pipe(templateCache(templateOptions))
        .pipe(beautify({indentSize: 2}))
        .pipe(rename({
            basename: namespace + '-tpls',
            suffix: ''
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(size());

});

gulp.task('buildpage', function(){
    return gulp.src('src/index.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['clean', 'buildjs', 'buildtemplate', 'buildpage']);

gulp.task('develop', function(){
    return gulp.watch('src/**/*.*', ['build']);
});

