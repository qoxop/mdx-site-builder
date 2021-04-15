
import { resolve } from "path";
import { IImportInfo, IOptions } from "./types";
import parseImports from "./utils/parse-imports";
import * as ComponentCreator from './utils/component-creator';
import codeReader from './utils/code-reader';
import * as fs from 'fs';


interface IMetadata {
    live?: boolean;
    /** 属性集合 */
    properties?:{[k: string]: any};
    /** demo 的序号 */
    index: number;
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

export default function generator(code:string, metadata:IMetadata) {
    const {
        live,
        properties,
        index,
        options: {
            workingDir = process.cwd(),
            curFilePath,
            tempDir,
            viewRelative,
            LiveComponent,
            DisplayComponent: {
                name: DisplayComponentName
            }
        }
    } = metadata;

    try {
        // 源码解析
        const {code: codeStr, infos} = parseImports(code);
        // 相对路径的文件
        const relativeFiles = [];
        // 路径转化
        infos.forEach(item => {
            if (/^\.\.?\//.test(item.moduleName)) { // 相对路径 => 绝对路径
                relativeFiles.push(resolve(workingDir || '', curFilePath, item.moduleName))
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
        fs.writeFileSync(resolve(workingDir, tempDir, `./demos/${key}.demo.jsx`), demo);
        
        // 处理展示用的代码
        const codes:{code:string, language:string, type: 'main'|'minor', filename?:string}[] = [
            {
                code: live ? infos.map(item => `/* ${item.origin} */`).join('\n') + codeStr : code,
                type: 'main',
                language: 'tsx',
            }
        ]
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
            imports: `import MDX_Demo_${index} from "${resolve(tempDir.replace(workingDir, ''), `./demos/${key}.demo.jsx`)}";`,
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

