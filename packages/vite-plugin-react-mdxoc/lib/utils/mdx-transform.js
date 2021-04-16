

export default const g = (curFilePath, codeStr, config) => {
  const mdxCode = `import { mdx } from '@mdx-js/react';\n\n${codeStr}`;
  return new Promise(rs => {
    mdx(mdxCode, {
      remarkPlugins: [],
      rehypePlugins: [
        [
          rehypeLiveCode, 
          { 
            curFilePath,
            workingDir: process.cwd(),
            tempDir: process.cwd() + '/.demos',
            viewRelative:true,
            fileconfig: config,
            LiveComponent: {
              name:'LivePreviewer';
              path:'@builtins/LivePreviewer';
            };
            DisplayComponent: {
                name:'LivePreviewer';
                path:'@builtins/LivePreviewer';
            };
          }
        ],
      ]
    }).then(jsxStr => {
        rs(jsxStr);
    }).catch(err => {
        mdx(mdxCode).then(jsxStr => {
            rs(jsxStr);
        })
        console.warn(err);
    });
  })
}