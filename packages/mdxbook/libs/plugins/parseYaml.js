const yaml = require('yaml');

module.exports = {
    condition: (vfile) => vfile.extname === '.mdx',
    runner: ({file, updateData, addFile, encoding}) => new Promise((rs) => {
        const contentsText = file.contents.toString();
        const reg = /^---\n(.*\n)+---/;
        const yamlMatchArray = contentsText.match(reg);
        if (yamlMatchArray) {
            // 删除 yaml 字符串
            file.contents = Buffer.from(contentsText.replace(yamlMatchArray[0], ''));
            // 提取 yamlText
            const yamlText = yamlMatchArray[0].replace(/---/g, '');
            try {
                updateData({ yamlInfo: yaml.parse(yamlText)})
            } catch (error) {
                console.warn('yaml解析异常：\n', error);
            }
        }
        rs(file);
    })
}
