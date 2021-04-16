"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _unistUtilVisit = _interopRequireDefault(require("unist-util-visit"));

var _jsxGenerator = _interopRequireDefault(require("./jsx-generator"));

var _path = require("path");

var fs = _interopRequireWildcard(require("fs"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isPreDemoCode = node => {
  return node.tagName === 'pre' && node.children && node.children.length === 1 && node.children.length === 1 && node.children[0].tagName === 'code' && /language-[t,j]sx/.test(node.children[0]?.properties?.className) && !node.children[0]?.properties?.pure;
};

function _default(options) {
  const {
    workingDir,
    tempDir,
    fileconfig
  } = options;

  if (!fs.existsSync((0, _path.resolve)(workingDir, tempDir, `./demos/`))) {
    fs.mkdirSync((0, _path.resolve)(workingDir, tempDir, `./demos/`));
  }

  return function transformer(tree) {
    const imports = [];
    let demoIndex = 0;
    let hasPreCode = false;

    function visitor(node, index, parent) {
      if (isPreDemoCode(node) && !fileconfig.pure) {
        console.log('success');
        hasPreCode = true;
        demoIndex++; // 从节点获取信息

        const codeNode = node.children[0];
        const textNode = codeNode.children[0];
        const properties = codeNode.properties;
        const innerCode = textNode.value;
        const result = (0, _jsxGenerator.default)(innerCode, {
          index,
          live: !!properties?.live,
          properties,
          options
        });

        if (result) {
          imports.push(result.imports);
          parent.children[index] = result.node;
        }
      }
    }

    (0, _unistUtilVisit.default)(tree, 'element', visitor);

    if (hasPreCode && imports.length) {
      const importStr = imports.map(item => `${item}`).join('\n');
      tree.children.unshift({
        type: "import",
        value: importStr
      });
    }
  };
}