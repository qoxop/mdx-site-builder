const mdx = require('@mdx-js/mdx');
const rehypeLiveCode = require('rehype-live-code');

module.exports = {
    condition: (vfile) => vfile.extname === '.mdx',
    runner: ({file}) => {
        return new Promise((rs) => {
            // 加入运行时代码
            const mdxCode = `import { mdx } from '@mdx-js/react';\n\n${file.contents.toString()}`;
            mdx(mdxCode, {
                remarkPlugins: [],
                rehypePlugins: [
                    [
                        rehypeLiveCode, 
                        { curFilePath: file.path, componentPath: '@builtins/LivePreviewer' , componentName: 'LivePreviewer'}
                    ],
                ]
            }).then(jsxStr => {
                file.extname = '.mdx.jsx';
                file.contents = Buffer.from(jsxStr);
                rs(file);
            }).catch(err => {
                mdx(mdxCode).then(jsxStr => {
                    file.extname = '.mdx.jsx';
                    file.contents = Buffer.from(jsxStr);
                    rs(file);
                });
                console.warn(err);
            });
        })
    }
}