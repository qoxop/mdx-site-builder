import ts from 'typescript';
import { IImportInfo } from '../types';

/**
 * @param code string
 * @returns {infos, code}
 */
export default function parse(code:string):{infos: IImportInfo[], code: string} {
    const sourceFile = ts.createSourceFile('', code,  ts.ScriptTarget.ES5, true, ts.ScriptKind.TSX);
    const queryImportScope = (importDeclaration: ts.Node) => {
        const info:IImportInfo = {
            '*': '',
            defaultProperty: '',
            properties: {},
            moduleName: '',
            moduleScopeName: '',
            origin: ''
        };
        if (ts.isImportDeclaration(importDeclaration)) {
            info.moduleName = importDeclaration.moduleSpecifier.getText().replace(/\'|\"/g, '');
            info.origin = importDeclaration.getFullText().replace(/\n/g, '');
            info.moduleScopeName = info.moduleName.replace(/\/(\w)/g, ($0, $1) => $1.toUpperCase()).replace(/[\.\/@\~]/g, '');
            const visitor = (node:ts.Node) => {
                if (ts.isImportClause(node)) {
                    const firstNode = node.getChildAt(0);
                    if (ts.isIdentifier(firstNode)) {
                        info.defaultProperty = firstNode.getText();
                    } else if (ts.isNamespaceImport(firstNode)) {
                        info['*'] = firstNode.name.getText()
                    }
                } else if (ts.isImportSpecifier(node)) {
                    const propertyName = (node.propertyName || node.name).escapedText;
                    info.properties[`${propertyName}`] = node.name.getText();
                }
                node.forEachChild(visitor);
            }
            visitor(importDeclaration);
        }
        return info;
    }
    // 所有的导入声明
    const importDeclarations = sourceFile.statements.filter(node => ts.isImportDeclaration(node));
    const importInfos = importDeclarations.map(node => queryImportScope(node)).filter(item => !!item.moduleName);
    const newSourceFile = ts.factory.updateSourceFile(
        sourceFile,
        sourceFile.statements.filter(node => !ts.isImportDeclaration(node)),
    );
    return {
        code: ts.createPrinter().printFile(newSourceFile),
        infos: importInfos,
    }
}