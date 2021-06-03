var mdx = require('@mdx-js/mdx');
var path = require('path')
var fs = require('fs')
var yamlParse = require('./yaml-to-export');
var myplugin = require('../lib/index');

const files = [
  path.resolve(__dirname, './demos/d1/index.mdx'),
  path.resolve(__dirname, './demos/d2/index.mdx'),
  path.resolve(__dirname, './demos/d3/index.mdx'),
]
files.forEach(item => {
  const mdxCode = fs.readFileSync(item).toString();
  const { src, config } = yamlParse(mdxCode, 'config', item);
  mdx(src, {
    remarkPlugins: [],
    rehypePlugins: [
      [
        myplugin, {
          workingDir: __dirname,
          curFilePath: item.replace(__dirname, ''),
          demopath: path.resolve(__dirname, './_demos'),
          fileconfig: config,
          viewRelative: true,
          LiveComponent: {
            name: 'LivePreviewer',
            path: '@mddoc/default-theme/live-previewer',
          },
          DisplayComponent: {
            name:'CodesDisplay',
            path:'@mddoc/default-theme/codes-display',
          }
        }
      ]
    ]
  }).then(jsx => {
    fs.writeFileSync(item.replace(/.mdx$/, '.jsx'), jsx);
  }).catch(console.warn);
});