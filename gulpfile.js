const gulp = require('gulp')
const del = require('del')
const rename = require('gulp-rename')
const cleancss = require('gulp-clean-css')
const sass = require('gulp-sass')(require('sass'))
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const imagemin = require('gulp-imagemin')
const newer = require('gulp-newer')
const autoprefixer = require('gulp-autoprefixer')
const browserSync = require('browser-sync').create()

const paths = {
    styles: {
        src: 'src/scss/**/*.scss',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/js/**/*.js',
        dest: 'dist/js/'
    },
    fonts: {
        src: 'src/fonts/**/*',
        dest: 'dist/fonts/'
    },
    img: {
        src: 'src/img/**/*',
        dest: 'dist/img/'
    },
    html: {
        src: 'src/*.html',
        dest: 'dist'
    }
}

function clean() {
    return del(['dist/*', '!dist/img'])
}

function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(autoprefixer({
			cascade: false
		}))
        .pipe(cleancss({
            level: 2
            }))
        .pipe(rename({ 
            basename: 'main',
            suffix: '.min', prefix : '' 
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream())
}

function scripts() {
    return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream())
}

function img() {
    return gulp.src(paths.img.src)
    .pipe(newer(paths.img.dest))
    .pipe(imagemin({
        progressive: true,
    }))
    .pipe(gulp.dest(paths.img.dest))
}

function fonts() {
    return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
}

function html() {
    return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    })
    gulp.watch(paths.html.src).on('change', browserSync.reload)
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
    gulp.watch(paths.img.src, img)
    gulp.watch(paths.fonts.src, fonts)
}

const build = gulp.series(clean, html, gulp.parallel(styles, scripts, fonts, img), watch)

exports.clean = clean
exports.img = img
exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.watch = watch
exports.build = build
exports.default = build