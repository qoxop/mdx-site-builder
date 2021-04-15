import { existsSync, readFileSync } from 'fs';
import { extname, basename } from 'path';

const jsExtNames = ['.tsx', '.ts', '.jsx', 'js'];

export default function(filepath:string) {
    let extName = extname(filepath);
    if (!(jsExtNames.every(xn => xn !== extName) && !!extName)) { // js、ts代码
        extName = jsExtNames.find(xn => {
            return existsSync(filepath+xn);
        });
        if (extName) {
            filepath = filepath + extName;
        } else {
            return null;
        }
    }
    const codeObj = {
        code: '',
        filename: basename(filepath) + extName,
        language: extName.replace('.', '')
    }
    try {
        codeObj.code = readFileSync(filepath, {encoding: 'utf8'});
        return codeObj;
    } catch (error) {
        return null;
    }
}