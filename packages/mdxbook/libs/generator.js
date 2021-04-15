const yamlToExport = require("./utils/yamlToExport");
// import mdx from '@mdx-js/mdx';
// import rehypeLiveCode from 'rehype-code-demo';

const IndexTpl = (mountedId = 'root', layoutPath = '/.app/layout') => `
    import React from 'react';
    import ReactDOM from 'react-dom';
    import DataProvider from '@mdxbook/data-provider.tsx';
    import Layout from '${layoutPath}'

    ReactDOM.render(
      <React.StrictMode>
        <DataProvider><Layout /></DataProvider>
      </React.StrictMode>,
      document.getElementById('${mountedId}')
    )
`
const DataProviderTpl = (handlerPath = '/.app/modules-handler') => `
  import React from 'react';
  import modulesHandler from '${handlerPath}';
  // glob 导入
  const modules = import.meta.globEager('/**/*.mdx');
  // 数据处理, 导出 Context
  const data = modulesHandler(modules);
  export const DataContext = React.createContext(data);

  // 导出 hooks
  export const useMetaData = () => {
    return React.useContext(DataContext)
  }
  export default ({children}) => (<DataContext.Provider value={data}>{children}</DataContext.Provider>);
`

// const g = (curFilePath, codeStr, config) => {
//   const mdxCode = `import { mdx } from '@mdx-js/react';\n\n${codeStr}`;
//   return new Promise(rs => {
//     mdx(mdxCode, {
//       remarkPlugins: [],
//       rehypePlugins: [
//         [
//           rehypeLiveCode, 
//           { 
//             curFilePath,
//             workingDir: process.cwd(),
//             tempDir: process.cwd() + '/.demos',
//             viewRelative:true,
//             fileconfig: config,
//             LiveComponent: {
//               name:'LivePreviewer';
//               path:'@builtins/LivePreviewer';
//             };
//             DisplayComponent: {
//                 name:'LivePreviewer';
//                 path:'@builtins/LivePreviewer';
//             };
//           }
//         ],
//       ]
//     }).then(jsxStr => {
//         rs(jsxStr);
//     }).catch(err => {
//         mdx(mdxCode).then(jsxStr => {
//             rs(jsxStr);
//         })
//         console.warn(err);
//     });
//   })
// }

export default function myPlugin() {
  const entryId = '/@mdxbook/index.tsx';
  const providerId = '@mdxbook/data-provider.tsx';
  console.log(entryId)
  return {
    name: 'mdxbook', // 必须的，将会显示在 warning 和 error 中
    resolveId(id) {
      if (id === entryId || id === providerId) {
        return id;
      }
    },
    load(id) {
      if (id === entryId) {
        return IndexTpl();
      } else if (id === providerId) {
        return DataProviderTpl();
      }
    },
    transform(src, id) {
      if (/\.mdx$/.test(id)) {
        // console.log(id);
        // 简单处理一下 yaml 配置
        const {src: codeStr, config} = yamlToExport(src, 'config');
        // g(id.replace(process.cwd(), ''), codeStr, config).then(console.log);
        return Promise.resolve({
          code: `export default {id: Math.random(), src: "<d>99</d>"}`,
          map: null // provide source map if available
        })
      }
    }
  }
}