"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _fs = require("fs");

var _path = require("path");

const jsExtNames = ['.tsx', '.ts', '.jsx', 'js'];

function _default(filepath) {
  let extName = (0, _path.extname)(filepath);

  if (!(jsExtNames.every(xn => xn !== extName) && !!extName)) {
    // js、ts代码
    extName = jsExtNames.find(xn => {
      return (0, _fs.existsSync)(filepath + xn);
    });

    if (extName) {
      filepath = filepath + extName;
    } else {
      return null;
    }
  }

  const codeObj = {
    code: '',
    filename: (0, _path.basename)(filepath) + extName,
    language: extName.replace('.', '')
  };

  try {
    codeObj.code = (0, _fs.readFileSync)(filepath, {
      encoding: 'utf8'
    });
    return codeObj;
  } catch (error) {
    return null;
  }
}