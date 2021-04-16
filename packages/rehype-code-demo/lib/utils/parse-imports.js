"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parse;

var _typescript = _interopRequireDefault(require("typescript"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param code string
 * @returns {infos, code}
 */
function parse(code) {
  const sourceFile = _typescript.default.createSourceFile('', code, _typescript.default.ScriptTarget.ES5, true, _typescript.default.ScriptKind.TSX);

  const queryImportScope = importDeclaration => {
    const info = {
      '*': '',
      defaultProperty: '',
      properties: {},
      moduleName: '',
      moduleScopeName: '',
      origin: ''
    };

    if (_typescript.default.isImportDeclaration(importDeclaration)) {
      info.moduleName = importDeclaration.moduleSpecifier.getText().replace(/\'|\"/g, '');
      info.origin = importDeclaration.getFullText().replace(/\n/g, '');
      info.moduleScopeName = info.moduleName.replace(/\/(\w)/g, ($0, $1) => $1.toUpperCase()).replace(/[\.\/@\~]/g, '');

      const visitor = node => {
        if (_typescript.default.isImportClause(node)) {
          const firstNode = node.getChildAt(0);

          if (_typescript.default.isIdentifier(firstNode)) {
            info.defaultProperty = firstNode.getText();
          } else if (_typescript.default.isNamespaceImport(firstNode)) {
            info['*'] = firstNode.name.getText();
          }
        } else if (_typescript.default.isImportSpecifier(node)) {
          const propertyName = (node.propertyName || node.name).escapedText;
          info.properties[`${propertyName}`] = node.name.getText();
        }

        node.forEachChild(visitor);
      };

      visitor(importDeclaration);
    }

    return info;
  }; // 所有的导入声明


  const importDeclarations = sourceFile.statements.filter(node => _typescript.default.isImportDeclaration(node));
  const importInfos = importDeclarations.map(node => queryImportScope(node)).filter(item => !!item.moduleName);

  const newSourceFile = _typescript.default.factory.updateSourceFile(sourceFile, sourceFile.statements.filter(node => !_typescript.default.isImportDeclaration(node)));

  return {
    code: _typescript.default.createPrinter().printFile(newSourceFile),
    infos: importInfos
  };
}