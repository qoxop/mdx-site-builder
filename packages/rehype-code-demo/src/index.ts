import visit from 'unist-util-visit';
import { IOptions } from './types';
import jsxCreator from './jsx-generator';
import { resolve } from 'path';
import * as fs from  'fs';

const isPreDemoCode = (node) => {
    return (
        node.tagName === 'pre' &&
        node.children &&
        node.children.length === 1 &&
        node.children.length === 1 &&
        node.children[0].tagName === 'code' &&
        /language-[t,j]sx/.test(node.children[0]?.properties?.className) && 
        !node.children[0]?.properties?.pure
    )
}

module.exports = function(options: IOptions) {
    const {
        workingDir,
        demopath,
        fileconfig,
        DisplayComponent
    } = options;
    // 确保 demo 文件路径存在
    if (!fs.existsSync(resolve(workingDir, demopath))) {
        fs.mkdirSync(resolve(workingDir, demopath))
    }
    return function transformer(tree) {
        const imports = [];
        let demoIndex = 0
        let hasPreCode = false;
        function visitor(node, index, parent) {
            // 简单判断是否是 jsx、tsx 代码，配置文件中是否配置了pure
            if (isPreDemoCode(node) && !fileconfig.pure) {
                // 打上标识
                hasPreCode = true;
                // demo 代码个数递增
                demoIndex++;
                // 从节点获取信息
                const codeNode = node.children[0];
                const textNode =  codeNode.children[0];
                /** 代码块的属性 */
                const properties = codeNode.properties;
                /** 代码字符串 */
                const innerCode = textNode.value;
                
                /** 代码解析结果 */
                const result = jsxCreator(innerCode, {
                    index: demoIndex,
                    live: !!properties?.live,
                    properties,
                    options,
                });
                /** 不为nul、false 表示解析成功 */
                if (result) {
                    imports.push(result.imports)
                    parent.children[index] = result.node;
                }
            }
        }
        // 遍历语法树
        visit(tree, 'element', visitor);
        // 往头部插入 import 代码
        if (hasPreCode && imports.length) {
            imports.push(`import ${DisplayComponent.name} from '${DisplayComponent.path}';`)
            const importStr = imports.map(item =>`${item}`).join('\n');
            tree.children.unshift({
                type: "import",
                value: importStr,
            })
        }
        
    }
}