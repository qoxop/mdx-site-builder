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

export default function(options: IOptions) {
    const {
        workingDir,
        tempDir,
        fileconfig,
    } = options;
    if (!fs.existsSync(resolve(workingDir, tempDir, `./demos/`))) {
        fs.mkdirSync(resolve(workingDir, tempDir, `./demos/`))
    }
    return function transformer(tree) {
        const imports = [];
        let demoIndex = 0
        let hasPreCode = false;
        function visitor(node, index, parent) {
            if (isPreDemoCode(node) && !fileconfig.pure) {
                console.log('success')
                hasPreCode = true;
                demoIndex++;
                // 从节点获取信息
                const codeNode = node.children[0];
                const textNode =  codeNode.children[0];
                const properties = codeNode.properties;
                const innerCode = textNode.value;
                
                const result = jsxCreator(innerCode, {
                    index,
                    live: !!properties?.live,
                    properties,
                    options,
                });
                if (result) {
                    imports.push(result.imports)
                    parent.children[index] = result.node;
                }
            }
        }
        visit(tree, 'element', visitor);
        if (hasPreCode && imports.length) {
            const importStr = imports.map(item =>`${item}`).join('\n');
            tree.children.unshift({
                type: "import",
                value: importStr,
            })
        }
        
    }
}