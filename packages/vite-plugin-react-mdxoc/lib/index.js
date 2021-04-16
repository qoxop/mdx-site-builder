const yamlToExport = require("./utils/yaml-to-export");
const { IndexTpl, DataProviderTpl } = require("./utils/template");
const mdxTransform = require('./utils/mdx-transform');

const cwd = process.cwd();

const defConf = {
  buildin: {
    ModuleHandler: '@qoxop/default-theme/lib/module-handler',
    Layout: '@qoxop/default-theme/lib/layout',
    LiveComponent: {
      name: 'LivePreviewer',
      path: '@qoxop/default-theme/live-previewer',
    },
    CodesComponent: {
      name:'CodesDisplay',
      path:'@qoxop/default-theme/codes-display',
    }
  },
  extraMdxPlugin: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
  demopath: cwd + '/.app/.demos',
  showRelative: true,
}


// TODO 默认参数的配置
export default function ReactMdxoc(options) {
  options = Object.assign({}, defConf, options);
  const { Layout, ModuleHandler, LiveComponent, CodesComponent, ...other } = options.buildin;
  const entryId = '/@mdxbook/index.tsx';
  const providerId = '@mdxbook/data-provider.tsx';
  return {
    name: 'mdxbook',
    resolveId(id) {
      if (id === entryId || id === providerId) {
        return id;
      }
    },
    load(id) {
      if (id === entryId) {
        return IndexTpl(Layout);
      } else if (id === providerId) {
        return DataProviderTpl(ModuleHandler);
      }
    },
    transform(src, id) {
      if (/\.mdx$/.test(id)) {
        // 简单处理一下 yaml 配置
        const {src: codeStr, config} = yamlToExport(src, 'config');
        // 转化代码 MDX to JSX 
        return mdxTransform(codeStr, {
            curFilePath: id, // 当前处理的文件路径，它的绝对路径 =  workingDir + self
            workingDir: process.cwd(),
            demopath: options.demopath, // demo 代码存放的目录
            showRelative: options.showRelative, // 是否显示相对路径的代码
            fileconfig: config,
            components: {
              LiveComponent,
              CodesComponent,
              ...other
            }
        }).then(code => ({code, map: null}))
      }
    }
  }
}