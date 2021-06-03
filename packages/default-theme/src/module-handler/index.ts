interface Item {
  path: string;
  name: string;
  component:any;
}

interface Group {
  isGroup: boolean;
  children: Item[];
  path: string;
  name: string;
  component: any;
}

interface Category {
  isCategory: boolean;
  children: (Item | Group)[];
  path: string;
  name: string;
  component: any;
}

interface IConfig {
  filepath:string;
  category?:{
    name:string,
    path:string,
    component?:any
  };
  group?:{
    name:string,
    path:string,
    component?:any
  };
  [k:string]:any;
}

export default function modulesHandler(modules: {
  config:IConfig,
  default:any
}[], base = 'src') {
  const categories:Category[] = [];
  const tree:any = {};
  modules.forEach(md => {
    const paths = md.config.filepath.split(/\/|\\/);
    if (!md.config.category && paths[1] === base && !!paths[2] && !!paths[3]) {
      md.config.category = {
        name: paths[2],
        path: `/${paths[2]}`,
        component: paths[3] === 'index.mdx' ? md.default : undefined
      }
    }
    if (!md.config.group && paths[1] === base && !!paths[2] && !!paths[3] && !!paths[4]) {
      md.config.group = {
        name: paths[3],
        path: `${md.config.category.path}/${paths[3]}`,
        component: paths[4] === 'index.mdx' ? md.default : undefined,
      }
    }
    if (md.config.category.path) {
      if (!tree[md.config.category.path]) {
        tree[md.config.category.path] = {
          childTree: {},
          path: md.config.category.path,
          name: md.config.category.name,
          component: md.config.category.component,
          isCategory: true,
        }
      }
      if (md.config.group)
      tree[md.config.category.path].children.push()
      
    }
    
  });
  const componentsMap = {};
}