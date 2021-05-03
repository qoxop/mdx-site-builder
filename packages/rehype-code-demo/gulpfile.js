const { src, dest, watch, series } = require('gulp');
const babel = require('gulp-babel');
const gulpif = require('gulp-if');
const del = require('delete');

function clean() {
    return del(['lib']);
}

function build () {
    return src(['src/**/*.ts', '!src/types.ts'])
        .pipe(gulpif((file) => !/\.d\.ts$/.test(file.basename), babel({
            presets: [
                ["@babel/preset-typescript", { allowNamespaces: true }]
            ],
            plugins: [
                ['@babel/plugin-transform-modules-commonjs'],
            ],
        })))
        .pipe(dest('lib/'));
}

exports.start = function name(cb) {
    watch(['src/**/*.ts'], { ignoreInitial : false }, build);
}

exports.default = series(clean, build);