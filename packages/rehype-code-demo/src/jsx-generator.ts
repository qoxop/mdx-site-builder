
import { resolve } from "path";
import { IImportInfo, IOptions } from "./types";
import parseImports from "./utils/parse-imports";
import * as ComponentCreator from './utils/component-creator';
import codeReader from './utils/code-reader';
import * as fs from 'fs';

interface IMetadata {
    /** 是否需要解析成实时代码块 */
    live?: boolean;
    /** 属性集合 */
    properties?:{[k: string]: any};
    /** demo 的序号 */
    index: number;
    /** 配置信息 */
    options: IOptions;
}

const generatorImportCode = (infos: IImportInfo[]):string => (infos.map(item => {
    if (item["*"]) {
        return `import * as ${item['*']} from "${item.moduleName}";`
    } else {
        const others = Object.keys(item.properties || {}).map(k => {
            if (k === item.properties[k]) {
                return k
            } else {
                return `${k} as ${item.properties[k]}`
            }
        }).join(', ');
        if (item.defaultProperty) {
            if (others) {
                return `import ${item.defaultProperty}, { ${others} } from "${item.moduleName}";`
            } else {
                return `import ${item.defaultProperty} from "${item.moduleName}";`
            }

        } else if (others) {
            return `import { ${others} } from "${item.moduleName}";`
        } else {
            return `import "${item.moduleName}";`
        }
    }
}).join('\n'));

/**
 * 解析代码，生成 jsx 节点
 * 副作用：往磁盘写入代码文件
 * @param code 代码字符串
 * @param metadata 元素数据，配置信息等
 * @returns 
 */
export default function generator(code:string, metadata:IMetadata) {
    const {
        live,
        properties,
        index,
        options: {
            workingDir = process.cwd(),
            curFilePath,
            demopath,
            viewRelative,
            LiveComponent,
            DisplayComponent: {
                name: DisplayComponentName
            }
        }
    } = metadata;
    // 解析出错也不要🙅影响正常的流程
    try {
        // 
        const {
            /** 去掉头部 import 后的代码字符串 */
            code: codeStr,
            /** import 代码对应的信息 */
            infos
        } = parseImports(code);
        
        /** 当前文件的相对引用文件得绝对路径列表 */
        const relativeFiles = [];
        // 路径转化
        infos.forEach(item => {
            if (/^\.\.?\//.test(item.moduleName)) { // 相对路径 => 绝对路径
                relativeFiles.push(resolve(workingDir || process.cwd(), curFilePath, item.moduleName));
                // 使用相对与工作目录来说的绝对路径引入
                item.moduleName = resolve(curFilePath, item.moduleName);
            }
        });
        // 重新生成 import code 
        const importCode = generatorImportCode(infos);
        // 每一个 demo 对应的 key 值
        const key = `${curFilePath.replace(/\/|\./g, '-').toLowerCase()}-d-${index}`;
        let demo = '';
        if (live) {
            demo = ComponentCreator.live({
                importCode,
                code: codeStr,
                properties,
                key,
                scopes: {},
                ...LiveComponent,
            });
        } else {
            demo = ComponentCreator.preview({
                mainCode: codeStr,
                importCode,
                key,
            });
        }
        // 将 demo 组件写入临时目录文件
        fs.writeFileSync(resolve(workingDir, demopath, `./${key}.demo.jsx`), demo);
        
        // 处理展示用的代码
        const codes:{code:string, language:string, type: 'main'|'minor', filename?:string}[] = [
            {
                code: live ? infos.map(item => `/* ${item.origin} */`).join('\n') + codeStr : code,
                type: 'main',
                language: 'tsx',
            }
        ];
        if (viewRelative) {
            relativeFiles.forEach(item => {
                const obj = codeReader(item);
                if (obj) {
                    codes.push({...obj, type: 'minor'});
                }
            })
        }
        return {
            // 将 demo 引入页面
            imports: `import MDX_Demo_${index} from "${resolve(demopath.replace(workingDir, ''), `./${key}.demo.jsx`)}";`,
            node: {
                type: 'jsx',
                value: ComponentCreator.codeDisplay({
                    name: DisplayComponentName,
                    demoCompName: `MDX_Demo_${index}`,
                    isLive: live,
                    properties,
                    key,
                    codes,
                }),
            }
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

