let gulp = require('gulp');
let clean = require('gulp-clean');
let browserSync = require('browser-sync').create();
let htmlmin = require('gulp-htmlmin');
let sass = require('gulp-sass')(require('sass'));
let jsmin = require('gulp-jsmin');
let rename = require('gulp-rename');
let browserify = require('gulp-browserify');
let postcss = require('gulp-postcss');
let cssnano = require('cssnano');
let autoprefix = require('autoprefixer');
let webp = require('gulp-webp');

gulp.task('clean', () => {
    return gulp.src('dest/')
        .pipe(clean())
});

gulp.task('copy-html', () => {
    return gulp.src('./src/pages/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dest'))
        .pipe(browserSync.stream());
});

gulp.task('copy-styles', () => {
    let postcssPlugin = [
        cssnano(),
        autoprefix()
    ];
    return gulp.src(['./src/styles/*.scss'])
        .pipe(sass())
        .pipe(postcss(postcssPlugin))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dest/styles'))
        .pipe(browserSync.stream());
});

gulp.task('copy-scripts', () => {
    return gulp.src('./src/scripts/*.js')
        .pipe(browserify({}))
        .pipe(jsmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dest/scripts'))
        .pipe(browserSync.stream());
});

gulp.task('copy-images', () => {
    return gulp.src('./src/images/photo-all/**/*.{jpg,jpeg,gif,png}')
        .pipe(webp())
        .pipe(gulp.dest('./dest/images/photo-all'))
        .pipe(browserSync.stream());
});

gulp.task('copy-images-webp', () => {
    return gulp.src('./src/images/photo-all/**/*.webp')
        .pipe(gulp.dest('./dest/images/photo-all'))
        .pipe(browserSync.stream());
});

gulp.task('copy-images-png', () => {
    return gulp.src('./src/images/photo-png/**/*.{jpg,jpeg,gif,png,webp}')
        .pipe(gulp.dest('./dest/images/photo-png'))
        .pipe(browserSync.stream());
});

gulp.task('clean-images', () => {
    return gulp.src('./dest/images')
        .pipe(clean());
});

gulp.task('copy-videos', () => {
    return gulp.src('./src/videos/*')
        .pipe(gulp.dest('./dest/videos'))
        .pipe(browserSync.stream());
});

gulp.task('clean-videos', () => {
    return gulp.src('./dest/videos')
        .pipe(clean())
});

gulp.task('copy-audio', () => {
    return gulp.src('./src/audio/*')
        .pipe(gulp.dest('./dest/audio'))
        .pipe(browserSync.stream());
});

gulp.task('clean-audio', () => {
    return gulp.src('./dest/audio')
        .pipe(clean())
});

gulp.task('copy-assets', () => {
    return gulp.src('src/assets/**/*.*')
        .pipe(gulp.dest('dest/assets'))
        .pipe(browserSync.stream())
});

gulp.task('sync', () => {
    browserSync.init({
        server: {
            baseDir: './dest',
            index: 'index.html'
        }
    })
});


gulp.task('watch', () => {
    gulp.watch('./src/pages/*.html', gulp.series('copy-html'));
    gulp.watch('./src/images/**/*', gulp.series('clean-images', 'copy-images', 'copy-images-webp', 'copy-images-png'));
    gulp.watch('./src/videos/*', gulp.series('clean-videos', 'copy-videos'));
    gulp.watch('./src/audio/*', gulp.series('clean-audio', 'copy-audio'));
    gulp.watch('./src/scripts/*.js', gulp.series('copy-scripts'));
    gulp.watch('./src/scripts/modules/*.js', gulp.series('copy-scripts'));
    gulp.watch('./src/styles/*.scss', gulp.series('copy-styles'));
});

gulp.task('build', gulp.series('clean', 'copy-html', 'copy-styles', 'copy-scripts', 'copy-images', 'copy-images-webp', 'copy-images-png', 'copy-videos', 'copy-audio', 'copy-assets'));
gulp.task('build-watch', gulp.series('build', 'watch'));
gulp.task('default', gulp.parallel('build-watch', 'sync'));