"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generator;

var _path = require("path");

var _parseImports = _interopRequireDefault(require("./utils/parse-imports"));

var ComponentCreator = _interopRequireWildcard(require("./utils/component-creator"));

var _codeReader = _interopRequireDefault(require("./utils/code-reader"));

var fs = _interopRequireWildcard(require("fs"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const generatorImportCode = infos => infos.map(item => {
  if (item["*"]) {
    return `import * as ${item['*']} from "${item.moduleName}";`;
  } else {
    const others = Object.keys(item.properties || {}).map(k => {
      if (k === item.properties[k]) {
        return k;
      } else {
        return `${k} as ${item.properties[k]}`;
      }
    }).join(', ');

    if (item.defaultProperty) {
      if (others) {
        return `import ${item.defaultProperty}, { ${others} } from "${item.moduleName}";`;
      } else {
        return `import ${item.defaultProperty} from "${item.moduleName}";`;
      }
    } else if (others) {
      return `import { ${others} } from "${item.moduleName}";`;
    } else {
      return `import "${item.moduleName}";`;
    }
  }
}).join('\n');

function generator(code, metadata) {
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
    const {
      code: codeStr,
      infos
    } = (0, _parseImports.default)(code); // 相对路径的文件

    const relativeFiles = []; // 路径转化

    infos.forEach(item => {
      if (/^\.\.?\//.test(item.moduleName)) {
        // 相对路径 => 绝对路径
        relativeFiles.push((0, _path.resolve)(workingDir || '', curFilePath, item.moduleName));
        item.moduleName = (0, _path.resolve)(curFilePath, item.moduleName);
      }
    }); // 重新生成 import code 

    const importCode = generatorImportCode(infos); // 每一个 demo 对应的 key 值

    const key = `${curFilePath.replace(/\/|\./g, '-').toLowerCase()}-d-${index}`;
    let demo = '';

    if (live) {
      demo = ComponentCreator.live({
        importCode,
        code: codeStr,
        properties,
        key,
        scopes: {},
        ...LiveComponent
      });
    } else {
      demo = ComponentCreator.preview({
        mainCode: codeStr,
        importCode,
        key
      });
    } // 将 demo 组件写入临时目录文件


    fs.writeFileSync((0, _path.resolve)(workingDir, tempDir, `./demos/${key}.demo.jsx`), demo); // 处理展示用的代码

    const codes = [{
      code: live ? infos.map(item => `/* ${item.origin} */`).join('\n') + codeStr : code,
      type: 'main',
      language: 'tsx'
    }];

    if (viewRelative) {
      relativeFiles.forEach(item => {
        const obj = (0, _codeReader.default)(item);

        if (obj) {
          codes.push({ ...obj,
            type: 'minor'
          });
        }
      });
    }

    return {
      // 将 demo 引入页面
      imports: `import MDX_Demo_${index} from "${(0, _path.resolve)(tempDir.replace(workingDir, ''), `./demos/${key}.demo.jsx`)}";`,
      node: {
        type: 'jsx',
        value: ComponentCreator.codeDisplay({
          name: DisplayComponentName,
          demoCompName: `MDX_Demo_${index}`,
          isLive: live,
          properties,
          key,
          codes
        })
      }
    };
  } catch (error) {
    console.error(error);
    return false;
  }
}