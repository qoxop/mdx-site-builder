const {
    src,
    dest,
    watch
} = require('gulp');
const babel = require('gulp-babel');
// const myplugin = require('./lib/live-code');
// const mdx = require('@mdx-js/mdx');
// const through2 =  require('through2');

function build () {
    return src(['src/**/*.ts'])
        .pipe(babel({
            presets: [["@babel/preset-typescript", { allowNamespaces: true }]],
            plugins: ['@babel/plugin-transform-modules-commonjs']
        }))
        .pipe(dest('lib/'));
}

// exports.test = function test () {
//     return src(['test/components/**/*.mdx']).pipe(through2.obj(function (file, enc, callback) {
//         const mdxCode = `import { mdx } from '@mdx-js/react';\n\n${file.contents.toString()}`;
//         mdx(mdxCode, {
//             remarkPlugins: [],
//             rehypePlugins: [
//                 [
//                     myplugin.default, 
//                     { 
//                         workingDir: process.cwd(),
//                         curFilePath: file.path.replace(process.cwd(), ''),
//                         tempDir: process.cwd() + '/test/components/temp/',
//                         viewRelative: true,
//                         fileconfig: {},
//                         LiveComponent: {
//                             name:'LiveComponent',
//                             path:'@builtins/LiveComponent',
//                         },
//                         DisplayComponent: {
//                             name:'DisplayComponent',
//                             path:'@builtins/DisplayComponent'
//                         }
//                     }
//                 ],
//             ]
//         }).then(jsxStr => {
//             file.extname = '.mdx.jsx';
//             file.contents = Buffer.from(jsxStr);
//             callback(null, file);
//         }).catch(err => {
//             mdx(mdxCode).then(jsxStr => {
//                 file.extname = '.mdx.jsx';
//                 file.contents = Buffer.from(jsxStr);
//                 callback(null, file);
//             });
//             console.warn(err);
//         });
//     })).pipe(dest('test/components/'))
// }

exports.start = function name(cb) {
    watch(['src/**/*.ts'], { ignoreInitial : false }, build);
}

exports.default = build;