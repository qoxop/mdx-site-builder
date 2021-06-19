import mdx from '@mdx-js/mdx';
import rehypeCodeDemo from '@mddoc/rehype-code-demo';
import yamlToExport from './utils/yaml-to-export';
import mergeConf, { IConfig } from './utils/conf';

const IndexTpl = (mountedId = 'root', layoutPath = '/.app/layout') => `
  import React from 'react';
  import ReactDOM from 'react-dom';
  import DataProvider from '@mddoc/data-provider.tsx';
  import Layout from '${layoutPath}';

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

function tramformMdxToJsx(params: {
  code:string,
  options: {
    workingDir:string,
    curFilePath:string,
    fileconfig: {
      pure?:boolean,
      [k:string]:any,
    }
  } & IConfig
}) {
  return new Promise((resolve) => {
    mdx(params.code, {
      remarkPlugins: [],
      rehypePlugins: [
        [rehypeCodeDemo, params.options]
      ],
    }).then((jsxStr:string) => {
      resolve(jsxStr);
    }).catch((err:any) => {
        mdx(params.code).then((jsxStr:string) => {
          resolve(jsxStr);
        });
        console.warn(err);
    });
  })
}


const cwd = process.cwd();

// TODO 默认参数的配置 
module.exports = function ReactMdxoc(options: IConfig) {
  options = mergeConf(options);;
  const { Layout, ModuleHandler } = options;
  const entryId = '/@mddoc/index.tsx';
  const providerId = '@mddoc/data-provider.tsx';
  return {
    name: 'mddoc',
    resolveId(id:string) { // 拦截文档入口文件，用于动态生成代码
      if (id === entryId || id === providerId) {
        return id;
      }
    },
    load(id:string) {
      if (id === entryId) {
        return IndexTpl('mddoc-root', Layout);
      } else if (id === providerId) {
        return DataProviderTpl(ModuleHandler);
      }
    },
    /**
     * 代码转化
     * @param {*} src
     * @param {*} id
     * @returns
     */
    async transform(src: any, id: any) {
      // 只处理 mdx 文件
      if (/\.mdx$/.test(id)) {
        // 简单处理一下 yaml 配置
        const {src: codeStr, config} = yamlToExport(src, 'config');
        // 转化代码 MDX to JSX 
        const res = await tramformMdxToJsx({
          code: codeStr,
          options: {
            workingDir: cwd,
            curFilePath: id,
            fileconfig: config,
            ...options,
            viewRelative: config.viewRelative || options.viewRelative
          }
        }).then(code => ({code, map: null}));
        return res;
      }
    }
  }
}