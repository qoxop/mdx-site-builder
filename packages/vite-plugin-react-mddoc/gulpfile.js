const { src, dest, watch, series } = require('gulp');
const babel = require('gulp-babel');
const gulpif = require('gulp-if');
const del = require('delete');

const OUTPUT_PATH = 'dist'

function clean() {
    return del([OUTPUT_PATH]);
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
        .pipe(dest(`${OUTPUT_PATH}/`));
}

exports.start = function name() {
    watch(['src/**/*.ts'], { ignoreInitial : false }, build);
}

exports.default = series(clean, build);