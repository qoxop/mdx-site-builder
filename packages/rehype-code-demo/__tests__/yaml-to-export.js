const yaml = require('yaml');

const gsrc = ({name, code}, other) => `

export const ${name} = ${code};

${other}
`

module.exports = function (src, name, filepath) {
    const reg = /^---\n(.*\n)+---/;
    const yamlMatchArray = src.match(reg);
    if (yamlMatchArray) {
        // 删除 yaml 字符串
        src = Buffer.from(src.replace(yamlMatchArray[0], ''));
        // 提取 yamlText
        const yamlText = yamlMatchArray[0].replace(/---/g, '');
        try {
            // 解析 yaml
            const yamlData = yaml.parse(yamlText);
            return {
                src: gsrc({name, code: JSON.stringify({ ...yamlData, filepath })}, src),
                config: { ...yamlData, filepath }
            }
        } catch (error) {
            return { src, config: {} };
        }
    }
    return { src, config: {} };
}