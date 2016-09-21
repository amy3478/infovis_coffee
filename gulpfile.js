/* gulpfile.js */
var gulp = require('gulp'),
	sass = require('gulp-sass');

// source and distribution folder
var source = 'src/',
	dest = 'public/';

// Bootstrap scss source
var bootstrapSass =  {
	in: './node_modules/bootstrap-sass/'
};

// Bootstrap select source
var bootstrapSelect =  {
    in: './node_modules/bootstrap-select/'
};

// Bootstrap fonts source
var fonts = {
        in: [source + 'fonts/*.*', bootstrapSass.in + 'assets/fonts/**/*'],
        out: dest + 'fonts/'
    };

// Our scss source folder: .scss files
var scss = {
    in: source + 'scss/main.scss',
    out: dest + 'css/',
    watch: source + 'scss/**/*',
    sassOpts: {
        outputStyle: 'nested',
        precison: 3,
        errLogToConsole: true,
        includePaths: [bootstrapSass.in + 'assets/stylesheets']
    }
};

var select = {
    in: bootstrapSelect.in + 'sass/bootstrap-select.scss',
    out: dest + 'css/',
    sassOpts: {
        outputStyle: 'nested',
        precison: 3,
        errLogToConsole: true
    }
};

gulp.task('select', function() {
    return gulp
        .src(select.in)
        .pipe(sass(select.sassOpts))
        .pipe(gulp.dest(select.out));
});

// copy bootstrap required fonts to dest
gulp.task('fonts',['select'], function () {
    return gulp
        .src(fonts.in)
        .pipe(gulp.dest(fonts.out));
});

// compile scss
gulp.task('sass', ['fonts'], function () {
    return gulp.src(scss.in)
        .pipe(sass(scss.sassOpts))
        .pipe(gulp.dest(scss.out));
});

// default task
gulp.task('default', ['sass'], function () {
     gulp.watch(scss.watch, ['sass']);
});

