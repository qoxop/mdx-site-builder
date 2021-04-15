const { parallel } = require('gulp')
const path = require('path');
const componentsTasks = require('./docs/gulpfile');

const root = __dirname;

module.exports.default = parallel(
    componentsTasks({
        base: root,
        baseOutpath: path.resolve(root, './app'),
        watchMode: true,
    })
)