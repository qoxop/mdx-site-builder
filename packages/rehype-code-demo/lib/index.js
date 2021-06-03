"use strict";

var _unistUtilVisit = _interopRequireDefault(require("unist-util-visit"));

var _jsxGenerator = _interopRequireDefault(require("./jsx-generator"));

var fs = _interopRequireWildcard(require("fs"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isPreDemoCode = node => {
  return node.tagName === 'pre' && node.children && node.children.length === 1 && node.children.length === 1 && node.children[0].tagName === 'code' && /language-[t,j]sx/.test(node.children[0]?.properties?.className) && !node.children[0]?.properties?.pure;
};

module.exports = function (options) {
  const {
    demopath,
    fileconfig,
    DisplayComponent
  } = options; // 确保 demo 文件路径存在

  if (!fs.existsSync(demopath)) {
    fs.mkdirSync(demopath);
  }

  return function transformer(tree) {
    const imports = [];
    let demoIndex = 0;
    let hasPreCode = false;

    function visitor(node, index, parent) {
      // 简单判断是否是 jsx、tsx 代码，配置文件中是否配置了pure
      if (isPreDemoCode(node) && !fileconfig.pure) {
        // 打上标识
        hasPreCode = true; // demo 代码个数递增

        demoIndex++; // 从节点获取信息

        const codeNode = node.children[0];
        const textNode = codeNode.children[0];
        /** 代码块的属性 */

        const properties = codeNode.properties;
        /** 代码字符串 */

        const innerCode = textNode.value;
        /** 代码解析结果 */

        const result = (0, _jsxGenerator.default)(innerCode, {
          index: demoIndex,
          live: !!properties?.live,
          properties,
          options
        });
        /** 不为nul、false 表示解析成功 */

        if (result) {
          imports.push(result.imports);
          parent.children[index] = result.node;
        }
      }
    } // 遍历语法树


    (0, _unistUtilVisit.default)(tree, 'element', visitor); // 往头部插入 import 代码

    if (hasPreCode && imports.length) {
      imports.push(`import ${DisplayComponent.name} from '${DisplayComponent.path}';`);
      const importStr = imports.map(item => `${item}`).join('\n');
      tree.children.unshift({
        type: "import",
        value: importStr
      });
    }
  };
};