const gulp = require('gulp')
const del = require('del')
const rename = require('gulp-rename')
const cleancss = require('gulp-clean-css')
const sass = require('gulp-sass')(require('sass'))
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')

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
    }
}

function clean() {
    return del(['dist'])
}

function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(cleancss({
            level: {
                 1: {
                      specialComments: 0 
                    } 
                } 
            }))
        .pipe(rename({ 
            basename: 'main',
            suffix: '.min', prefix : '' 
        }))
        .pipe(gulp.dest(paths.styles.dest))
}

function scripts() {
    return gulp.src(paths.scripts.src, {
        sourcemaps: true
    })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest))
}

function img() {
    return gulp.src(paths.img.src)
    .pipe(gulp.dest(paths.img.dest))
}

function fonts() {
    return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
}

function watch() {
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
    gulp.watch(paths.img.src, img)
    gulp.watch(paths.fonts.src, fonts)
}

const build = gulp.series(clean, gulp.parallel(styles, scripts, fonts, img), watch)

exports.clean = clean
exports.styles = styles
exports.scripts = scripts
exports.watch = watch
exports.build = build
exports.default = build