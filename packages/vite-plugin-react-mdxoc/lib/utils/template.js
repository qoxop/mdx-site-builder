
export const IndexTpl = (mountedId = 'root', layoutPath = '/.app/layout') => `
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

export const DataProviderTpl = (handlerPath = '/.app/modules-handler') => `
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