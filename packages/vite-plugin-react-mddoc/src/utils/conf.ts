
const defConf = {
  ModuleHandler: '@qoxop/default-theme/lib/module-handler',
  Layout: '@qoxop/default-theme/lib/layout',
  /** 实时代码组件的名字和位置 */
  LiveComponent: {
    name: 'LivePreviewer',
    path: '@qoxop/default-theme/lib/live-previewer',
  },
  /** 代码展示组件 */
  DisplayComponent: {
    name:'CodesDisplay',
    path:'@qoxop/default-theme/lib/codes-display',
  },
  /** 存放 demo 的路径 */
  demopath: process.cwd() + '/.app/demos',
  viewRelative: true,
}

export type IConfig = Partial<typeof defConf>;

export default function mergeConf(customConf: Partial<IConfig>): IConfig {
  const config = Object.assign({}, defConf, customConf);
  return config
}